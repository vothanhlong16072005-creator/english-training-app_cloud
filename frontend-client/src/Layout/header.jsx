import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../auth/authUtils";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const isVi = i18n.language === "vi";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(isVi ? "en" : "vi");
  };

  const navLinks = [
    { to: "/", label: t("header.lessons") },
    { to: "/vocabulary", label: t("header.vocabulary") },
    { to: "/account", label: t("header.account") },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[var(--border-color)] px-6 py-3.5 flex items-center justify-between shadow-sm backdrop-blur-md">
      {/* Logo liên kết trực tiếp về Trang Chủ */}
      <Link 
        to="/" 
        className="flex items-center gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl px-1 py-0.5 transition-transform hover:scale-[1.02]"
        title="Trang chủ EnglishMaster"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
          <svg className="w-5 h-5 transition-transform group-hover:rotate-[-4deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text tracking-tight font-display">
            EnglishMaster
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] -mt-1 hidden sm:inline">
            Cloud Learning Platform
          </span>
        </div>
      </Link>

      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex items-center gap-2 bg-[var(--surface-bg-muted)] p-1 rounded-full border border-[var(--border-color)]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border-color)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        {/* Nút chuyển đổi sáng/tối */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--surface-bg-muted)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:scale-105 active:scale-95 transition-all shadow-sm"
          aria-label={isDark ? t("header.lightLabel") : t("header.darkLabel")}
          title={isDark ? t("header.light") : t("header.dark")}
        >
          <span className="text-lg leading-none">{isDark ? "☀" : "☾"}</span>
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide hidden sm:inline">{isDark ? t("header.light") : t("header.dark")}</span>
        </button>

        {/* Nút chuyển đổi ngôn ngữ */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--surface-bg-muted)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:scale-105 active:scale-95 transition-all shadow-sm"
          aria-label={isVi ? "Switch to English" : "Chuyển sang tiếng Việt"}
          title={isVi ? "English" : "Tiếng Việt"}
        >
          <span className="text-lg leading-none">{isVi ? "🇬🇧" : "🇻🇳"}</span>
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide hidden sm:inline">{isVi ? "EN" : "VN"}</span>
        </button>

        <div className="w-px h-6 bg-[var(--border-color)] mx-1 hidden sm:block"></div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/account"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-400 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-indigo-400 shadow-sm">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-bold hidden md:inline text-[var(--text-primary)]">{user.username}</span>
            </Link>

            <button 
              onClick={handleLogout} 
              className="px-3 py-1.5 text-sm font-bold text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors border border-transparent hover:border-rose-600 hidden sm:block"
            >
              {t("header.logout")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors hidden sm:block">
              {t("header.login")}
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
              {t("header.register")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
