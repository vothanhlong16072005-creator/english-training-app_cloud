import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../auth/apiClient";
import { isTokenValid } from "../auth/authUtils";

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

  // Sổ từ vựng cá nhân
  if (norm.includes("cá nhân") || norm.includes("personal") || id === "personal") {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/15 to-rose-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-sm">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
    );
  }

  // Default icon
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-blue-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );
};

// Helper phát âm chuẩn qua Web Speech API
const playAudioSpeech = (word) => {
  if (!word || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

// ─────────────────────────────────────────────
// DIALOG: THÊM TỪ VỰNG MỚI VÀO SỔ CÁ NHÂN
// ─────────────────────────────────────────────
function AddWordModal({ isOpen, onClose, onWordAdded }) {
  const { t } = useTranslation();
  const [word, setWord] = useState("");
  const [ipa, setIpa] = useState("");
  const [translation, setTranslation] = useState("");
  const [example, setExample] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) {
      setErrorMsg(t("vocabularyPage.msgWordRequired"));
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await api.post("/api/user-vocabulary", {
        word: word.trim(),
        ipa: ipa.trim(),
        translation: translation.trim(),
        example: example.trim(),
      });

      if (!res.ok) {
        throw new Error(t("vocabularyPage.errorLoadWords"));
      }

      const data = await res.json();
      if (data.saved === false) {
        setErrorMsg(data.message || t("vocabularyPage.msgDuplicate"));
        setSubmitting(false);
        return;
      }

      // Reset form & notify parent
      setWord("");
      setIpa("");
      setTranslation("");
      setExample("");
      onWordAdded();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save word");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[var(--surface-bg)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {t("vocabularyPage.modalAddTitle")}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {t("vocabularyPage.modalAddSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg-muted)] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              {t("vocabularyPage.labelWord")}
            </label>
            <input
              type="text"
              required
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={t("vocabularyPage.placeholderWord")}
              className="w-full px-4 py-2.5 text-sm bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              {t("vocabularyPage.labelIpa")}
            </label>
            <input
              type="text"
              value={ipa}
              onChange={(e) => setIpa(e.target.value)}
              placeholder={t("vocabularyPage.placeholderIpa")}
              className="w-full px-4 py-2.5 text-sm font-mono bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              {t("vocabularyPage.labelTranslation")}
            </label>
            <input
              type="text"
              required
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder={t("vocabularyPage.placeholderTranslation")}
              className="w-full px-4 py-2.5 text-sm bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              {t("vocabularyPage.labelExample")}
            </label>
            <textarea
              rows={2}
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder={t("vocabularyPage.placeholderExample")}
              className="w-full px-4 py-2 text-sm bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-bg-muted)] transition-colors cursor-pointer"
            >
              {t("vocabularyPage.btnCancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("vocabularyPage.btnSaving")}
                </>
              ) : (
                t("vocabularyPage.btnSave")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW 1: LƯỚI CHUYÊN MỤC CHUẨN (CURATED TRACKS)
// ─────────────────────────────────────────────
function CuratedTopicGrid({ topics, onSelectTopic }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const getTopicDisplayName = (topic) => {
    if (!isEn) return topic.name;
    const norm = (topic.name || "").toLowerCase();
    if (norm.includes("động vật") || topic.id === 1) return "Animals & Wildlife";
    if (norm.includes("trái cây") || norm.includes("thực phẩm") || topic.id === 2) return "Fruits & Food";
    if (norm.includes("giao tiếp") || topic.id === 3) return "Everyday Communication";
    if (norm.includes("công việc") || norm.includes("nghề") || topic.id === 4) return "Work & Careers";
    if (norm.includes("du lịch") || topic.id === 5) return "Travel & Exploration";
    return topic.name;
  };

  const getTopicDisplayDesc = (topic) => {
    if (!isEn) return topic.description || t("vocabularyPage.defaultTrackDesc");
    const norm = (topic.name || "").toLowerCase();
    if (norm.includes("động vật") || topic.id === 1) return "Essential vocabulary and phonetics for wildlife and domestic fauna.";
    if (norm.includes("trái cây") || topic.id === 2) return "Common daily terms for fresh fruits, cuisines, and nourishment.";
    if (norm.includes("giao tiếp") || topic.id === 3) return "Foundational conversational expressions for fluent interactions.";
    if (norm.includes("công việc") || topic.id === 4) return "Professional terminology for modern workplace and career mastery.";
    if (norm.includes("du lịch") || topic.id === 5) return "Practical language guides for global navigation and travel contexts.";
    return topic.description || t("vocabularyPage.defaultTrackDesc");
  };

  if (topics.length === 0) {
    return (
      <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)]">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">{t("vocabularyPage.emptyTracks")}</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t("vocabularyPage.emptyTracksDesc")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic, index) => (
        <button
          key={topic.id}
          onClick={() => onSelectTopic(topic)}
          className="group relative rounded-2xl p-6 text-left border bg-[var(--surface-bg)] border-[var(--border-color)]
                     hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1
                     transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <TopicIcon name={topic.name} id={topic.id} />
              <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase bg-[var(--surface-bg-muted)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                {t("vocabularyPage.trackBadge", { number: index + 1 })}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {getTopicDisplayName(topic)}
            </h3>

            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 min-h-[40px]">
              {getTopicDisplayDesc(topic)}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              {t("vocabularyPage.wordsCount", { count: topic.wordCount || 0 })}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {t("vocabularyPage.startBtn")}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW 2: SỔ TỪ VỰNG CÁ NHÂN (PERSONAL DECK VIEW)
// ─────────────────────────────────────────────
function PersonalDeckView({
  words,
  isLoggedIn,
  onOpenAddModal,
  onDeleteWord,
  onStartFlashcard,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return words;
    const q = search.toLowerCase();
    return words.filter(
      (w) =>
        (w.word && w.word.toLowerCase().includes(q)) ||
        (w.translation && w.translation.toLowerCase().includes(q)) ||
        (w.example && w.example.toLowerCase().includes(q))
    );
  }, [words, search]);

  if (!isLoggedIn) {
    return (
      <div className="rounded-3xl border border-[var(--border-color)] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-[var(--surface-bg)] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mx-auto flex items-center justify-center mb-5">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-[var(--text-primary)]">
          {t("vocabularyPage.notLoggedInTitle")}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
          {t("vocabularyPage.notLoggedInDesc")}
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/25 transition-all"
        >
          {t("vocabularyPage.loginNow")}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--surface-bg)] border border-[var(--border-color)] shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("vocabularyPage.searchPlaceholder")}
            className="w-full px-4 py-2.5 pl-10 text-sm bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("vocabularyPage.addNewWord")}
          </button>

          <button
            onClick={onStartFlashcard}
            disabled={words.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              words.length > 0
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 cursor-pointer"
                : "bg-[var(--surface-bg-muted)] text-[var(--text-muted)] border border-[var(--border-color)] opacity-50 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {t("vocabularyPage.practiceFlashcards")}
          </button>
        </div>
      </div>

      {/* Words Grid or Empty State */}
      {words.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)] p-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            {t("vocabularyPage.emptyPersonal")}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {t("vocabularyPage.emptyPersonalDesc")}
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("vocabularyPage.addNewWord")}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] text-sm text-[var(--text-muted)]">
          {t("vocabularyPage.noMatchFound", { query: search })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border p-5 bg-[var(--surface-bg)] border-[var(--border-color)] hover:border-indigo-400/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-semibold text-[var(--text-muted)]">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => playAudioSpeech(item.word)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                      title={t("vocabularyPage.pronounce")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V8.25c0-.414.336-.75.75-.75h2.24z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteWord(item.id, item.word)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title={t("vocabularyPage.deleteTooltip")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                  <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.word}
                  </h4>
                  {item.ipa && (
                    <span className="text-xs font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-md bg-[var(--surface-bg-muted)] border border-[var(--border-color)]">
                      {item.ipa}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {item.translation}
                </p>

                {item.example && (
                  <p className="text-xs text-[var(--text-muted)] italic leading-relaxed bg-[var(--surface-bg-muted)] p-2.5 rounded-xl border border-[var(--border-color)]">
                    "{item.example}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW 3: DANH SÁCH TỪ VỰNG CỦA CHỦ ĐỀ CHUẨN
// ─────────────────────────────────────────────
function VocabularyList({ topic, words, onBack, onStartFlashcard }) {
  const { t, i18n } = useTranslation();
  const [showTranslation, setShowTranslation] = useState(true);
  const [search, setSearch] = useState("");
  const isEn = i18n.language === "en";

  const getTopicDisplayName = (tObj) => {
    if (!tObj) return "";
    if (!isEn) return tObj.name;
    const norm = (tObj.name || "").toLowerCase();
    if (norm.includes("động vật") || tObj.id === 1) return "Animals & Wildlife";
    if (norm.includes("trái cây") || norm.includes("thực phẩm") || tObj.id === 2) return "Fruits & Food";
    if (norm.includes("giao tiếp") || tObj.id === 3) return "Everyday Communication";
    if (norm.includes("công việc") || norm.includes("nghề") || tObj.id === 4) return "Work & Careers";
    if (norm.includes("du lịch") || tObj.id === 5) return "Travel & Exploration";
    return tObj.name;
  };

  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;
    const q = search.toLowerCase();
    return words.filter(
      (w) =>
        (w.word && w.word.toLowerCase().includes(q)) ||
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
            {t("vocabularyPage.backToTracks")}
          </button>

          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-bg-muted)] px-3 py-1 rounded-full border border-[var(--border-color)]">
            {t("vocabularyPage.availableEntries", { count: words.length })}
          </span>
        </div>

        {/* Topic Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <TopicIcon name={topic.name} id={topic.id} />
            <div>
              <h2 className="text-2xl font-black text-[var(--text-primary)]">
                {getTopicDisplayName(topic)}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {topic.description || t("vocabularyPage.defaultListDesc")}
              </p>
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
              {showTranslation ? t("vocabularyPage.hideTranslation") : t("vocabularyPage.showTranslation")}
            </button>

            <button
              onClick={onStartFlashcard}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t("vocabularyPage.practiceFlashcards")}
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("vocabularyPage.searchPlaceholder")}
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
                onClick={() => playAudioSpeech(vocab.word)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer"
                title={t("vocabularyPage.pronounce")}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V8.25c0-.414.336-.75.75-.75h2.24z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW 4: LUYỆN TẬP THẺ GHI NHỚ (FLASHCARD ENGINE)
// ─────────────────────────────────────────────
function FlashcardMode({ title, words, onBack }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [remembered, setRemembered] = useState([]);
  const [forgotten, setForgotten] = useState([]);
  const [done, setDone] = useState(false);

  const current = words[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && current?.word) playAudioSpeech(current.word);
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
          <h2 className="text-2xl font-black text-[var(--text-primary)]">
            {t("vocabularyPage.flashcardFinishedTitle")}
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            {t("vocabularyPage.flashcardFinishedDesc", { total: words.length })}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[var(--surface-bg-muted)] border border-[var(--border-color)]">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{percent}%</div>
            <div className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] mt-1">
              {t("vocabularyPage.flashcardProgress")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{remembered.length}</div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5">
                {t("vocabularyPage.flashcardMasteredStat")}
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{forgotten.length}</div>
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-0.5">
                {t("vocabularyPage.flashcardReviewStat")}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleRestart}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              {t("vocabularyPage.flashcardRestart")}
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              {t("vocabularyPage.flashcardReturn")}
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
            ← {t("vocabularyPage.flashcardExit")}
          </button>
          <div className="flex-1 bg-[var(--surface-bg-muted)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
            {t("vocabularyPage.flashcardStep", { current: currentIndex + 1, total: words.length })}
          </span>
        </div>

        {/* 3D Flip Card */}
        <div
          className="relative h-96 w-full cursor-pointer perspective mb-8"
          onClick={handleFlip}
          style={{ perspective: "1000px" }}
        >
          <div
            className="w-full h-full relative transition-transform duration-500 rounded-3xl"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front Side */}
            <div
              className="absolute inset-0 bg-[var(--surface-bg)] border-2 border-[var(--border-color)] rounded-3xl flex flex-col items-center justify-between p-8 shadow-xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="w-full flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold">
                  {t("vocabularyPage.flashcardFrontLabel")}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface-bg-muted)] border border-[var(--border-color)]">
                  {title}
                </span>
              </div>

              <div className="text-center my-auto">
                <h3 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
                  {current.word}
                </h3>
                {current.ipa && (
                  <p className="text-base font-mono text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                    {current.ipa}
                  </p>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudioSpeech(current.word);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-bg-muted)] hover:bg-indigo-500/10 hover:text-indigo-600 border border-[var(--border-color)] text-xs font-bold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V8.25c0-.414.336-.75.75-.75h2.24z" />
                  </svg>
                  {t("vocabularyPage.pronounce")}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                {t("vocabularyPage.flashcardFlipPrompt")}
              </div>
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl flex flex-col items-center justify-between p-8 text-white shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="w-full flex items-center justify-between text-indigo-200">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {t("vocabularyPage.flashcardBackLabel")}
                </span>
                <span className="text-xs opacity-80">{t("vocabularyPage.flashcardBackSide")}</span>
              </div>

              <div className="text-center my-auto px-4">
                <h3 className="text-3xl font-black mb-3">{current.translation}</h3>
                {current.example && (
                  <p className="text-sm text-indigo-100 italic leading-relaxed max-w-md mx-auto">
                    "{current.example}"
                  </p>
                )}
              </div>

              <div className="text-xs font-semibold text-indigo-200">
                {t("vocabularyPage.flashcardRatePrompt")}
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
              {t("vocabularyPage.flashcardNeedReview")}
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl border border-emerald-500/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t("vocabularyPage.flashcardMastered")}
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {t("vocabularyPage.flashcardThinkPrompt")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT CHÍNH: VOCABULARY HUB (PAAS STANDARD)
// ─────────────────────────────────────────────
export default function Vocabulary() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("curated"); // "curated" | "personal"
  const [screen, setScreen] = useState("hub"); // "hub" | "list" | "flashcard"
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicWords, setTopicWords] = useState([]);
  const [personalWords, setPersonalWords] = useState([]);
  const [flashcardSource, setFlashcardSource] = useState("topic"); // "topic" | "personal"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = isTokenValid();

  // Load standard curated topics
  const loadTopics = useCallback(() => {
    return api.get("/api/topics")
      .then((res) => {
        if (!res.ok) throw new Error(t("vocabularyPage.errorLoadTopics"));
        return res.json();
      })
      .then(setTopics)
      .catch((err) => setError(err.message));
  }, [t]);

  // Load user's personal saved words if logged in
  const loadPersonalWords = useCallback(() => {
    if (!isLoggedIn) return Promise.resolve();
    return api.get("/api/user-vocabulary")
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        if (Array.isArray(data)) setPersonalWords(data);
      })
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadTopics(), loadPersonalWords()])
      .finally(() => setLoading(false));
  }, [loadTopics, loadPersonalWords]);

  // Handle select standard topic
  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    try {
      const res = await api.get(`/api/topics/${topic.id}/vocabularies`);
      if (!res.ok) throw new Error(t("vocabularyPage.errorLoadWords"));
      const data = await res.json();
      setTopicWords(data);
      setScreen("list");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete personal word
  const handleDeletePersonalWord = async (id, wordText) => {
    const confirmMsg = t("vocabularyPage.confirmDelete", { word: wordText });
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.delete(`/api/user-vocabulary/${id}`);
      if (res.ok) {
        setPersonalWords((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete word:", err);
    }
  };

  // Start flashcards for personal words
  const handleStartPersonalFlashcards = () => {
    if (personalWords.length === 0) return;
    setFlashcardSource("personal");
    setScreen("flashcard");
  };

  // Start flashcards for selected topic
  const handleStartTopicFlashcards = () => {
    if (topicWords.length === 0) return;
    setFlashcardSource("topic");
    setScreen("flashcard");
  };

  // Metrics
  const totalCuratedWords = useMemo(() => {
    return topics.reduce((acc, tItem) => acc + (tItem.wordCount || 0), 0);
  }, [topics]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)]">
        <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
          <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full" />
          <p className="text-xs font-mono uppercase tracking-wider">{t("vocabularyPage.loadingData")}</p>
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
            {t("vocabularyPage.reloadPage")}
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 1: FLASHCARD RUNNER
  if (screen === "flashcard") {
    const isTopic = flashcardSource === "topic";
    const wordsList = isTopic ? topicWords : personalWords;
    const cardTitle = isTopic
      ? (i18n.language === "en" ? "Curated Track" : (selectedTopic?.name || "Chuyên đề"))
      : t("vocabularyPage.personalTitle");

    return (
      <FlashcardMode
        title={cardTitle}
        words={wordsList}
        onBack={() => setScreen(isTopic ? "list" : "hub")}
      />
    );
  }

  // SCREEN 2: TOPIC VOCABULARY LIST
  if (screen === "list") {
    return (
      <VocabularyList
        topic={selectedTopic}
        words={topicWords}
        onBack={() => setScreen("hub")}
        onStartFlashcard={handleStartTopicFlashcards}
      />
    );
  }

  // SCREEN 3: MAIN HUB WITH TABS
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Hero Banner Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--border-color)] mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {t("vocabularyPage.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {t("vocabularyPage.title")}
            </h1>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              {t("vocabularyPage.subtitle")}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-[var(--surface-bg)] border border-[var(--border-color)] px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="text-left pr-4 border-r border-[var(--border-color)]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                {t("vocabularyPage.metricsTracks")}
              </div>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-tight">
                {topics.length}
              </div>
            </div>
            <div className="text-left pr-4 border-r border-[var(--border-color)]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                {t("vocabularyPage.metricsWords")}
              </div>
              <div className="text-lg font-black text-[var(--text-primary)] leading-tight">
                {totalCuratedWords}
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                {t("vocabularyPage.metricsPersonal")}
              </div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400 leading-tight">
                {isLoggedIn ? personalWords.length : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[var(--surface-bg-muted)] border border-[var(--border-color)] shadow-inner">
            <button
              onClick={() => setActiveTab("curated")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "curated"
                  ? "bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t("vocabularyPage.tabCurated")}
            </button>

            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "personal"
                  ? "bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              {t("vocabularyPage.tabPersonal")}
              {isLoggedIn && personalWords.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  {personalWords.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "curated" ? (
          <CuratedTopicGrid
            topics={topics}
            onSelectTopic={handleSelectTopic}
          />
        ) : (
          <PersonalDeckView
            words={personalWords}
            isLoggedIn={isLoggedIn}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteWord={handleDeletePersonalWord}
            onStartFlashcard={handleStartPersonalFlashcards}
          />
        )}
      </div>

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onWordAdded={loadPersonalWords}
      />
    </div>
  );
}