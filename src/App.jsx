import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Grid3X3,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const projects = [
  {
    id: "runquest",
    name: "RunQuest",
    eyebrow: "Adaptive audio running",
    description: "달릴수록 이야기가 열리는 적응형 오디오 스토리 러닝 앱.",
    longDescription: "GPS, 거리, 페이스 변화에 맞춰 오디오 챕터가 열리고 러닝이 끝나면 기록과 다음 모험을 연결합니다.",
    platform: "Mobile",
    stack: "Flutter · Riverpod · GPS · Audio",
    status: "MVP",
    year: "2026",
    period: "2026 · MVP 제작",
    team: "1인 개발 중심",
    role: "제품 기획부터 러닝 엔진, 앱 화면, 기록 흐름까지",
    accent: "#ff5a1f",
    icon: "/projects/runquest/icon.png",
    screenshots: [
      "/projects/runquest/01-home.png",
      "/projects/runquest/02-running.png",
      "/projects/runquest/03-report.png",
      "/projects/runquest/04-achievements.png",
    ],
    highlights: ["달리기 기록과 이야기 진행을 한 흐름으로 연결", "속도·거리 변화에 맞춰 이어지는 오디오 경험", "운동 종료 후 기록과 다음 챕터를 보는 리포트"],
    story: "달리는 중에는 화면을 오래 보기 어렵다는 데서 시작했습니다. 속도와 거리 변화에 맞춰 이야기가 자연스럽게 이어지고, 운동이 끝나면 기록과 다음 챕터까지 한 번에 확인하도록 러닝 흐름 전체를 만들었습니다. 핵심 동작은 실제 화면 캡처와 엔진 테스트로 다시 확인했습니다.",
    verification: "헤드리스 화면 캡처와 엔진 테스트 근거 보유. 클라우드 연동은 다음 단계입니다.",
  },
  {
    id: "olive",
    name: "OLIVE",
    eyebrow: "Worship discovery platform",
    description: "기분과 상황에 맞는 찬양을 발견하고 기록하는 큐레이션 플랫폼.",
    longDescription: "맞춤 큐레이션, 차트와 곡 탐색, 커뮤니티, 보관함과 인사이트를 하나의 모바일 경험으로 구성했습니다.",
    platform: "Mobile",
    stack: "Flutter · Supabase · Riverpod · OpenAI",
    status: "Beta",
    year: "2026",
    period: "2026 · 베타 제작",
    team: "1인 개발 중심",
    role: "제품 기획, 모바일 앱, 추천 흐름, 운영 화면",
    accent: "#4f7543",
    icon: "/projects/olive/icon.png",
    screenshots: [
      "/projects/olive/01-home.png",
      "/projects/olive/02-explore.png",
      "/projects/olive/03-mix.png",
      "/projects/olive/04-ai-answer.png",
      "/projects/olive/05-profile.png",
    ],
    highlights: ["기분과 상황만으로 찬양을 찾는 맞춤 추천", "탐색·재생·보관·기록이 이어지는 모바일 흐름", "사용자 앱과 운영 화면을 함께 고려한 서비스 구조"],
    story: "노래 제목을 몰라도 지금의 기분과 상황으로 찬양을 찾을 수 있게 만들었습니다. 추천에서 끝내지 않고 탐색, 재생, 보관, 기록과 커뮤니티가 자연스럽게 이어지도록 사용자 앱과 운영 흐름을 함께 설계했고, 실제 앱 화면과 테스트 기록으로 주요 경험을 확인했습니다.",
    verification: "실제 앱 화면과 Flutter 테스트 근거를 사용했습니다. 일부 캡처는 이전 앱 빌드입니다.",
  },
  {
    id: "inha-ai",
    name: "INHA AI",
    eyebrow: "Source-grounded campus RAG",
    description: "공식 출처가 있을 때만 답하는 인하대학교 캠퍼스 생활 AI.",
    longDescription: "학사, 장학, 시설, 도서관 같은 질문을 검색하고 출처·최신성·확인 필요 여부를 답변에 함께 표시합니다.",
    platform: "Web",
    stack: "React · Bun · PostgreSQL · pgvector",
    status: "Local MVP",
    year: "2026",
    period: "2026 · 로컬 MVP",
    team: "1인 개발 중심",
    role: "질문 경험, 근거 검색, 답변 안전장치, 운영 구조",
    accent: "#4a59ff",
    icon: "/projects/inha-ai/icon.png",
    screenshots: [
      "/projects/inha-ai/01-home-desktop.png",
      "/projects/inha-ai/03-answer-desktop.png",
      "/projects/inha-ai/02-home-mobile.png",
      "/projects/inha-ai/04-answer-mobile.png",
    ],
    highlights: ["학교 공식 출처를 먼저 찾는 질문 검색", "답변마다 출처·최신성·확인 필요 여부 표시", "학생 채팅부터 운영 관리까지 이어지는 구조"],
    story: "캠퍼스 질문에서 가장 위험한 건 그럴듯하지만 틀린 답이라고 봤습니다. 그래서 학교 공식 출처가 있을 때만 답하고, 출처와 최신성, 추가 확인이 필요한 부분까지 한 화면에 보여주도록 만들었습니다. 로컬 환경에서 질문부터 근거가 있는 답변까지 다시 실행해 확인했습니다.",
    verification: "이번 포트폴리오 작업에서 로컬 mock mode를 실행해 질문→근거 답변을 새로 캡처했습니다.",
  },
  {
    id: "cosmoday",
    name: "COSMODAY",
    eyebrow: "A universe story every day",
    description: "매일 하나의 우주 사건을 카드와 위젯으로 만나는 iOS 우주 캘린더.",
    longDescription: "날짜별 우주 사건, 천문 이벤트, 공유 카드, 위젯과 알림을 연간 콘텐츠 제작 파이프라인과 연결합니다.",
    platform: "iOS",
    stack: "SwiftUI · SwiftData · WidgetKit",
    status: "Beta",
    year: "2026",
    period: "2026 · 베타 제작",
    team: "1인 개발 중심",
    role: "콘텐츠 기획, iOS 앱, 위젯, 연간 제작 흐름",
    accent: "#162fff",
    icon: "/projects/cosmoday/icon.png",
    screenshots: [
      "/projects/cosmoday/01-january.png",
      "/projects/cosmoday/02-supernova-poster.jpg",
      "/projects/cosmoday/03-cinematic.jpg",
      "/projects/cosmoday/04-june.jpg",
    ],
    highlights: ["날짜마다 하나의 우주 이야기를 보여주는 콘텐츠", "앱·위젯·알림·공유 카드가 이어지는 경험", "1년치 콘텐츠를 만들고 검수하는 제작 흐름"],
    story: "어렵고 흩어져 있는 우주 이야기를 매일 하나씩 가볍게 만나는 경험으로 바꿨습니다. 날짜별 카드가 앱, 위젯, 알림과 공유 이미지로 이어지게 하고, 1년치 콘텐츠를 꾸준히 만들고 검수할 수 있는 제작 흐름까지 함께 구성했습니다.",
    verification: "현재는 검증된 콘텐츠 보드와 시네마틱을 사용했습니다. 이번 카드 스냅샷 테스트는 서명 문제로 중단됐습니다.",
  },
  {
    id: "toy",
    name: "TOY",
    eyebrow: "Pocket voxel social world",
    description: "폰을 나가지 않고 작은 창작물을 만드는 복셀 소셜 월드.",
    longDescription: "아이소메트릭 월드에서 탐색하고, 프롬프트와 속성을 조합해 작은 토이를 만들고, 채팅과 체험으로 이어집니다.",
    platform: "iOS",
    stack: "SwiftUI · Canvas · Local fixtures",
    status: "Headless QA",
    year: "2026",
    period: "2026 · 화면·QA 제작",
    team: "1인 개발 중심",
    role: "세계관, iOS 화면, 생성 로직, 다국어 QA",
    accent: "#ff2f5f",
    icon: "/projects/toy/icon.png",
    screenshots: [
      "/projects/toy/01-world.png",
      "/projects/toy/02-explore.png",
      "/projects/toy/03-create.png",
      "/projects/toy/04-chat.png",
      "/projects/toy/05-detail.png",
    ],
    highlights: ["탐색하고 만드는 아이소메트릭 복셀 월드", "서버 없이 기기 안에서 같은 결과를 만드는 생성 방식", "한국어·영어 화면 20장을 자동으로 확인한 QA"],
    story: "작은 창작물을 만들고 바로 구경하는 흐름을 서버 없이도 안정적으로 보여주는 것이 핵심이었습니다. 아이소메트릭 월드에서 탐색, 생성, 채팅과 상세 체험이 이어지게 만들고, 같은 입력이면 같은 결과가 나오도록 구성했습니다. 한국어와 영어 화면 20장을 같은 조건에서 자동 확인했습니다.",
    verification: "배포 뷰와 같은 SwiftUI 트리를 macOS ImageRenderer로 캡처한 실제 헤드리스 화면입니다.",
  },
  {
    id: "rewind",
    name: "Rewind",
    eyebrow: "A calmer reflection partner",
    description: "사이드 프로젝트를 끝까지 완주하게 돕는 개인 회고 파트너.",
    longDescription: "데일리 체크인, 주간 회고, 선택형 AI 인사이트와 iCloud 동기화를 조용한 iOS 경험으로 묶었습니다.",
    platform: "iOS",
    stack: "SwiftUI · SwiftData · StoreKit · CloudKit",
    status: "Release prep",
    year: "2026",
    period: "2026 · 출시 준비",
    team: "1인 개발 중심",
    role: "제품 기획, iOS 앱, 회고 흐름, 출시 준비",
    accent: "#ff666c",
    icon: "/projects/rewind/icon.png",
    screenshots: [
      "/projects/rewind/01-home.png",
      "/projects/rewind/02-language-ko.png",
      "/projects/rewind/03-language-en.png",
      "/projects/rewind/04-language-ja.png",
    ],
    highlights: ["매일 짧게 남기고 주간 회고로 이어지는 흐름", "원할 때만 확인하는 AI 인사이트", "한국어·영어·일본어를 고려한 설정과 화면"],
    story: "기능이 많은 생산성 앱보다 부담 없이 계속 쓰는 회고 도구가 필요했습니다. 매일 짧게 남긴 기록이 주간 회고로 이어지고, 원할 때만 AI 인사이트를 보는 차분한 흐름으로 만들었습니다. 한국어, 영어, 일본어 화면까지 준비했으며 결제와 iCloud는 출시 전 별도 확인 범위로 남겨뒀습니다.",
    verification: "현재 보유한 앱·다국어 화면을 사용했습니다. 결제와 iCloud 동작은 별도 출시 QA 경계입니다.",
  },
];

