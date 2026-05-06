import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SongCard({ song }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/details/${song.id}`);
  };

  return (
    <article
      className="flex flex-col gap-3 p-4 bg-gradient-to-br from-[#1e1e2e] to-[#2d2d44] rounded-lg cursor-pointer transition-all duration-300 border border-white/10 hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-white/20 hover:bg-gradient-to-br hover:from-[#252535] hover:to-[#353550] focus-visible:outline-2 focus-visible:outline-indigo-500"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-[#0f0f1e] to-[#1a1a2e]">
        {!imageError && song.image ? (
          <img
            src={song.image}
            alt={`Portada de ${song.name}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e1e2e] to-[#2d2d44] text-white/30">
            <span className="text-5xl">♪</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 min-h-12">
        <h3 className="m-0 text-sm font-semibold text-white line-clamp-2 leading-snug">
          {song.name}
        </h3>
        <p className="m-0 text-xs text-white/70 truncate">
          {song.artist}
        </p>
        {song.genre && (
          <p className="m-0 text-xs text-white/50 capitalize tracking-wide">
            {song.genre}
          </p>
        )}
      </div>
    </article>
  );
}

export default SongCard;
