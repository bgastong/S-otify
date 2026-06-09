import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Play = () => <span className="text-sm">▶</span>;
const Pause = () => <span className="text-sm">Ⅱ</span>;

function formatTime(time) {
  if (!time) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function Slider({ value, max, onChange, disabled }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="relative h-1 w-full rounded-full bg-white/15">
      <div className="absolute left-0 top-0 h-1 rounded-full bg-zinc-200" style={{ width: `${percentage}%` }} />
      <input type="range" min="0" max={max} step={max <= 1 ? 0.01 : 1} value={value} onChange={onChange} disabled={disabled} className="absolute inset-0 h-1 w-full cursor-pointer opacity-0" />
    </div>
  );
}

function Player({ audioUrl = "", title = "", artist = "", image = "", notice = "", playRequestId = 0 }) {
  const { t } = useTranslation();
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState("");

  const hasTrack = Boolean(audioUrl);

  useEffect(() => {
    setPlayerError("");
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!playRequestId || !hasTrack || !audioRef.current) return;

    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
      setIsPlaying(false);
      setPlayerError(t("player.audioLoadError"));
    });
  }, [playRequestId, hasTrack, t]);

  const toggle = () => {
    if (!hasTrack || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
      setIsPlaying(false);
      setPlayerError(t("player.audioLoadError"));
    });
  };

  const seek = (event) => {
    if (!hasTrack || !audioRef.current) return;
    const time = Number(event.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const uiError = playerError || notice;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-black px-4 py-3">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          setDuration(audioRef.current.duration || 0);
          audioRef.current.volume = volume;
        }}
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          setCurrentTime(audioRef.current.currentTime || 0);
          setIsPlaying(!audioRef.current.paused);
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setPlayerError(t("player.audioLoadError"));
        }}
        className="hidden"
        preload="metadata"
      />

      <div className="grid items-center gap-4 md:grid-cols-[1fr_2fr_1fr]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded bg-[#181818]">
            {image ? <img src={image} alt={title} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-zinc-500">♪</div>}
          </div>
          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${title ? "text-white" : "text-zinc-500"}`}>{title || t("player.noSongSelected")}</p>
            <p className="truncate text-xs text-zinc-400">{artist}</p>
            {uiError && <p className="truncate text-xs text-amber-400">{uiError}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button disabled={!hasTrack} onClick={toggle} type="button" className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40">
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <div className="flex w-full max-w-2xl items-center gap-3">
            <span className="w-10 text-right text-xs text-zinc-500">{formatTime(currentTime)}</span>
            <Slider value={currentTime} max={duration || 0} onChange={seek} disabled={!hasTrack} />
            <span className="w-10 text-xs text-zinc-500">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <button type="button" onClick={() => setVolume(volume > 0 ? 0 : 0.5)} className="text-zinc-400 hover:text-white">
            ♫
          </button>
          <div className="w-28">
            <Slider value={volume} max={1} onChange={(e) => setVolume(Number(e.target.value))} disabled={!hasTrack} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;