const filters = ["All", "Mobile", "Web", "iOS"];

const catalogTaxonomy = [
  {
    label: "Platforms",
    labelKo: "제작 환경",
    items: [["iOS", "아이폰 앱"], ["Android", "안드로이드 앱"], ["Web", "웹 서비스"], ["macOS", "맥 앱"]],
  },
  {
    label: "Products",
    labelKo: "만들 수 있는 것",
    items: [["Consumer", "일반 사용자용"], ["Campus", "학교·교육"], ["Creator", "창작 도구"], ["Content", "콘텐츠 서비스"]],
  },
  {
    label: "Capabilities",
    labelKo: "다루는 범위",
    items: [["Mobile app", "모바일 앱 제작"], ["AI & RAG", "AI·문서 검색"], ["3D & Canvas", "3D·인터랙션"], ["Full stack", "화면부터 서버까지"]],
  },
  {
    label: "Status",
    labelKo: "진행 상태",
    items: [["MVP", "핵심 기능 완성"], ["Beta", "사용 테스트 단계"], ["Local QA", "로컬 검증 완료"], ["Release prep", "출시 준비"]],
  },
];

const evidencePoints = [
  { value: "6개", label: "제품 사례", description: "모바일·웹·AI 작업을 확인 가능한 화면과 함께 보여드립니다." },
  { value: "20장", label: "TOY 다국어 QA", description: "한국어·영어 화면을 같은 조건에서 자동으로 확인했습니다." },
  { value: "질문→근거", label: "INHA AI 재실행", description: "질문부터 출처가 있는 답변까지 로컬에서 다시 확인했습니다." },
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
        <button type="button" onClick={onBrowse}>Portfolio</button>
        <a href="#about">About</a>
        <a className="header-cta" href="#contact">Contact</a>
      </nav>
      <button className="mobile-menu-button" type="button" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={21} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
      </button>
      {open ? (
        <nav className="mobile-nav" aria-label="모바일 탐색">
          <button type="button" onClick={() => { onBrowse(); setOpen(false); }}>Portfolio</button>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="https://github.com/inhodev" target="_blank" rel="noreferrer">GitHub</a>
          <a className="mobile-nav-cta" href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </nav>
      ) : null}
    </header>
  );
}

