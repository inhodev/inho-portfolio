import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { challengeLogEntries } from "./challengeLogData.js";
import "./challenge-log.css";

const resultFilters = ["전체", "붙음", "떨어짐"];

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.128-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" />
    </svg>
  );
}

function ChallengeEntry({ entry, sequence }) {
  const visibilityLabel = entry.repository?.visibility === "PRIVATE"
    ? "비공개 저장소"
    : "공개 저장소";
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
            <span>참가한 프로젝트</span>
            <strong>{entry.project}</strong>
            {entry.projectNote ? <p>{entry.projectNote}</p> : null}
          </div>
        ) : (
          <div className="challenge-no-connection">
            <span>참여 내용</span>
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
              <small>
                <GitHubMark />
                GitHub
              </small>
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
    document.title = "도전 기록 | INHODEV";
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
        <span className="challenge-direct-label">개인 확인용 기록</span>
        <a className="challenge-back-link" href="/">
          <ArrowLeft size={17} aria-hidden="true" /> 포트폴리오
        </a>
      </header>

      <main>
        <section className="challenge-hero" aria-labelledby="challenge-title">
          <p className="section-kicker">공모전과 해커톤 기록</p>
          <h1 id="challenge-title">붙은 기록도,<br />떨어진 기록도.</h1>
          <p className="challenge-hero-copy">
            공모전과 해커톤에 어떤 제품으로 참가했는지 정리했습니다.
            제품이 없었던 참여 기록도 남겼고, 확인하지 못한 날짜와 순위는 넣지 않았습니다.
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
                <p className="section-kicker">전체 참여 기록</p>
                <h2 id="challenge-records-title">도전 기록</h2>
              </div>
              <p>참가한 제품과 GitHub 저장소가 있는 활동은 함께 적었습니다.</p>
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
              <p aria-live="polite">{visibleEntries.length}개 기록</p>
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
        <p>확인한 내용만 적었습니다.</p>
        <a href="/">포트폴리오 <ArrowUpRight size={16} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
