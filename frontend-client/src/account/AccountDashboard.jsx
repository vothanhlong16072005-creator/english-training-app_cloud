import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api, BASE_URL } from "../auth/apiClient";
import { getUser, logout } from "../auth/authUtils";
import { useTranslation } from "react-i18next";

// ─── Helpers dùng chung ───────────────────────────────────────────────────────
function parseMistakes(raw) {
    if (!raw) return { missing_words: [], wrong_words: [] };
    try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
            missing_words: (parsed.word_analysis || []).filter(w => w.status === "wrong").map(w => w.word),
            wrong_words: parsed.extra_words || [],
        };
    } catch {
        const wrongWords = [], extraWords = [];
        const wordRegex = /\{word=([^,}]+(?:,(?!\s*status))*)[\s]*,[\s]*status=wrong\}/g;
        let m;
        while ((m = wordRegex.exec(raw)) !== null) wrongWords.push(m[1].trim());
        const extraMatch = raw.match(/extra_words=\[([^\]]*)\]/);
        if (extraMatch?.[1]) extraMatch[1].split(",").map(w => w.trim()).filter(Boolean).forEach(w => extraWords.push(w));
        return { missing_words: wrongWords, wrong_words: extraWords };
    }
}

function formatDate(str) {
    if (!str) return "";
    return new Date(str).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Avatar có nút upload (Profile Header) ────────────────────────────────────
function UploadableAvatar({ user, onUploadSuccess }) {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(user?.avatarUrl || null);
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Chỉ chấp nhận file ảnh (jpg, png, webp...)");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("Ảnh tối đa 10MB");
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        setError("");
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/users/${user?.userId || user?.id}/avatar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại!");
                }
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Upload thất bại");
            }

            const data = await res.json();
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            stored.avatarUrl = data.avatarUrl;
            localStorage.setItem("user", JSON.stringify(stored));

            setPreview(data.avatarUrl);
            onUploadSuccess?.(data.avatarUrl);
        } catch (err) {
            setError(err.message);
            setPreview(user?.avatarUrl || null);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const initials = (user?.username || "U").charAt(0).toUpperCase();

    return (
        <div className="relative shrink-0 group">
            <div className="w-20 h-20 rounded-2xl ring-2 ring-indigo-500/30 shadow-md overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {preview ? (
                    <img src={preview} alt={user?.username} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl font-black text-white">{initials}</span>
                )}
            </div>

            <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-2xl bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Thay ảnh đại diện"
            >
                {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                )}
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                    {uploading ? "..." : "Đổi ảnh"}
                </span>
            </button>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {error && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 text-center text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 shadow-lg z-10 font-semibold">
                    {error}
                </div>
            )}
        </div>
    );
}

