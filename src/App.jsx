import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Apple,
  Check,
  ChevronDown,
  Grid3X3,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ChallengeLogPage } from "./ChallengeLog.jsx";

const projects = [
  {
    id: "runquest",
    name: "RunQuest",
    eyebrow: "이야기를 들으며 달리는 러닝 앱",
    description: "달린 거리와 속도에 맞춰 이야기가 이어지는 오디오 러닝 앱입니다.",
    longDescription: "달리면 거리와 속도에 맞춰 이야기가 이어집니다. 운동을 마치면 기록과 다음 이야기를 보여줍니다.",
    platform: "Mobile",
    platformLabel: "모바일 앱",
    stack: "Flutter · Riverpod · GPS · 오디오",
    status: "시제품",
    year: "2026",
    period: "2026 · 시제품 제작",
    team: "1명",
    role: "기획, 앱 개발, 러닝 기록, 오디오 재생",
    accent: "#ff5a1f",
    icon: "/projects/runquest/icon.png",
    screenshots: [
      "/projects/runquest/01-home.png",
      "/projects/runquest/02-running.png",
      "/projects/runquest/03-report.png",
      "/projects/runquest/04-achievements.png",
    ],
    highlights: ["달린 거리와 이야기 진행 상황을 함께 기록", "거리와 속도에 맞춰 다음 오디오 재생", "운동이 끝나면 기록과 다음 이야기를 한 화면에 표시"],
    story: "달릴 때는 화면을 오래 보기 어렵습니다. 그래서 거리와 속도에 맞춰 이야기가 이어지도록 오디오 중심으로 만들었습니다. 달리기를 마친 뒤에는 운동 기록과 다음 이야기를 바로 볼 수 있습니다. 주요 화면과 기록 계산 기능은 자동 테스트로 다시 확인했습니다.",
    verification: "앱 화면은 자동으로 캡처했고, 거리와 이야기 진행을 계산하는 기능은 테스트했습니다. 온라인 저장 기능은 아직 연결하지 않았습니다.",
  },
  {
    id: "olive",
    name: "OLIVE",
    eyebrow: "내 상황에 맞는 찬양을 찾는 앱",
    description: "기분이나 상황을 입력하면 어울리는 찬양을 추천하고 모아두는 앱입니다.",
    longDescription: "기분과 상황으로 찬양을 찾고, 추천 곡을 듣고 저장한 뒤 내 기록으로 남길 수 있습니다.",
    platform: "Mobile",
    platformLabel: "모바일 앱",
    stack: "Flutter · Supabase · Riverpod · OpenAI",
    status: "시험 버전",
    year: "2026",
    period: "2026 · 시험 버전 제작",
    team: "1명",
    role: "기획, 앱 개발, 추천 기능, 콘텐츠 관리 화면",
    accent: "#4f7543",
    icon: "/projects/olive/icon.png",
    appStoreUrl: "https://apps.apple.com/kr/app/olive-%EC%B0%AC%EC%96%91/id6757365234",
    screenshots: [
      "/projects/olive/01-home.png",
      "/projects/olive/02-explore.png",
      "/projects/olive/03-mix.png",
      "/projects/olive/04-ai-answer.png",
      "/projects/olive/05-profile.png",
    ],
    highlights: ["기분과 상황을 입력해 찬양 추천받기", "추천 곡을 듣고 내 보관함에 저장", "사용자 앱과 콘텐츠 관리 화면을 함께 제작"],
    story: "노래 제목을 몰라도 지금 필요한 찬양을 찾을 수 있게 만들었습니다. 기분이나 상황을 적으면 곡을 추천받고, 들은 곡은 저장하거나 기록으로 남길 수 있습니다. 다른 사용자와 이야기를 나누는 공간과 콘텐츠를 관리하는 화면도 함께 만들었습니다.",
    verification: "현재 보이는 앱 화면과 Flutter 자동 테스트를 확인했습니다. 일부 화면은 이전 버전에서 촬영했습니다.",
  },
  {
    id: "inha-ai",
    name: "INHA AI",
    eyebrow: "학교 공식 자료로 답하는 캠퍼스 AI",
    description: "학사·장학·시설 질문에 학교 공식 출처를 붙여 답하는 웹 서비스입니다.",
    longDescription: "학생이 질문하면 학교 공식 자료에서 답을 찾습니다. 참고한 출처와 자료의 최신 여부도 함께 보여줍니다.",
    platform: "Web",
    platformLabel: "웹 서비스",
    stack: "React · Bun · PostgreSQL · pgvector",
    status: "테스트용 시제품",
    year: "2026",
    period: "2026 · 시제품 제작",
    team: "1명",
    role: "기획, 웹 개발, 자료 검색, 답변 확인 기능",
    accent: "#4a59ff",
    icon: "/projects/inha-ai/icon.png",
    screenshots: [
      "/projects/inha-ai/01-home-desktop.png",
      "/projects/inha-ai/03-answer-desktop.png",
      "/projects/inha-ai/02-home-mobile.png",
      "/projects/inha-ai/04-answer-mobile.png",
    ],
    highlights: ["학교 공지와 안내 자료에서 먼저 답 찾기", "답변 아래에 자료 출처와 최신 여부 표시", "학생용 질문 화면과 자료 관리 화면을 함께 제작"],
    story: "학교 생활 정보는 틀린 답 하나가 큰 불편으로 이어질 수 있습니다. 그래서 학교 공식 자료를 찾았을 때만 답하고, 어떤 자료를 참고했는지 답변 아래에 표시했습니다. 현재는 내 컴퓨터에서 질문을 입력해 출처가 붙은 답변이 나오는 과정까지 다시 확인했습니다.",
    verification: "내 컴퓨터에서 준비된 예시 자료를 사용해 질문부터 출처가 붙은 답변까지 다시 실행했습니다. 실제 학교 서버와 연결한 상태는 아닙니다.",
  },
  {
    id: "cosmoday",
    name: "COSMODAY",
    eyebrow: "매일 한 편씩 만나는 우주 이야기",
    description: "날짜마다 하나의 우주 이야기를 카드와 위젯으로 보여주는 아이폰 앱입니다.",
    longDescription: "날짜마다 하나의 우주 사건을 소개합니다. 중요한 천문 현상은 알림과 위젯, 공유 이미지로 다시 알려줍니다.",
    platform: "iOS",
    platformLabel: "아이폰 앱",
    stack: "SwiftUI · SwiftData · WidgetKit",
    status: "시험 버전",
    year: "2026",
    period: "2026 · 시험 버전 제작",
    team: "1명",
    role: "콘텐츠 기획, 아이폰 앱, 위젯, 1년치 콘텐츠 제작",
    accent: "#162fff",
    icon: "/projects/cosmoday/icon.png",
    screenshots: [
      "/projects/cosmoday/01-january.png",
      "/projects/cosmoday/02-supernova-poster.jpg",
      "/projects/cosmoday/03-cinematic.jpg",
      "/projects/cosmoday/04-june.jpg",
    ],
    highlights: ["날짜마다 하나씩 보여주는 짧은 우주 이야기", "앱·위젯·알림·공유 이미지에 같은 내용 제공", "1년치 우주 이야기를 만들고 확인하는 과정"],
    story: "어렵게 느껴지는 우주 이야기를 하루에 하나씩 가볍게 볼 수 있게 만들었습니다. 오늘의 카드 내용을 앱과 위젯, 알림, 공유 이미지에서도 볼 수 있게 했습니다. 1년치 이야기를 꾸준히 만들고 틀린 내용을 고칠 수 있도록 제작 과정도 정리했습니다.",
    verification: "현재 화면에는 검토를 마친 콘텐츠 카드와 영상용 이미지를 사용했습니다. 이번 자동 화면 테스트는 앱 실행에 필요한 서명 문제로 끝까지 진행하지 못했습니다.",
  },
  {
    id: "toy",
    name: "TOY",
    eyebrow: "작은 세상을 만들고 구경하는 창작 앱",
    description: "휴대폰 안에서 작은 3D 장난감을 만들고 서로의 작품을 구경하는 아이폰 앱입니다.",
    longDescription: "작은 3D 세상을 돌아다니며 작품을 구경합니다. 글과 속성을 골라 장난감을 만들고 친구들과 이야기할 수 있습니다.",
    platform: "iOS",
    platformLabel: "아이폰 앱",
    stack: "SwiftUI · Canvas · 기기 안에 저장한 데이터",
    status: "화면 점검 완료",
    year: "2026",
    period: "2026 · 화면 제작과 자동 점검",
    team: "1명",
    role: "기획, 아이폰 화면, 장난감 생성 기능, 한국어·영어 점검",
    accent: "#ff2f5f",
    icon: "/projects/toy/icon.png",
    screenshots: [
      "/projects/toy/01-world.png",
      "/projects/toy/02-explore.png",
      "/projects/toy/03-create.png",
      "/projects/toy/04-chat.png",
      "/projects/toy/05-detail.png",
    ],
    highlights: ["3D 공간을 둘러보고 다른 작품 구경하기", "글과 속성을 골라 나만의 장난감 만들기", "한국어·영어 화면 20장을 같은 조건으로 자동 확인"],
    story: "작은 장난감을 만들고 바로 구경하는 재미를 휴대폰 안에 담았습니다. 3D 공간을 돌아다니며 작품을 찾고, 글과 속성을 골라 새 장난감을 만든 뒤 채팅과 상세 화면으로 이어집니다. 인터넷 연결이 없어도 같은 입력에는 같은 결과가 나오도록 만들었고, 한국어와 영어 화면 20장을 자동으로 확인했습니다.",
    verification: "앱에서 쓰는 화면 코드를 맥에서 실행해 자동으로 캡처했습니다.",
  },
  {
    id: "rewind",
    name: "Rewind",
    eyebrow: "매일 기록하고 돌아보는 회고 앱",
    description: "매일 짧게 기록하고 한 주의 진행 상황을 돌아보게 돕는 아이폰 앱입니다.",
    longDescription: "오늘 한 일을 짧게 남기고 한 주의 기록을 모아 돌아봅니다. 원할 때만 AI가 살펴볼 내용을 제안합니다.",
    platform: "iOS",
    platformLabel: "아이폰 앱",
    stack: "SwiftUI · SwiftData · StoreKit · CloudKit",
    status: "출시 준비",
    year: "2026",
    period: "2026 · 출시 준비",
    team: "1명",
    role: "기획, 아이폰 앱, 기록과 회고 기능, 출시 준비",
    accent: "#ff666c",
    icon: "/projects/rewind/icon.png",
    appStoreUrl: "https://apps.apple.com/kr/app/rewind/id6761553250",
    screenshots: [
      "/projects/rewind/01-home.png",
      "/projects/rewind/02-language-ko.png",
      "/projects/rewind/03-language-en.png",
      "/projects/rewind/04-language-ja.png",
    ],
    highlights: ["매일 부담 없이 남기는 짧은 기록", "한 주의 기록을 모아 보는 주간 회고", "한국어·영어·일본어 화면과 설정 준비"],
    story: "기능이 많은 생산성 앱보다 오래 쓸 수 있는 간단한 회고 도구를 만들고 싶었습니다. 매일 짧게 남긴 기록을 주간 회고에서 모아 보고, 원할 때만 AI가 돌아볼 내용을 제안합니다. 한국어, 영어, 일본어 화면까지 만들었고, 결제와 iCloud 동기화는 출시 전에 더 확인할 예정입니다.",
    verification: "현재 앱 화면과 세 언어 화면을 확인했습니다. 결제와 iCloud 동기화는 아직 출시 전 점검이 필요합니다.",
  },
];

