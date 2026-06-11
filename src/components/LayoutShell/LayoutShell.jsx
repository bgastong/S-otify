import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LayoutShell({ children, selectedSong }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navClass = (path) =>
    `group grid h-12 w-12 place-items-center rounded-2xl transition ${
      location.pathname === path
        ? "bg-[#1db954] text-black shadow-lg shadow-[#1db954]/20"
        : "bg-[#181818] text-zinc-400 hover:bg-[#242424] hover:text-white"
    }`;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[linear-gradient(180deg,#03150a_0%,#000_30%,#000_100%)]" />

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center border-r border-white/5 bg-black p-3 md:flex">
       <Link
  to="/"
  className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#121212] ring-1 ring-white/10 transition hover:bg-[#181818]"
  title="Sñotify"
>
  <img
    src="/logo (2).png"
    alt="Sñotify"
    className="h-12 w-12 object-contain drop-shadow-[0_0_12px_rgba(29,185,84,0.45)]"
  />
</Link>

        <nav className="mt-8 flex flex-col gap-3">
          <Link to="/" className={navClass("/")} title={t("nav.home")}>
            <span className="text-xl">⌂</span>
          </Link>

          <Link
            to="/favorites"
            className={navClass("/favorites")}
            title={t("nav.favorites")}
          >
            <span className="text-xl">♡</span>
          </Link>
        </nav>

        <div className="mt-8 h-px w-10 bg-white/10" />

        <div className="mt-5 flex flex-col gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#181818] text-zinc-400 ring-1 ring-white/5">
            ♪
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#181818] text-zinc-400 ring-1 ring-white/5">
            ♫
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#181818] text-zinc-400 ring-1 ring-white/5">
            ●
          </div>
        </div>

        <div className="mt-auto mb-28 grid h-12 w-12 place-items-center rounded-2xl bg-[#181818] text-zinc-500 ring-1 ring-white/5">
          ∿
        </div>
      </aside>

      <section className="relative grid min-h-screen gap-3 px-4 pb-36 pt-20 md:ml-20 md:px-5 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 overflow-hidden rounded-xl bg-[#121212] p-5 md:p-7">
          {children}
        </div>

        <aside className="sticky top-20 hidden h-[calc(100vh-8.5rem)] overflow-y-auto rounded-xl bg-[#121212] p-4 xl:block">
          <h2 className="mb-4 truncate text-base font-bold">
            {selectedSong ? selectedSong.name : t("player.nowPlaying", "Reproduciendo ahora")}
          </h2>

          {selectedSong ? (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-xl bg-[#242424]">
                {selectedSong.image ? (
                  <img
                    src={selectedSong.image}
                    alt={selectedSong.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-square place-items-center text-6xl text-zinc-600">
                    ♪
                  </div>
                )}
              </div>

              <div>
                <h3 className="truncate text-2xl font-black">
                  {selectedSong.name}
                </h3>
                <p className="truncate text-sm text-zinc-400">
                  {selectedSong.artist}
                </p>
              </div>

              <div className="rounded-xl bg-[#181818] p-4">
                <h4 className="mb-3 font-bold">
                  {t("details.aboutSong", "Acerca de la canción")}
                </h4>

                <p className="text-sm text-zinc-400">
                  {t("details.genre", "Género")}:{" "}
                  <span className="font-semibold text-white">
                    {selectedSong.genre || "-"}
                  </span>
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  {t("details.album", "Álbum")}:{" "}
                  <span className="font-semibold text-white">
                    {selectedSong.album || "-"}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#181818] p-5 text-sm text-zinc-400">
              {t("player.selectSong", "Seleccioná una canción para ver más información.")}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default LayoutShell;