// ─── Tab 1: Tổng Quan ─────────────────────────────────────────────────────────
function OverviewTab({ history, savedWords, t }) {
    const navigate = useNavigate();
    const hasHistory = history.length > 0;
    const avgScore = hasHistory ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
    const bestScore = hasHistory ? Math.round(Math.max(...history.map(h => h.score))) : 0;
    const recent = history.slice(0, 5);

    const [studiedLessons, setStudiedLessons] = useState([]);
    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem("in_progress_lessons") || "[]");
            setStudiedLessons(list);
        } catch {
            // ignore JSON parse error
        }
    }, []);

    const statScoreColor = (score, hasData) => {
        if (!hasData) return "text-[var(--text-primary)]";
        if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
        if (score >= 60) return "text-amber-600 dark:text-amber-400";
        return "text-indigo-600 dark:text-indigo-400";
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Practice */}
                <div className="rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md bg-[var(--surface-bg)] border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                        {t("account.stats.totalPractice")}
                    </p>
                    <p className="mt-1 text-3xl font-black text-[var(--text-primary)]">
                        {history.length}
                    </p>
                </div>

                {/* 2. Avg Score */}
                <div className="rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md bg-[var(--surface-bg)] border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                        {t("account.stats.avgScore")}
                    </p>
                    <p className={`mt-1 text-3xl font-black ${statScoreColor(avgScore, hasHistory)}`}>
                        {hasHistory ? avgScore : "—"}
                    </p>
                </div>

                {/* 3. Best Score */}
                <div className="rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md bg-[var(--surface-bg)] border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004 0A5.25 5.25 0 0018 9.75v-1.5c0-.621-.504-1.125-1.125-1.125h-.872M7.5 9.75A5.25 5.25 0 0012 15m-4.5-5.25v-1.5c0-.621.504-1.125 1.125-1.125h.872m0 0a5.25 5.25 0 019.004 0" />
                        </svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                        {t("account.stats.bestScore")}
                    </p>
                    <p className={`mt-1 text-3xl font-black ${statScoreColor(bestScore, hasHistory)}`}>
                        {hasHistory ? bestScore : "—"}
                    </p>
                </div>

                {/* 4. Saved Words */}
                <div className="rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md bg-[var(--surface-bg)] border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                        {t("account.stats.savedWords")}
                    </p>
                    <p className="mt-1 text-3xl font-black text-indigo-600 dark:text-indigo-400">
                        {savedWords.length}
                    </p>
                </div>
            </div>

            {/* In-Progress Lessons */}
            <div className="rounded-2xl border p-6 shadow-sm bg-[var(--surface-bg)] border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                        </svg>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Bài học đang rèn luyện
                        </h3>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                        Xem tất cả bài học →
                    </button>
                </div>

                {studiedLessons.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)]">
                        <p className="text-xs text-[var(--text-muted)] font-medium mb-3">
                            Chưa có bài học nào trong danh sách. Bắt đầu bài học đầu tiên ngay!
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Khám phá bài học
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {studiedLessons.map((l) => (
                            <div key={l.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg-muted)] hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                            l.completed
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                        }`}>
                                            {l.completed ? "Đã xong clip" : "Đang học"}
                                        </span>
                                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                            {formatDate(l.lastStudiedAt)}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {l.title}
                                    </h4>
                                </div>
                                <button
                                    onClick={() => navigate(`/lesson/${l.id}`)}
                                    className="mt-3.5 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    Tiếp tục học
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border p-6 shadow-sm bg-[var(--surface-bg)] border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        {t("account.recentActivity")}
                    </h3>
                </div>

                {recent.length === 0 ? (
                    <div className="text-center py-12 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)]">
                        <svg className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-sm font-semibold text-[var(--text-muted)] mb-3">{t("account.noPractice")}</p>
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            {t("account.startNow")}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {recent.map((item) => {
                            const score = Math.round(item.score);
                            const scoreBadge = score >= 85
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : score >= 60
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
                            return (
                                <div key={item.id} className="flex items-center gap-4 rounded-xl p-3.5 transition-colors border border-[var(--border-color)] bg-[var(--surface-bg-muted)] hover:bg-[var(--surface-hover)]">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${scoreBadge}`}>
                                        {score}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-bold text-[var(--text-primary)]">{item.expectedTextSnapshot}</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDate(item.createdAt)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Tab 2: Lịch Sử Luyện Tập ────────────────────────────────────────────────