const filters = [
  { value: "All", label: "전체" },
  { value: "Mobile", label: "모바일" },
  { value: "Web", label: "웹" },
  { value: "iOS", label: "아이폰" },
];

const catalogTaxonomy = [
  {
    label: "사용 환경",
    labelKo: "어디서 쓰나요",
    items: [["iOS", "아이폰 앱"], ["Android", "안드로이드 앱"], ["Web", "웹 서비스"], ["macOS", "맥 앱"]],
  },
  {
    label: "제품 종류",
    labelKo: "무엇을 만드나요",
    items: [["생활 서비스", "일상에서 쓰는 앱"], ["학교·교육", "캠퍼스와 학습"], ["창작 도구", "콘텐츠 만들기"], ["콘텐츠 서비스", "읽고 보고 듣기"]],
  },
  {
    label: "개발 범위",
    labelKo: "어디까지 맡나요",
    items: [["모바일 앱", "화면과 기능"], ["AI 기능", "자료 검색과 답변"], ["3D 화면", "움직이는 입체 화면"], ["전체 개발", "화면부터 서버까지"]],
  },
  {
    label: "진행 단계",
    labelKo: "지금 어느 상태인가요",
    items: [["시제품", "핵심 기능 제작"], ["시험 버전", "사용 전 점검"], ["테스트용", "내 컴퓨터에서 확인"], ["출시 준비", "배포 전 마무리"]],
  },
];

