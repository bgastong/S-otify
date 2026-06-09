import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SongCard({ song, onSelectSong, isEmbeddable = true, isSelected = false }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (typeof onSelectSong === "function") {
      onSelectSong(song);
    }

    navigate(`/details/${song.id}`);
  };

  const handlePlayClick = (event) => {
    event.stopPropagation();

    if (typeof onSelectSong === "function") {
      onSelectSong(song, { autoplay: true });
      return;
    }

    navigate(`/details/${song.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleCardClick();
      }}
      role="button"
      tabIndex={0}
      className={`group cursor-pointer rounded-lg p-3 outline-none transition hover:-translate-y-1 ${
        isSelected
          ? "bg-green-500/15 ring-1 ring-green-500/40"
          : "bg-[#181818] hover:bg-[#282828]"
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-800 shadow-xl shadow-black/50">
        {!imageError && song.image ? (
          <img
            src={song.image}
            alt={`Portada de ${song.name}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            <span className="text-4xl text-zinc-500">♪</span>
          </div>
        )}

        <button
          type="button"
          onClick={handlePlayClick}
          aria-label={`Reproducir ${song.name}`}
          className="absolute bottom-2 right-2 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-green-500 text-sm font-black text-black opacity-0 shadow-xl transition hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100"
        >
          ▶
        </button>
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-bold text-white">{song.name}</h3>
        <p className="mt-1 truncate text-sm text-zinc-400">{song.artist}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {song.genre && (
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase text-green-400">
              {song.genre}
            </span>
          )}

          {!isEmbeddable && (
            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase text-amber-300">
              No disponible
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default SongCard;