function HistoryTab({ history, loading, error, t }) {
    const navigate = useNavigate();
    const [openId, setOpenId] = useState(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mr-2" />
                <span className="text-xs font-mono uppercase tracking-wider">{t("lessonList.loading")}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-semibold">
                {error}
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)] p-8">
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-4">{t("account.noPractice")}</p>
                <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                    {t("account.startPractice")}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {history.map((item) => {
                const mistakes = parseMistakes(item.mistakes);
                const missing = mistakes.missing_words || [];
                const wrong = mistakes.wrong_words || [];
                const isOpen = openId === item.id;
                const lessonId = item.sentence?.lesson?.id;
                const lessonTitle = item.sentence?.lesson?.title || t("account.lessonLabel");
                const show2m = missing.slice(0, 2);
                const show2w = wrong.slice(0, 2);
                const extra = missing.length + wrong.length - show2m.length - show2w.length;
                const score = Math.round(item.score);

                return (
                    <div key={item.id} className="overflow-hidden rounded-2xl border transition-all hover:shadow-sm bg-[var(--surface-bg)] border-[var(--border-color)]">
                        <div className="flex items-stretch">
                            {/* Score Box */}
                            <div className="flex flex-col items-center justify-center border-r px-4 py-4 border-[var(--border-color)] shrink-0">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black ${
                                    score >= 85
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                        : score >= 60
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                }`}>
                                    {score}
                                </div>
                            </div>

                            {/* Body */}
                            <div
                                className="flex-1 min-w-0 cursor-pointer px-4 py-3.5 transition-colors hover:bg-[var(--surface-hover)]"
                                onClick={() => setOpenId(isOpen ? null : item.id)}
                            >
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="text-[11px] px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-bold border border-indigo-500/20">
                                        {lessonTitle}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)] font-mono">{formatDate(item.createdAt)}</span>
                                </div>
                                <p className="mb-1 truncate text-sm font-bold text-[var(--text-primary)]">{item.expectedTextSnapshot}</p>
                                <p className="mb-2 truncate text-xs italic text-[var(--text-muted)]">"{item.transcript}"</p>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {!missing.length && !wrong.length ? (
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                            {t("account.noErrors")}
                                        </span>
                                    ) : (
                                        <>
                                            {show2m.map(w => (
                                                <span key={w} className="text-[11px] px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md font-semibold">
                                                    {w} — {t("account.missing")}
                                                </span>
                                            ))}
                                            {show2w.map(w => (
                                                <span key={w} className="text-[11px] px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md font-semibold">
                                                    {w} — {t("account.wrong")}
                                                </span>
                                            ))}
                                            {extra > 0 && <span className="text-xs text-[var(--text-muted)]">+{extra} {t("account.moreWords")}</span>}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex min-w-[100px] flex-col border-l border-[var(--border-color)]">
                                <button
                                    onClick={() => lessonId && navigate(`/lesson/${lessonId}`)}
                                    className="flex flex-1 items-center justify-center gap-1.5 border-b px-3 py-2.5 transition-colors border-[var(--border-color)] hover:bg-indigo-500/10 hover:text-indigo-600 text-[var(--text-secondary)] text-xs font-bold cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                    </svg>
                                    {t("account.retry")}
                                </button>
                                <button
                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                    className="flex flex-1 items-center justify-center gap-1 px-3 py-2.5 transition-colors hover:bg-[var(--surface-hover)] text-[var(--text-muted)] text-xs font-semibold cursor-pointer"
                                >
                                    <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                    {t("account.details")}
                                </button>
                            </div>
                        </div>

                        {isOpen && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t px-6 py-4 bg-[var(--surface-bg-muted)] border-[var(--border-color)]">
                                <div className="space-y-3">
                                    <div>
                                        <p className="mb-1 text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">{t("account.original")}</p>
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">{item.expectedTextSnapshot}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">{t("account.youSaid")}</p>
                                        <p className="text-sm italic text-[var(--text-secondary)]">"{item.transcript}"</p>
                                    </div>
                                </div>
                                <div className="md:border-l md:pl-4 border-[var(--border-color)]">
                                    <p className="mb-2 text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">{t("account.feedback")}</p>
                                    {!missing.length && !wrong.length ? (
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {t("account.perfectPron")}
                                        </span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1.5">
                                            {missing.map(w => (
                                                <span key={w} className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md font-semibold">
                                                    {w} — {t("account.missing")}
                                                </span>
                                            ))}
                                            {wrong.map(w => (
                                                <span key={w} className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md font-semibold">
                                                    {w} — {t("account.wrong")}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Tab 3: Từ Vựng Đã Lưu ───────────────────────────────────────────────────
function SavedVocabTab({ words, loading, onDelete, t }) {
    const [flashcardMode, setFlashcardMode] = useState(false);
    const [shuffled, setShuffled] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [remembered, setRemembered] = useState([]);
    const [done, setDone] = useState(false);

    const startFlashcard = () => {
        const arr = [...words].sort(() => Math.random() - 0.5);
        setShuffled(arr);
        setCurrentIndex(0);
        setIsFlipped(false);
        setRemembered([]);
        setDone(false);
        setFlashcardMode(true);
    };

    const handleAnswer = (ok) => {
        if (ok) setRemembered(r => [...r, shuffled[currentIndex].id]);
        if (currentIndex + 1 >= shuffled.length) { setDone(true); return; }
        setCurrentIndex(i => i + 1);
        setIsFlipped(false);
    };

    const playAudio = (word) => {
        if (!word || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(word);
        u.lang = "en-US";
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    };

    if (flashcardMode) {
        if (done) return (
            <div className="flex flex-col items-center justify-center py-16 gap-5 bg-[var(--surface-bg)] border border-[var(--border-color)] rounded-3xl p-8 max-w-md mx-auto shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-[var(--text-primary)] mb-1">{t("vocab.completed")}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {t("vocab.remembered")} <strong className="text-emerald-600 dark:text-emerald-400 font-black">{remembered.length}</strong> / {shuffled.length}
                    </p>
                </div>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={startFlashcard}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                    >
                        {t("vocab.redo")}
                    </button>
                    <button
                        onClick={() => setFlashcardMode(false)}
                        className="flex-1 py-3 rounded-xl border border-[var(--border-color)] font-bold text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                    >
                        {t("vocab.backToList")}
                    </button>
                </div>
            </div>
        );

        const current = shuffled[currentIndex];
        return (
            <div className="max-w-lg mx-auto py-6">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setFlashcardMode(false)}
                        className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                        ← {t("vocab.exit")}
                    </button>
                    <div className="flex-1 h-2 bg-[var(--surface-bg-muted)] border border-[var(--border-color)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / shuffled.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
                        {currentIndex + 1} / {shuffled.length}
                    </span>
                </div>

                <div
                    className="relative cursor-pointer mb-6"
                    style={{ perspective: "1000px" }}
                    onClick={() => { setIsFlipped(f => !f); if (!isFlipped) playAudio(current.word); }}
                >
                    <div
                        className="relative w-full rounded-3xl shadow-xl transition-transform duration-500"
                        style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            minHeight: "260px"
                        }}
                    >
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-between rounded-3xl p-8 bg-[var(--surface-bg)] border-2 border-[var(--border-color)]"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[var(--text-muted)]">
                                {t("vocab.englishWord")}
                            </span>
                            <div className="text-center my-auto">
                                <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-2">{current.word}</h2>
                                {current.ipa && <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{current.ipa}</p>}
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-muted)]">{t("vocab.tapToReveal")}</span>
                        </div>

                        <div
                            className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl flex flex-col items-center justify-between p-8 text-white shadow-2xl"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-indigo-200">
                                {t("vocab.vietnamese")}
                            </span>
                            <div className="text-center my-auto px-4">
                                <h2 className="text-2xl sm:text-3xl font-black mb-2">{current.translation}</h2>
                                {current.example && <p className="text-xs text-indigo-100 italic leading-relaxed">"{current.example}"</p>}
                            </div>
                            <span className="text-xs text-indigo-200">Đánh giá ghi nhớ bên dưới</span>
                        </div>
                    </div>
                </div>

                {isFlipped ? (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleAnswer(false)}
                            className="py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-xl border border-amber-500/30 text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                            {t("vocab.review")}
                        </button>
                        <button
                            onClick={() => handleAnswer(true)}
                            className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl border border-emerald-500/30 text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                            {t("vocab.known")}
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-[var(--text-muted)] text-xs font-medium">{t("vocab.thinkFirst")}</p>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mr-2" />
                <span className="text-xs font-mono uppercase tracking-wider">{t("lessonList.loading")}</span>
            </div>
        );
    }

    if (words.length === 0) {
        return (
            <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg-muted)] p-8">
                <svg className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{t("vocab.noWords")}</p>
                <p className="text-xs text-[var(--text-muted)]">{t("vocab.saveHint")}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    {words.length} {t("vocab.savedCount")}
                </span>
                <button
                    onClick={startFlashcard}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {t("vocab.flashcard")}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {words.map((vocab) => (
                    <div key={vocab.id} className="group flex items-start gap-3 rounded-2xl border p-4 shadow-sm transition-all hover:border-indigo-400/50 hover:shadow-md bg-[var(--surface-bg)] border-[var(--border-color)]">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-base text-[var(--text-primary)]">{vocab.word}</span>
                                {vocab.ipa && <span className="text-xs font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-bg-muted)] border border-[var(--border-color)]">{vocab.ipa}</span>}
                                <button
                                    onClick={() => playAudio(vocab.word)}
                                    className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                                    title="Nghe phát âm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V8.25c0-.414.336-.75.75-.75h2.24z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{vocab.translation}</p>
                            {vocab.example && <p className="text-xs text-[var(--text-muted)] italic truncate">"{vocab.example}"</p>}
                            <p className="mt-1 text-[11px] font-mono text-[var(--text-muted)]">{formatDate(vocab.createdAt)}</p>
                        </div>
                        <button
                            onClick={() => onDelete(vocab.id)}
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            title={t("vocab.deleteTooltip")}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main: AccountDashboard ───────────────────────────────────────────────────
export default function AccountDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser());
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("overview");
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState("");
    const [savedWords, setSavedWords] = useState([]);
    const [vocabLoading, setVocabLoading] = useState(true);
    const [authExpired, setAuthExpired] = useState(false);

    useEffect(() => {
        if (!user) { navigate("/login"); return; }

        api.get("/api/evaluate/history")
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setAuthExpired(true);
                    throw new Error("Phiên đăng nhập đã hết hạn");
                }
                if (!res.ok) throw new Error(t("account.errorLoadHistory"));
                return res.json();
            })
            .then(setHistory)
            .catch(err => setHistoryError(err.message))
            .finally(() => setHistoryLoading(false));

        api.get("/api/user-vocabulary")
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setAuthExpired(true);
                    return [];
                }
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => { if (Array.isArray(data)) setSavedWords(data); })
            .catch(() => {})
            .finally(() => setVocabLoading(false));
    }, [user, navigate, t]);

    const handleDeleteWord = useCallback(async (id) => {
        if (!window.confirm(t("account.deleteConfirm"))) return;
        const res = await api.delete(`/api/user-vocabulary/${id}`);
        if (res.ok) setSavedWords(prev => prev.filter(w => w.id !== id));
    }, [t]);

    const handleAvatarUploaded = (newAvatarUrl) => {
        setUser(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
    };

    // Xác định email hiển thị
    const displayEmail = user?.email || (user?.username?.includes("@") ? user.username : t("account.noEmail"));

    return (
        <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                {/* Banner cảnh báo phiên đăng nhập hết hạn (403 fix) */}
                {authExpired && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                                Phiên đăng nhập đám mây đã hết hạn hoặc máy chủ đã được cập nhật. Vui lòng đăng xuất và đăng nhập lại!
                            </p>
                        </div>
                        <button
                            onClick={() => { logout(); navigate("/login"); }}
                            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
                        >
                            Đăng nhập lại
                        </button>
                    </div>
                )}

                {/* Profile Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-3xl border p-6 sm:p-8 shadow-sm bg-[var(--surface-bg)] border-[var(--border-color)]">
                    <UploadableAvatar user={user} onUploadSuccess={handleAvatarUploaded} />

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                            <h1 className="truncate text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                                {user?.username}
                            </h1>
                            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                {user?.role || "USER"}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
                            {displayEmail}
                        </p>
                        <p className="mt-3 text-xs text-[var(--text-muted)] inline-flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Di chuột vào ảnh để thay đổi ảnh đại diện
                        </p>
                    </div>

                    <button
                        onClick={() => { logout(); navigate("/login"); }}
                        className="rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all text-[var(--text-secondary)] border-[var(--border-color)] hover:border-rose-300 hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
                    >
                        {t("account.logout")}
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex p-1.5 rounded-2xl border bg-[var(--surface-bg-muted)] border-[var(--border-color)] shadow-inner">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            activeTab === "overview"
                                ? "bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border-color)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        <span>{t("account.tabs.overview")}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            activeTab === "history"
                                ? "bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border-color)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{t("account.tabs.history")}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("vocabulary")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            activeTab === "vocabulary"
                                ? "bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border-color)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <span>{t("account.tabs.saved")}</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "overview" && (
                        <OverviewTab history={history} savedWords={savedWords} t={t} />
                    )}
                    {activeTab === "history" && (
                        <HistoryTab history={history} loading={historyLoading} error={historyError} t={t} />
                    )}
                    {activeTab === "vocabulary" && (
                        <SavedVocabTab words={savedWords} loading={vocabLoading} onDelete={handleDeleteWord} t={t} />
                    )}
                </div>
            </div>
        </div>
    );
}