const evidencePoints = [
  { value: "6개", label: "직접 만든 제품", description: "앱·웹·AI 제품 6개를 실제 화면과 함께 볼 수 있습니다." },
  { value: "20장", label: "TOY 화면 점검", description: "한국어·영어 화면 20장을 같은 조건으로 자동 확인했습니다." },
  { value: "출처 확인", label: "INHA AI 답변 점검", description: "질문을 입력하고 공식 출처가 붙은 답변이 나오는 과정까지 다시 실행했습니다." },
];

function BrandMark() {
  return <span className="brand-mark">INHODEV</span>;
}

function Header({ onBrowse }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`floating-header ${open ? "is-open" : ""}`}>
      <a className="brand-link" href="#top" onClick={() => setOpen(false)} aria-label="INHODEV 홈"><BrandMark /></a>
      <nav className="desktop-nav" aria-label="주요 탐색">
        <button type="button" onClick={onBrowse}>프로젝트</button>
        <a href="#about">소개</a>
        <a className="header-cta" href="#contact">문의하기</a>
      </nav>
      <button className="mobile-menu-button" type="button" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={21} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
      </button>
      {open ? (
        <nav className="mobile-nav" aria-label="모바일 탐색">
          <button type="button" onClick={() => { onBrowse(); setOpen(false); }}>프로젝트</button>
          <a href="#about" onClick={() => setOpen(false)}>소개</a>
          <a href="https://github.com/inhodev" target="_blank" rel="noreferrer">GitHub</a>
          <a className="mobile-nav-cta" href="#contact" onClick={() => setOpen(false)}>문의하기</a>
        </nav>
      ) : null}
    </header>
  );
}

