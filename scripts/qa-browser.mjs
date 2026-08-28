import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import net from "node:net";
import path from "node:path";

const chromePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targetUrl = process.argv[2] ?? "http://127.0.0.1:4174/";
const outputRoot = path.resolve(process.argv[3] ?? "evidence/browser-qa");
const profileDir = path.join(outputRoot, "chrome-profile");

await fs.mkdir(outputRoot, { recursive: true });
await fs.mkdir(profileDir, { recursive: true });

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function getFreePort() {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function waitForJson(url, attempts = 80) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(250);
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result ?? {});
        return;
      }
      for (const listener of this.events.get(message.method) ?? []) {
        listener(message.params ?? {});
      }
    });
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  on(method, listener) {
    const listeners = this.events.get(method) ?? [];
    listeners.push(listener);
    this.events.set(method, listeners);
  }

  once(method, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const listeners = this.events.get(method) ?? [];
      const handler = (params) => {
        clearTimeout(timer);
        this.events.set(method, (this.events.get(method) ?? []).filter((entry) => entry !== handler));
        resolve(params);
      };
      const timer = setTimeout(() => {
        this.events.set(method, (this.events.get(method) ?? []).filter((entry) => entry !== handler));
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
      listeners.push(handler);
      this.events.set(method, listeners);
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression, awaitPromise = false) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? "Runtime evaluation failed");
  }
  return result.result?.value;
}

async function setViewport(client, width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await client.send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
}

async function navigate(client) {
  const loaded = client.once("Page.loadEventFired").catch(() => null);
  await client.send("Page.navigate", { url: targetUrl });
  await loaded;
  await evaluate(client, "document.fonts?.ready?.then(() => true)", true).catch(() => null);
  await sleep(800);
}

async function capture(client, filename) {
  const { data } = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.writeFile(path.join(outputRoot, filename), Buffer.from(data, "base64"));
}

async function waitFor(client, expression, label, attempts = 40) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await evaluate(client, expression)) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function clickByText(client, selector, text) {
  const clicked = await evaluate(client, `(() => {
    const target = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((element) => element.textContent.trim() === ${JSON.stringify(text)});
    if (!target) return false;
    target.click();
    return true;
  })()`);
  assert.equal(clicked, true, `Could not click ${text}`);
}

