import { useState, useEffect, useMemo } from "react";
import { api } from "../auth/apiClient";

// ─────────────────────────────────────────────
// BỘ ICON SVG CHUẨN ENTERPRISE PAAS (ZERO AI SLOP)
// ─────────────────────────────────────────────
const TopicIcon = ({ name, id }) => {
  const norm = (name || "").toLowerCase();

  // Động vật
  if (norm.includes("động vật") || norm.includes("animal") || id === 1) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      </div>
    );
  }

  // Trái cây / Thực phẩm
  if (norm.includes("trái cây") || norm.includes("thực phẩm") || norm.includes("food") || id === 2) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a4 4 0 00-4 4v1H6a3 3 0 00-3 3v8a4 4 0 004 4h10a4 4 0 004-4v-8a3 3 0 00-3-3h-2V6a4 4 0 00-4-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v5" />
        </svg>
      </div>
    );
  }

  // Giao tiếp cơ bản
  if (norm.includes("giao tiếp") || norm.includes("communication") || id === 3) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
    );
  }

  // Công việc & Nghề nghiệp
  if (norm.includes("công việc") || norm.includes("nghề") || norm.includes("work") || id === 4) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/15 to-violet-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Du lịch
  if (norm.includes("du lịch") || norm.includes("travel") || id === 5) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/15 to-cyan-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }

  // Icon mặc định
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-blue-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────
// Màn hình 1: Chọn Chủ Đề (Chuẩn Enterprise SaaS)
// ─────────────────────────────────────────────
function TopicGrid({ topics, onSelect }) {
  const totalWords = useMemo(() => {
    return topics.reduce((acc, t) => acc + (t.wordCount || 0), 0);
  }, [topics]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header Section - Modern Enterprise Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--border-color)] mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Lexicon Engine • Spaced Repetition
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Chuyên Mục Từ Vựng & Ngữ Liệu
            </h1>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              Kho ngữ liệu chuẩn hóa kèm phiên âm quốc tế IPA, nghĩa ngữ cảnh và hệ thống thẻ nhớ flashcard thông minh.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-[var(--surface-bg)] border border-[var(--border-color)] px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="text-left pr-4 border-r border-[var(--border-color)]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Chuyên đề</div>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-tight">{topics.length}</div>
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Tổng số từ</div>
              <div className="text-lg font-black text-[var(--text-primary)] leading-tight">{totalWords}</div>
            </div>
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)]">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Chưa có chuyên đề từ vựng</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">Dữ liệu từ vựng đang được đồng bộ hóa từ máy chủ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => onSelect(topic)}
                className="group relative rounded-2xl p-6 text-left border bg-[var(--surface-bg)] border-[var(--border-color)]
                           hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1
                           transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div>
                  {/* Top Row: SVG Icon & Track Metadata */}
                  <div className="flex items-center justify-between mb-4">
                    <TopicIcon name={topic.name} id={topic.id} />
                    <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase bg-[var(--surface-bg-muted)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                      Track 0{index + 1}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {topic.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 min-h-[40px]">
                    {topic.description || "Luyện tập ngữ âm và nghĩa từ vựng cốt lõi theo chủ đề này."}
                  </p>
                </div>

                {/* Bottom Row: Word Count & Action Arrow */}
                <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {topic.wordCount || 0} từ vựng
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Bắt đầu
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Màn hình 2: Danh sách từ vựng của chủ đề
// ─────────────────────────────────────────────
function VocabularyList({ topic, words, onBack, onStartFlashcard }) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [search, setSearch] = useState("");

  const playAudio = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;
    const q = search.toLowerCase();
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        (w.translation && w.translation.toLowerCase().includes(q))
    );
  }, [words, search]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Quay lại chuyên mục
          </button>

          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-bg-muted)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              {words.length} mục từ khả dụng
            </span>
          </div>
        </div>

        {/* Topic Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <TopicIcon name={topic.name} id={topic.id} />
            <div>
              <h2 className="text-2xl font-black text-[var(--text-primary)]">{topic.name}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">{topic.description || "Luyện phát âm và tra nghĩa từ vựng."}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showTranslation
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                  : "bg-[var(--surface-bg)] text-[var(--text-secondary)] border-[var(--border-color)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {showTranslation ? "Ẩn bản dịch" : "Hiện bản dịch"}
            </button>

            <button
              onClick={onStartFlashcard}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Luyện Flashcard
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm từ vựng hoặc nghĩa tiếng Việt..."
            className="w-full px-4 py-2.5 pl-10 text-sm bg-[var(--surface-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWords.map((vocab, index) => (
            <div
              key={vocab.id}
              className="rounded-2xl border p-5 bg-[var(--surface-bg)] border-[var(--border-color)] hover:border-indigo-400/50 hover:shadow-md transition-all flex items-start justify-between group"
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-semibold text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {vocab.word}
                  </h4>
                  {vocab.ipa && (
                    <span className="text-xs font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-md bg-[var(--surface-bg-muted)] border border-[var(--border-color)]">
                      {vocab.ipa}
                    </span>
                  )}
                </div>

                {showTranslation && (
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    {vocab.translation}
                  </p>
                )}

                {vocab.example && (
                  <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
                    "{vocab.example}"
                  </p>
                )}
              </div>

              {/* Audio Speaker Button */}
              <button
                onClick={() => playAudio(vocab.word)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer"
                title="Nghe phát âm chuẩn"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V8.25c0-.414.336-.75.75-.75h2.24z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Đã sẵn sàng kiểm tra trí nhớ?</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Luyện tập qua thẻ flashcard tương tác giúp tăng 80% khả năng ghi nhớ dài hạn.</p>
          </div>
          <button
            onClick={onStartFlashcard}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            Bắt đầu bài luyện
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Màn hình 3: Luyện tập Flashcard
// ─────────────────────────────────────────────
function FlashcardMode({ topic, words, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [remembered, setRemembered] = useState([]);
  const [forgotten, setForgotten] = useState([]);
  const [done, setDone] = useState(false);

  const current = words[currentIndex];

  const playAudio = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && current?.word) playAudio(current.word);
  };

  const handleAnswer = (isRemembered) => {
    if (isRemembered) {
      setRemembered([...remembered, current.id]);
    } else {
      setForgotten([...forgotten, current.id]);
    }

    if (currentIndex + 1 >= words.length) {
      setDone(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setRemembered([]);
    setForgotten([]);
    setDone(false);
  };

  if (done) {
    const percent = Math.round((remembered.length / words.length) * 100) || 0;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-[var(--text-primary)] px-6">
        <div className="max-w-md w-full mx-auto text-center bg-[var(--surface-bg)] border border-[var(--border-color)] rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mx-auto flex items-center justify-center mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Hoàn Thành Chuyên Đề</h2>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Bạn đã hoàn thành phiên luyện {words.length} từ vựng thuộc chủ đề <strong>{topic.name}</strong>.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[var(--surface-bg-muted)] border border-[var(--border-color)]">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{percent}%</div>
            <div className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] mt-1">Độ chính xác ghi nhớ</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{remembered.length}</div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5">Đã thuộc vững</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{forgotten.length}</div>
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-0.5">Cần củng cố lại</div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleRestart}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Luyện lại chuyên đề
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Quay lại danh sách từ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Progress Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            ← Thoát
          </button>
          <div className="flex-1 h-2 bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentIndex / words.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        {/* Interactive 3D Flashcard */}
        <div
          className="relative cursor-pointer mb-8"
          style={{ perspective: "1000px" }}
          onClick={handleFlip}
        >
          <div
            className="relative w-full rounded-3xl transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "340px",
            }}
          >
            {/* Mặt trước — Tiếng Anh */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-between rounded-3xl p-8 bg-[var(--surface-bg)] border border-[var(--border-color)] shadow-xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Target Lexeme
                </span>
                <span className="text-xs text-[var(--text-muted)]">Bấm thẻ để lật</span>
              </div>

              <div className="text-center my-auto">
                <h2 className="text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
                  {current.word}
                </h2>
                {current.ipa && (
                  <span className="font-mono text-base text-[var(--text-muted)] bg-[var(--surface-bg-muted)] px-3.5 py-1.5 rounded-xl border border-[var(--border-color)]">
                    {current.ipa}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Nhấp thẻ để xem nghĩa ngữ cảnh & phát âm
              </div>
            </div>

            {/* Mặt sau — Tiếng Việt */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl flex flex-col items-center justify-between p-8 text-white shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="w-full flex items-center justify-between text-indigo-200">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  Vietnamese Meaning
                </span>
                <span className="text-xs opacity-80">Mặt sau</span>
              </div>

              <div className="text-center my-auto px-4">
                <h3 className="text-3xl font-black mb-3">{current.translation}</h3>
                {current.example && (
                  <p className="text-sm text-indigo-100 italic leading-relaxed max-w-md mx-auto">
                    "{current.example}"
                  </p>
                )}
                {current.exampleTranslation && (
                  <p className="text-xs text-indigo-200 mt-1.5 max-w-md mx-auto">
                    ({current.exampleTranslation})
                  </p>
                )}
              </div>

              <div className="text-xs font-semibold text-indigo-200">
                Đánh giá mức độ nhớ của bạn bên dưới ↓
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {isFlipped ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-2xl border border-amber-500/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Cần ôn lại
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl border border-emerald-500/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Đã ghi nhớ
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Hãy nhẩm nghĩa của từ và phát âm trong đầu trước khi nhấn lật thẻ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Component chính — Điều phối 3 màn hình
// ─────────────────────────────────────────────
export default function Vocabulary() {
  const [screen, setScreen] = useState("topics");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/topics")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách chuyên đề");
        return res.json();
      })
      .then(setTopics)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    try {
      const res = await api.get(`/api/topics/${topic.id}/vocabularies`);
      if (!res.ok) throw new Error("Không thể tải danh mục từ vựng");
      const data = await res.json();
      setWords(data);
      setScreen("list");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)]">
        <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
          <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full" />
          <p className="text-xs font-mono uppercase tracking-wider">Đang đồng bộ dữ liệu đám mây...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] px-6">
        <div className="max-w-md w-full p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (screen === "flashcard") {
    return (
      <FlashcardMode
        topic={selectedTopic}
        words={words}
        onBack={() => setScreen("list")}
      />
    );
  }

  if (screen === "list") {
    return (
      <VocabularyList
        topic={selectedTopic}
        words={words}
        onBack={() => setScreen("topics")}
        onStartFlashcard={() => setScreen("flashcard")}
      />
    );
  }

  return <TopicGrid topics={topics} onSelect={handleSelectTopic} />;
}