function Hero({ onBrowse }) {
  return (
    <section className="hero" id="top">
      <div className="hero-icon-stack" aria-hidden="true"><span /><span /><img src="/projects/runquest/icon.png" alt="" /></div>
      <p className="hero-kicker">모바일 앱 · 웹 서비스 · AI 기능</p>
      <h1><span>아이디어를 앱과 웹으로</span><br />만듭니다.</h1>
      <p className="hero-copy">기획부터 개발, 테스트, 배포까지<br className="desktop-break" /> 한 사람이 이어서 맡습니다.</p>
      <div className="hero-actions">
        <button className="primary-button" type="button" onClick={onBrowse}>프로젝트 보기</button>
        <a className="secondary-button" href="https://github.com/inhodev" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={18} /></a>
      </div>
      <p className="trusted-label">주로 사용하는 기술</p>
      <div className="technology-row" aria-label="사용 기술"><span>Flutter</span><span>SwiftUI</span><span>React</span><span>Supabase</span><span>WebGL</span></div>
    </section>
  );
}

function ProjectStage({ project }) {
  const stageClass = project.platform === "Web" || project.id === "cosmoday" ? "is-landscape" : "is-mobile";
  return (
    <div className={`project-stage ${stageClass}`} style={{ "--accent": project.accent }}>
      {project.screenshots.slice(0, 3).map((src, index) => <img key={src} src={src} alt={`${project.name} 화면 ${index + 1}`} loading="lazy" />)}
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <article className={`project-card ${project.appStoreUrl ? "has-app-store" : ""}`}>
      <button className="project-card-open" type="button" onClick={() => onOpen(project)} aria-label={`${project.name} 상세 보기`}>
        <ProjectStage project={project} />
        <div className="project-card-meta">
          <div className="project-title-row">
            <img className="project-icon" src={project.icon} alt="" />
            <div><h3>{project.name}</h3><p>{project.eyebrow}</p></div>
            <ArrowUpRight className="card-arrow" size={20} />
          </div>
          <p className="project-description">{project.description}</p>
          <div className="project-tags"><span>{project.platformLabel}</span><span>{project.status}</span><span>{project.year}</span></div>
        </div>
      </button>
      {project.appStoreUrl ? (
        <a
          className="app-store-link"
          href={project.appStoreUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.name} App Store에서 보기`}
          title="App Store에서 보기"
        >
          <Apple size={18} strokeWidth={2.2} aria-hidden="true" />
        </a>
      ) : null}
      <details className="project-core">
        <summary>제가 만든 주요 기능 3가지 <ChevronDown size={17} aria-hidden="true" /></summary>
        <ul>{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
      </details>
    </article>
  );
}

function Catalog({ onOpen }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter = filter === "All" || project.platform === filter;
      const haystack = `${project.name} ${project.description} ${project.stack} ${project.platform} ${project.platformLabel}`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [filter, query]);

  return (
    <section className="catalog-shell" id="work">
      <div className="catalog-window">
        <div className="catalog-toolbar">
          <BrandMark />
          <div className="catalog-tabs" aria-label="작품 유형"><span className="is-active">제품</span><span>실험작</span></div>
          <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="프로젝트 검색" aria-label="프로젝트 검색" /></label>
          <a className="catalog-contact" href="#contact">문의하기 <ArrowDown size={16} /></a>
        </div>
        <div className="catalog-taxonomy" aria-label="제작 가능 범위">
          {catalogTaxonomy.map((group) => (
            <section className="taxonomy-group" key={group.label}>
              <header><span>{group.label}</span><span lang="ko">{group.labelKo}</span></header>
              <ul>
                {group.items.map(([english, korean]) => (
                  <li key={english}><strong>{english}</strong><span lang="ko">{korean}</span></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="catalog-controls">
          <div className="filter-pills" role="group" aria-label="플랫폼 필터">
            {filters.map((item) => <button key={item.value} type="button" className={filter === item.value ? "is-active" : ""} onClick={() => setFilter(item.value)}>{item.label}</button>)}
          </div>
          <p>{visibleProjects.length}개 프로젝트</p>
          <button className="filter-button" type="button" onClick={() => setFilterOpen((value) => !value)} aria-expanded={filterOpen}><SlidersHorizontal size={17} /> 선정 기준</button>
        </div>
        {filterOpen ? <div className="filter-panel"><Check size={16} /> 실제 화면을 확인한 프로젝트만 소개합니다.</div> : null}
        {visibleProjects.length ? (
          <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
        ) : (
          <div className="empty-state"><Grid3X3 size={24} /><h3>검색 결과가 없습니다.</h3><button type="button" onClick={() => { setQuery(""); setFilter("All"); }}>전체 프로젝트 보기</button></div>
        )}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <p className="section-kicker">처음부터 끝까지</p>
      <h2>기획, 개발, 테스트,<br />배포까지 맡습니다.</h2>
      <div className="about-grid">
        <article><span>01</span><h3>기획과 개발</h3><p>누가 언제 쓰는 서비스인지 먼저 정리하고, 필요한 화면과 기능을 함께 만듭니다.</p></article>
        <article><span>02</span><h3>테스트</h3><p>빌드만 되는지 보지 않고, 실제 화면과 꼭 필요한 기능이 제대로 작동하는지 확인합니다.</p></article>
        <article><span>03</span><h3>배포와 전달</h3><p>앱과 웹을 배포하고, 이후에도 수정하기 쉬운 형태로 정리해 전달합니다.</p></article>
      </div>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section className="evidence-section" id="proof">
      <div className="evidence-heading">
        <p className="section-kicker">직접 확인한 내용</p>
        <h2>말만 하지 않고, 작동하는 화면으로 보여드립니다.</h2>
        <p>아래에는 지금 이 포트폴리오에서 확인할 수 있는 내용만 적었습니다.</p>
      </div>
      <div className="evidence-grid">
        {evidencePoints.map((point) => (
          <article key={point.label}>
            <strong>{point.value}</strong>
            <h3>{point.label}</h3>
            <p>{point.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <h2>만들고 싶은 앱이나 웹이 있나요?</h2>
      <p>아직 아이디어만 있어도 괜찮습니다. 필요한 기능과 만드는 방법부터 함께 정리하겠습니다. 견적이나 개발 과정이 궁금하다면 편하게 연락 주세요.</p>
      <address className="contact-details" aria-label="연락처">
        <a href="tel:+821059090313">010-5909-0313</a>
        <a href="mailto:rladlsgh7777@gmail.com">rladlsgh7777@gmail.com</a>
      </address>
      <a className="contact-github" href="https://github.com/inhodev" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={20} /></a>
    </section>
  );
}

function Footer() {
  return <footer><BrandMark /><p>앱과 웹, AI 기능을 만듭니다.</p><span>© 2026 INHODEV</span></footer>;
}

function ProjectDetail({ project, nextProject, onClose, onNext }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.querySelector("button")?.focus());
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.disabled && element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (dialogRef.current) dialogRef.current.scrollTop = 0;
  }, [project.id]);

  return (
    <div ref={dialogRef} className="detail-overlay" role="dialog" aria-modal="true" aria-label={`${project.name} 상세`} tabIndex={-1}>
      <div className="detail-nav">
        <button type="button" onClick={onClose}><ArrowLeft size={20} /> 전체 프로젝트</button>
        <BrandMark />
        <button className="detail-close" type="button" onClick={onClose} aria-label="상세 닫기"><X size={20} /></button>
      </div>
      <main className="detail-content">
        <section className="detail-hero">
          <img src={project.icon} alt={`${project.name} 앱 아이콘`} />
          <p>{project.eyebrow}</p><h1>{project.name}</h1><h2>{project.description}</h2>
          <div className="detail-meta"><span>{project.platformLabel}</span><span>{project.status}</span><span>{project.year}</span></div>
          <dl className="detail-facts" aria-label="프로젝트 기본 정보">
            <div><dt>기간</dt><dd>{project.period}</dd></div>
            <div><dt>팀 인원</dt><dd>{project.team}</dd></div>
            <div><dt>내 역할</dt><dd>{project.role}</dd></div>
          </dl>
        </section>
        <section className={`detail-screens ${project.platform === "Web" || project.id === "cosmoday" ? "has-landscape" : ""}`}>
          {project.screenshots.map((src, index) => <figure key={src}><img src={src} alt={`${project.name} 제품 화면 ${index + 1}`} /><figcaption>{String(index + 1).padStart(2, "0")}</figcaption></figure>)}
        </section>
        <section className="detail-story">
          <div><p className="section-kicker">이 제품이 하는 일</p><h2>{project.longDescription}</h2><p className="detail-narrative">{project.story}</p></div>
          <dl><div><dt>개발에 사용한 기술</dt><dd>{project.stack}</dd></div><div><dt>사용 환경</dt><dd>{project.platformLabel}</dd></div><div><dt>현재 단계</dt><dd>{project.status}</dd></div></dl>
        </section>
        <section className="detail-proof">
          <div><p className="section-kicker">제가 만든 주요 기능</p><ul>{project.highlights.map((item) => <li key={item}><Check size={18} /> {item}</li>)}</ul></div>
          <div className="verification-card"><span>현재 확인된 내용</span><p>{project.verification}</p></div>
        </section>
        <section className="next-project-section">
          <p className="section-kicker">다음 프로젝트</p>
          <button type="button" className="next-project-card" onClick={onNext} aria-label={`${nextProject.name} 프로젝트 보기`}>
            <img src={nextProject.icon} alt="" />
            <span><strong>{nextProject.name}</strong><small>{nextProject.description}</small></span>
            <ArrowUpRight size={24} />
          </button>
        </section>
      </main>
    </div>
  );
}

function PortfolioApp() {
  const [selectedProject, setSelectedProject] = useState(null);
  const browse = () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const closeProject = useCallback(() => setSelectedProject(null), []);
  const nextProject = selectedProject
    ? projects[(projects.findIndex((project) => project.id === selectedProject.id) + 1) % projects.length]
    : null;
  return (
    <>
      <Header onBrowse={browse} />
      <main><Hero onBrowse={browse} /><Catalog onOpen={setSelectedProject} /><About /><EvidenceSection /><ContactSection /></main>
      <Footer />
      {selectedProject ? <ProjectDetail project={selectedProject} nextProject={nextProject} onClose={closeProject} onNext={() => setSelectedProject(nextProject)} /> : null}
    </>
  );
}

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path === "/challenge-log" ? <ChallengeLogPage /> : <PortfolioApp />;
}