async function setSearch(client, value) {
  const changed = await evaluate(client, `(() => {
    const input = document.querySelector('.search-field input');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  assert.equal(changed, true, "Search input was not found");
  await sleep(250);
}

async function projectNames(client) {
  return await evaluate(client, `[...document.querySelectorAll('.project-card h3')].map((node) => node.textContent.trim())`);
}

const port = await getFreePort();
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--disable-background-networking",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-extensions",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });

let chromeStderr = "";
chrome.stderr.on("data", (chunk) => { chromeStderr += chunk.toString(); });

const report = {
  targetUrl,
  assertions: [],
  consoleErrors: [],
  runtimeExceptions: [],
  failedResponses: [],
  failedLoads: [],
};

function record(name, detail) {
  report.assertions.push({ name, detail });
}

try {
  await waitForJson(`http://127.0.0.1:${port}/json/version`);
  const pageTarget = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" }).then((response) => response.json());
  const client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.open();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  client.on("Runtime.consoleAPICalled", (event) => {
    if (event.type === "error") report.consoleErrors.push(event.args.map((argument) => argument.value ?? argument.description).join(" "));
  });
  client.on("Runtime.exceptionThrown", (event) => report.runtimeExceptions.push(event.exceptionDetails?.text ?? "Runtime exception"));
  client.on("Network.responseReceived", (event) => {
    if (event.response.status >= 400) report.failedResponses.push({ url: event.response.url, status: event.response.status });
  });
  client.on("Network.loadingFailed", (event) => {
    if (!event.canceled) report.failedLoads.push({ errorText: event.errorText, type: event.type });
  });

  await setViewport(client, 1280, 900, false);
  await navigate(client);
  const desktopInitial = await evaluate(client, `(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    cards: document.querySelectorAll('.project-card').length,
    disclosures: document.querySelectorAll('.project-core').length,
    evidenceCards: document.querySelectorAll('.evidence-grid article').length,
    taxonomyKorean: [...document.querySelectorAll('.taxonomy-group li span')].map((node) => node.textContent.trim()),
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
    imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).map((image) => image.src),
    unlabeledControls: [...document.querySelectorAll('button, a, input')].filter((element) => {
      const name = element.getAttribute('aria-label') || element.textContent.trim();
      return !name;
    }).map((element) => element.outerHTML.slice(0, 160)),
    language: document.documentElement.lang,
    title: document.title,
  }))()`);
  assert.equal(desktopInitial.overflow, 0);
  assert.equal(desktopInitial.cards, 6);
  assert.equal(desktopInitial.disclosures, 6);
  assert.equal(desktopInitial.evidenceCards, 3);
  assert.equal(desktopInitial.taxonomyKorean.length, 16);
  assert.ok(desktopInitial.taxonomyKorean.includes('화면부터 서버까지'));
  assert.deepEqual(desktopInitial.brokenImages, []);
  assert.deepEqual(desktopInitial.imagesWithoutAlt, []);
  assert.deepEqual(desktopInitial.unlabeledControls, []);
  assert.equal(desktopInitial.language, "ko");
  assert.equal(desktopInitial.title, "INHODEV — Product Developer");
  record("desktop initial", desktopInitial);

  await clickByText(client, ".hero-actions button", "프로젝트 보기");
  await waitFor(client, "window.scrollY > 600", "desktop catalog scroll");
  const desktopScrollY = await evaluate(client, "window.scrollY");
  record("desktop primary CTA", { scrollY: desktopScrollY });
  await capture(client, "desktop-catalog.png");

  const coreDisclosure = await evaluate(client, `(() => {
    const details = document.querySelector('.project-core');
    details?.querySelector('summary')?.click();
    return {
      open: details?.open,
      items: details ? [...details.querySelectorAll('li')].map((node) => node.textContent.trim()) : [],
      dialogOpen: Boolean(document.querySelector('[role=dialog]')),
    };
  })()`);
  assert.equal(coreDisclosure.open, true);
  assert.equal(coreDisclosure.items.length, 3);
  assert.equal(coreDisclosure.dialogOpen, false);
  record("desktop core disclosure", coreDisclosure);

  await setSearch(client, "TOY");
  const searchResults = await projectNames(client);
  assert.deepEqual(searchResults, ["TOY"]);
  record("desktop search", { query: "TOY", results: searchResults });

  await setSearch(client, "");
  await clickByText(client, ".filter-pills button", "iOS");
  await sleep(250);
  const iosResults = await projectNames(client);
  assert.deepEqual(iosResults, ["COSMODAY", "TOY", "Rewind"]);
  record("desktop iOS filter", { results: iosResults });

  await clickByText(client, ".filter-pills button", "All");
  await clickByText(client, ".filter-button", "Filter");
  await waitFor(client, "Boolean(document.querySelector('.filter-panel'))", "filter explanation");
  record("desktop filter disclosure", await evaluate(client, "document.querySelector('.filter-panel').textContent.trim()"));

  const openedRunQuest = await evaluate(client, `(() => {
    const card = [...document.querySelectorAll('.project-card')].find((item) => item.querySelector('h3')?.textContent.trim() === 'RunQuest');
    if (!card) return false;
    const button = card.querySelector('.project-card-open');
    button.focus();
    button.click();
    return true;
  })()`);
  assert.equal(openedRunQuest, true);
  await waitFor(client, "Boolean(document.querySelector('[role=dialog]'))", "RunQuest detail dialog");
  await sleep(350);
  const dialogState = await evaluate(client, `(() => ({
    title: document.querySelector('[role=dialog] h1')?.textContent,
    images: document.querySelectorAll('[role=dialog] .detail-screens img').length,
    bodyOverflow: document.body.style.overflow,
    facts: [...document.querySelectorAll('[role=dialog] .detail-facts div')].map((item) => ({
      label: item.querySelector('dt')?.textContent.trim(),
      value: item.querySelector('dd')?.textContent.trim(),
    })),
    narrative: document.querySelector('[role=dialog] .detail-narrative')?.textContent.trim(),
  }))()`);
  assert.equal(dialogState.title, "RunQuest");
  assert.equal(dialogState.images, 4);
  assert.equal(dialogState.bodyOverflow, "hidden");
  assert.deepEqual(dialogState.facts.map((fact) => fact.label), ["기간", "팀 인원", "내 역할"]);
  assert.ok(dialogState.facts.every((fact) => fact.value));
  assert.ok(dialogState.narrative.length >= 80);
  record("desktop project detail", dialogState);
  const dialogInitialFocus = await evaluate(client, `({
    text: document.activeElement?.textContent.trim(),
    insideDialog: document.querySelector('[role=dialog]')?.contains(document.activeElement),
  })`);
  assert.equal(dialogInitialFocus.text, "All products");
  assert.equal(dialogInitialFocus.insideDialog, true);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", modifiers: 8 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", modifiers: 8 });
  const trappedFocus = await evaluate(client, `({
    label: document.activeElement?.getAttribute('aria-label'),
    insideDialog: document.querySelector('[role=dialog]')?.contains(document.activeElement),
  })`);
  assert.equal(trappedFocus.label, "OLIVE 프로젝트 보기");
  assert.equal(trappedFocus.insideDialog, true);
  record("desktop dialog focus trap", { initial: dialogInitialFocus, wrapped: trappedFocus });
  await capture(client, "desktop-runquest-detail.png");

  const nextProjectState = await evaluate(client, `(() => {
    const dialog = document.querySelector('[role=dialog]');
    dialog.scrollTop = dialog.scrollHeight;
    const before = { title: dialog.querySelector('h1')?.textContent, scrollTop: dialog.scrollTop };
    dialog.querySelector('.next-project-card')?.click();
    return before;
  })()`);
  assert.equal(nextProjectState.title, "RunQuest");
  assert.ok(nextProjectState.scrollTop > 0);
  await waitFor(client, "document.querySelector('[role=dialog] h1')?.textContent === 'OLIVE'", "next project navigation");
  await sleep(250);
  const nextProjectResult = await evaluate(client, `({
    title: document.querySelector('[role=dialog] h1')?.textContent,
    scrollTop: document.querySelector('[role=dialog]')?.scrollTop,
    nextLabel: document.querySelector('.next-project-card')?.getAttribute('aria-label'),
  })`);
  assert.deepEqual(nextProjectResult, { title: "OLIVE", scrollTop: 0, nextLabel: "INHA AI 프로젝트 보기" });
  record("desktop next project", nextProjectResult);
  await capture(client, "desktop-next-project.png");

  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await waitFor(client, "!document.querySelector('[role=dialog]')", "detail close on Escape");
  const restoredFocus = await evaluate(client, "document.activeElement?.classList.contains('project-card-open')");
  assert.equal(restoredFocus, true);
  record("desktop detail keyboard close", { closed: true, focusRestored: restoredFocus });

  await setViewport(client, 768, 1024, false);
  await navigate(client);
  const tabletState = await evaluate(client, `(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    columns: getComputedStyle(document.querySelector('.project-grid')).gridTemplateColumns.split(' ').length,
    taxonomyColumns: getComputedStyle(document.querySelector('.catalog-taxonomy')).gridTemplateColumns.split(' ').length,
    koreanVisible: [...document.querySelectorAll('.taxonomy-group li span')].every((node) => getComputedStyle(node).display !== 'none'),
  }))()`);
  assert.equal(tabletState.overflow, 0);
  assert.equal(tabletState.columns, 2);
  assert.equal(tabletState.taxonomyColumns, 2);
  assert.equal(tabletState.koreanVisible, true);
  record("tablet layout", tabletState);
  await evaluate(client, "document.querySelector('.catalog-shell').scrollIntoView({ block: 'start' })");
  await sleep(250);
  await capture(client, "tablet-catalog.png");

  await setViewport(client, 375, 812, true);
  await navigate(client);
  const mobileInitial = await evaluate(client, `(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    cards: document.querySelectorAll('.project-card').length,
    taxonomyKoreanVisible: [...document.querySelectorAll('.taxonomy-group li span')].every((node) => getComputedStyle(node).display !== 'none'),
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
    imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).map((image) => image.src),
  }))()`);
  assert.equal(mobileInitial.overflow, 0);
  assert.equal(mobileInitial.cards, 6);
  assert.equal(mobileInitial.taxonomyKoreanVisible, true);
  assert.deepEqual(mobileInitial.brokenImages, []);
  assert.deepEqual(mobileInitial.imagesWithoutAlt, []);
  record("mobile initial", mobileInitial);

  const menuClicked = await evaluate(client, `(() => {
    const button = document.querySelector('button[aria-label="메뉴 열기"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  assert.equal(menuClicked, true);
  await waitFor(client, "document.querySelector('.mobile-menu-button')?.getAttribute('aria-expanded') === 'true'", "mobile menu open");
  await sleep(350);
  await capture(client, "mobile-menu-open.png");
  record("mobile menu", { expanded: true });

  await clickByText(client, ".mobile-nav button", "Work");
  await waitFor(client, "window.scrollY > 500", "mobile catalog scroll");
  const mobileAfterWork = await evaluate(client, `({
    scrollY: window.scrollY,
    expanded: document.querySelector('.mobile-menu-button')?.getAttribute('aria-expanded'),
    overflow: document.documentElement.scrollWidth - innerWidth,
  })`);
  assert.equal(mobileAfterWork.expanded, "false");
  assert.equal(mobileAfterWork.overflow, 0);
  record("mobile Work navigation", mobileAfterWork);

  await setSearch(client, "TOY");
  const mobileSearchResults = await projectNames(client);
  assert.deepEqual(mobileSearchResults, ["TOY"]);
  await evaluate(client, "document.querySelector('.catalog-shell').scrollIntoView({ block: 'start' })");
  await sleep(350);
  await capture(client, "mobile-toy-search.png");
  record("mobile search", { query: "TOY", results: mobileSearchResults });

  const openedToy = await evaluate(client, `(() => {
    const card = document.querySelector('.project-card');
    if (!card) return false;
    card.querySelector('.project-card-open')?.click();
    return true;
  })()`);
  assert.equal(openedToy, true);
  await waitFor(client, "document.querySelector('[role=dialog] h1')?.textContent === 'TOY'", "TOY detail dialog");
  await sleep(350);
  const mobileDetail = await evaluate(client, `(() => ({
    title: document.querySelector('[role=dialog] h1')?.textContent,
    images: document.querySelectorAll('[role=dialog] .detail-screens img').length,
    overflow: document.documentElement.scrollWidth - innerWidth,
    facts: document.querySelectorAll('[role=dialog] .detail-facts div').length,
  }))()`);
  assert.deepEqual(mobileDetail, { title: "TOY", images: 5, overflow: 0, facts: 3 });
  await capture(client, "mobile-toy-detail.png");
  record("mobile project detail", mobileDetail);

  await clickByText(client, ".detail-nav button", "All products");
  await waitFor(client, "!document.querySelector('[role=dialog]')", "mobile detail close");
  record("mobile detail close", { closed: true });

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.runtimeExceptions, []);
  assert.deepEqual(report.failedResponses, []);
  assert.deepEqual(report.failedLoads, []);
  report.result = "passed";
  await fs.writeFile(path.join(outputRoot, "qa-report.json"), JSON.stringify(report, null, 2));
  client.close();
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.result = "failed";
  report.error = error.stack ?? String(error);
  await fs.writeFile(path.join(outputRoot, "qa-report.json"), JSON.stringify(report, null, 2));
  throw error;
} finally {
  chrome.kill("SIGTERM");
  await sleep(500);
  if (!chrome.killed) chrome.kill("SIGKILL");
  await fs.writeFile(path.join(outputRoot, "chrome-stderr.log"), chromeStderr);
}
