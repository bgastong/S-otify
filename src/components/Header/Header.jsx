import { useState, useEffect, useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import { useAuth } from "../../context/AuthContext.jsx";

function Header({
  searchTerm = "",
  onSearchChange,
  onFilterChange,
  currentGenre = "",
}) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [genres, setGenres] = useState([]);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);
  const searchInputId = useId();

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    songsService
      .getSongs({ page: 1, limit: 20 })
      .then((songs) => {
        const uniqueGenres = [
          ...new Set(songs.map((song) => song.genre).filter(Boolean)),
        ].sort();

        setGenres(uniqueGenres);
      })
      .catch(() => setGenres([]));
  }, []);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("snortify_language", lang);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl md:left-20">
      <nav className="flex h-16 items-center gap-3 px-4 md:px-6">
        <div className="flex min-w-fit items-center">
          <span className="text-lg font-black tracking-tight">SÑOTIFY</span>
        </div>

        <div className="relative flex flex-1 items-center">
          <span className="absolute left-4 text-zinc-500">⌕</span>
          <input
            id={searchInputId}
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={t("home.searchPlaceholder")}
            className="h-11 w-full rounded-full border border-white/10 bg-[#1a1a1a] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:bg-[#242424] focus:border-white/30"
          />
        </div>

        {genres.length > 0 && (
          <div className="relative hidden sm:block" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="h-11 rounded-full border border-white/10 bg-[#181818] px-4 text-sm font-bold text-zinc-200 transition hover:bg-[#242424]"
            >
              {currentGenre || t("home.filterAllGenres")} ▾
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-white/10 bg-[#181818] p-2 shadow-2xl shadow-black/70">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange?.("");
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    !currentGenre
                      ? "bg-[#1db954] text-black"
                      : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {t("home.filterAllGenres")}
                </button>

                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      onFilterChange?.(genre);
                      setOpen(false);
                    }}
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
                      currentGenre === genre
                        ? "bg-[#1db954] text-black"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex rounded-full bg-[#181818] p-1">
          <button
            type="button"
            onClick={() => changeLang("es")}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${
              i18n.language === "es"
                ? "bg-[#1db954] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => changeLang("en")}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${
              i18n.language === "en"
                ? "bg-[#1db954] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            GB
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#181818] text-lg text-zinc-200 transition hover:bg-[#242424]"
            aria-label={t("auth.account")}
          >
            👤
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-white/10 bg-[#181818] p-3 shadow-2xl shadow-black/70">
              {user ? (
                <>
                  <div className="mb-3 rounded-lg border border-white/10 bg-black/30 p-3">
                    <p className="text-sm font-semibold text-white">
                      {user.name || t("auth.user")}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                  >
                    {t("auth.logout")}
                  </button>
                </>
              ) : (
                <div className="space-y-2 flex flex-col">
                  <a
                   href="/login"
                    type="button"
                    className="w-full rounded-lg bg-[#1db954] px-3 py-2 text-left text-sm font-semibold text-black transition hover:bg-[#1ed760]"
                  >
                    {t("auth.login")}
                  </a>
                  <a
                    href="/register"
                    type="button"
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                  >
                    {t("auth.register")}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;