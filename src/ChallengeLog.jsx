import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { challengeLogEntries } from "./challengeLogData.js";
import "./challenge-log.css";

const resultFilters = ["전체", "붙음", "떨어짐"];

function ChallengeEntry({ entry, sequence }) {
  const visibilityLabel = entry.repository?.visibility === "PRIVATE"
    ? "Private repository"
    : "Public repository";
  const connectionParts = entry.connection?.split(" · ");

  return (
    <li className="challenge-entry-item">
      <article className="challenge-entry">
        <div className="challenge-entry-heading">
          <span className="challenge-sequence">{String(sequence).padStart(2, "0")}</span>
          <span className={`challenge-result ${entry.result === "붙음" ? "is-passed" : "is-not-selected"}`}>
            {entry.result}
          </span>
        </div>
        <h3>{entry.activity}</h3>
        {entry.project ? (
          <div className="challenge-project">
            <span>연결 프로젝트</span>
            <strong>{entry.project}</strong>
            {entry.projectNote ? <p>{entry.projectNote}</p> : null}
          </div>
        ) : (
          <div className="challenge-no-connection">
            <span>연결 정보</span>
            <strong>{connectionParts[0]} · <span>{connectionParts[1]}</span></strong>
          </div>
        )}
        {entry.repository ? (
          <a
            className="challenge-repository"
            href={entry.repository.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${entry.project} GitHub 저장소 열기, ${visibilityLabel}`}
          >
            <span>
              <small>GitHub</small>
              <strong>{entry.repository.name}</strong>
              <em>{visibilityLabel}</em>
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        ) : null}
      </article>
    </li>
  );
}

export function ChallengeLogPage() {
  const [filter, setFilter] = useState("전체");
  const passedCount = challengeLogEntries.filter((entry) => entry.result === "붙음").length;
  const notSelectedCount = challengeLogEntries.length - passedCount;
  const visibleEntries = filter === "전체"
    ? challengeLogEntries
    : challengeLogEntries.filter((entry) => entry.result === filter);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Challenge Log | INHODEV";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="challenge-log-page">
      <header className="challenge-floating-header">
        <a className="challenge-brand-link" href="/" aria-label="INHODEV 포트폴리오로 이동">
          <span className="brand-mark">INHODEV</span>
        </a>
        <span className="challenge-direct-label">주소로 보는 개인 기록</span>
        <a className="challenge-back-link" href="/">
          <ArrowLeft size={17} aria-hidden="true" /> Portfolio
        </a>
      </header>

      <main>
        <section className="challenge-hero" aria-labelledby="challenge-title">
          <p className="section-kicker">Challenge log · 개인 기록</p>
          <h1 id="challenge-title">붙은 기록도,<br />떨어진 기록도.</h1>
          <p className="challenge-hero-copy">
            결과를 가리지 않고 무엇에 도전했고 어떤 제품을 연결했는지 남깁니다.
            확인되지 않은 날짜, 등수, 수상 명칭은 적지 않았습니다.
          </p>
          <dl className="challenge-summary" aria-label="도전 기록 요약">
            <div><dt>전체 기록</dt><dd>{challengeLogEntries.length}</dd></div>
            <div><dt>붙음</dt><dd>{passedCount}</dd></div>
            <div><dt>떨어짐</dt><dd>{notSelectedCount}</dd></div>
          </dl>
        </section>

        <section className="challenge-catalog-shell" aria-labelledby="challenge-records-title">
          <div className="challenge-catalog-window">
            <div className="challenge-catalog-heading">
              <div>
                <p className="section-kicker">All attempts</p>
                <h2 id="challenge-records-title">도전 기록</h2>
              </div>
              <p>프로젝트와 저장소가 확인된 범위만 연결했습니다.</p>
            </div>
            <div className="challenge-controls">
              <div className="challenge-filter-pills" role="group" aria-label="결과 필터">
                {resultFilters.map((item) => {
                  const count = item === "전체"
                    ? challengeLogEntries.length
                    : challengeLogEntries.filter((entry) => entry.result === item).length;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={filter === item}
                      onClick={() => setFilter(item)}
                    >
                      {item} <span>{count}</span>
                    </button>
                  );
                })}
              </div>
              <p aria-live="polite">{visibleEntries.length} records</p>
            </div>
            <ol className="challenge-list">
              {visibleEntries.map((entry) => (
                <ChallengeEntry
                  key={entry.id}
                  entry={entry}
                  sequence={challengeLogEntries.indexOf(entry) + 1}
                />
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="challenge-page-footer">
        <span className="brand-mark">INHODEV</span>
        <p>확인된 연결만 기록했습니다.</p>
        <a href="/">Portfolio <ArrowUpRight size={16} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