function Hero({ onBrowse }) {
  return (
    <section className="hero" id="top">
      <div className="hero-icon-stack" aria-hidden="true"><span /><span /><img src="/projects/runquest/icon.png" alt="" /></div>
      <p className="hero-kicker">Mobile · Web · AI products</p>
      <h1>제품을 끝까지<br />만드는 개발자.</h1>
      <p className="hero-copy">아이디어를 실제 화면과 동작으로 만들고,<br className="desktop-break" /> 검증 가능한 제품으로 마무리합니다.</p>
      <div className="hero-actions">
        <button className="primary-button" type="button" onClick={onBrowse}>프로젝트 보기</button>
        <a className="secondary-button" href="https://github.com/inhodev" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={18} /></a>
      </div>
      <p className="trusted-label">Built across product surfaces</p>
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
    <article className="project-card">
      <button className="project-card-open" type="button" onClick={() => onOpen(project)} aria-label={`${project.name} 상세 보기`}>
        <ProjectStage project={project} />
        <div className="project-card-meta">
          <div className="project-title-row">
            <img className="project-icon" src={project.icon} alt="" />
            <div><h3>{project.name}</h3><p>{project.eyebrow}</p></div>
            <ArrowUpRight className="card-arrow" size={20} />
          </div>
          <p className="project-description">{project.description}</p>
          <div className="project-tags"><span>{project.platform}</span><span>{project.status}</span><span>{project.year}</span></div>
        </div>
      </button>
      <details className="project-core">
        <summary>내가 만든 핵심 3가지 <ChevronDown size={17} aria-hidden="true" /></summary>
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
      const haystack = `${project.name} ${project.description} ${project.stack} ${project.platform}`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [filter, query]);

  return (
    <section className="catalog-shell" id="work">
      <div className="catalog-window">
        <div className="catalog-toolbar">
          <BrandMark />
          <div className="catalog-tabs" aria-label="작품 유형"><span className="is-active">Products</span><span>Experiments</span></div>
          <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." aria-label="프로젝트 검색" /></label>
          <a className="catalog-contact" href="#contact">Contact <ArrowDown size={16} /></a>
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
            {filters.map((item) => <button key={item} type="button" className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
          <p>{visibleProjects.length} products</p>
          <button className="filter-button" type="button" onClick={() => setFilterOpen((value) => !value)} aria-expanded={filterOpen}><SlidersHorizontal size={17} /> Filter</button>
        </div>
        {filterOpen ? <div className="filter-panel"><Check size={16} /> 실제 캡처가 확보된 작품만 표시하고 있습니다.</div> : null}
        {visibleProjects.length ? (
          <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
        ) : (
          <div className="empty-state"><Grid3X3 size={24} /><h3>일치하는 프로젝트가 없습니다.</h3><button type="button" onClick={() => { setQuery(""); setFilter("All"); }}>전체 보기</button></div>
        )}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <p className="section-kicker">From idea to working product</p>
      <h2>화면만 만드는 것이 아니라,<br />제품의 핵심 흐름을 연결합니다.</h2>
      <div className="about-grid">
        <article><span>01</span><h3>Product build</h3><p>사용자 흐름, 데이터 구조, 화면과 동작을 하나의 제품으로 구현합니다.</p></article>
        <article><span>02</span><h3>Evidence</h3><p>빌드 성공과 실제 화면 검증을 분리하고 확인된 범위를 명확하게 남깁니다.</p></article>
        <article><span>03</span><h3>Delivery</h3><p>모바일, 웹, 관리자, 콘텐츠 파이프라인까지 필요한 표면을 이어서 전달합니다.</p></article>
      </div>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section className="evidence-section" id="proof">
      <div className="evidence-heading">
        <p className="section-kicker">Proof · 확인 가능한 근거</p>
        <h2>말보다, 확인할 수 있는 결과를 남깁니다.</h2>
        <p>꾸며낸 수치 대신, 지금 확인할 수 있는 화면과 다시 실행한 작업 근거만 모았습니다.</p>
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
      <h2>만들고 싶은 제품이 있나요?</h2>
      <p>아이디어를 빠르게 실제 서비스로 만드는 데 자신 있습니다. 만들고 싶은 게 있다면 편하게 연락 주세요. 궁금한 건 무엇이든 물어보셔도 좋습니다.</p>
      <address className="contact-details" aria-label="연락처">
        <a href="tel:+821059090313">010-5909-0313</a>
        <a href="mailto:rladlsgh7777@gmail.com">rladlsgh7777@gmail.com</a>
      </address>
      <a className="contact-github" href="https://github.com/inhodev" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={20} /></a>
    </section>
  );
}

function Footer() {
  return <footer><BrandMark /><p>Mobile, web and AI products by INHODEV.</p><span>© 2026 INHODEV</span></footer>;
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
        <button type="button" onClick={onClose}><ArrowLeft size={20} /> All products</button>
        <BrandMark />
        <button className="detail-close" type="button" onClick={onClose} aria-label="상세 닫기"><X size={20} /></button>
      </div>
      <main className="detail-content">
        <section className="detail-hero">
          <img src={project.icon} alt={`${project.name} 앱 아이콘`} />
          <p>{project.eyebrow}</p><h1>{project.name}</h1><h2>{project.description}</h2>
          <div className="detail-meta"><span>{project.platform}</span><span>{project.status}</span><span>{project.year}</span></div>
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
          <div><p className="section-kicker">어떤 제품을 만들었는지</p><h2>{project.longDescription}</h2><p className="detail-narrative">{project.story}</p></div>
          <dl><div><dt>사용 기술 · 참고</dt><dd>{project.stack}</dd></div><div><dt>제작 환경</dt><dd>{project.platform}</dd></div><div><dt>현재 단계</dt><dd>{project.status}</dd></div></dl>
        </section>
        <section className="detail-proof">
          <div><p className="section-kicker">직접 만든 핵심 3가지</p><ul>{project.highlights.map((item) => <li key={item}><Check size={18} /> {item}</li>)}</ul></div>
          <div className="verification-card"><span>실제로 확인한 범위</span><p>{project.verification}</p></div>
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

export function App() {
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
