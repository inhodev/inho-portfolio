import assert from "node:assert/strict";
import test from "node:test";
import { challengeLogEntries } from "../src/challengeLogData.js";

const canonicalMapping = [
  ["붙음", "안산공모전", "안산 골목 회복 신호등", "inhodev/ansan-life-map"],
  ["붙음", "코덱스 스튜던트 해커톤", "MeSource", "codex-hakathon-1/personal-rag-ontology"],
  ["붙음", "코덱스 글로벌 피드백 세션", null, null],
  ["붙음", "아주·인하 해커톤", "Aington", "inhodev/Aington"],
  ["떨어짐", "아산 두어스", "Copyvara", "inhodev/copyvara-fast"],
  ["떨어짐", "U300", "Copyvara", "inhodev/copyvara-fast"],
  ["떨어짐", "아랩 엑셀러레이팅", "Copyvara", "inhodev/copyvara-fast"],
  ["떨어짐", "모창 2라운드", "RunQuest", "inhodev/RunQuest"],
  ["떨어짐", "코덱스 게임 해커톤", "Tiny Airport", "inhodev/tiny-airport"],
  ["떨어짐", "인천대학연합아카데미", "imfine / 프로젝트 타임슬립", "inhodev/imfine"],
  ["떨어짐", "조코딩 해커톤", "Copyvara", "inhodev/copyvara-fast"],
];

test("keeps the canonical eleven challenge mappings", () => {
  assert.deepEqual(
    challengeLogEntries.map((entry) => [
      entry.result,
      entry.activity,
      entry.project,
      entry.repository?.name ?? null,
    ]),
    canonicalMapping,
  );
  assert.equal(challengeLogEntries.filter((entry) => entry.result === "붙음").length, 4);
  assert.equal(challengeLogEntries.filter((entry) => entry.result === "떨어짐").length, 7);
});

test("keeps repository visibility and unverified result details explicit", () => {
  const privateRepositories = challengeLogEntries
    .filter((entry) => entry.repository?.visibility === "PRIVATE")
    .map((entry) => entry.repository.name);

  assert.deepEqual(privateRepositories, [
    "inhodev/ansan-life-map",
    "inhodev/RunQuest",
    "inhodev/tiny-airport",
    "inhodev/imfine",
  ]);

  const feedbackSession = challengeLogEntries.find((entry) => entry.id === "codex-global-feedback");
  assert.equal(feedbackSession.connection, "참여 이력 · 연결 프로젝트 없음");
  assert.equal(feedbackSession.project, null);
  assert.equal(feedbackSession.repository, null);

  for (const entry of challengeLogEntries) {
    for (const field of ["date", "rank", "award", "placement", "selectionTitle"]) {
      assert.equal(field in entry, false, `${entry.id} must not include ${field}`);
    }
  }
});
