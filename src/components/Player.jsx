import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Pause = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.7 1.3A.7.7 0 0 1 3.4 2v12a.7.7 0 0 1-1.4 0V2a.7.7 0 0 1 .7-.7Zm9.9 0a.7.7 0 0 1 .7.7v12a.7.7 0 0 1-1.4 0V2a.7.7 0 0 1 .7-.7Z" />
    </svg>
);

const Play = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.7a.7.7 0 0 1 1.05-.6l10 6.3a.7.7 0 0 1 0 1.2l-10 6.3A.7.7 0 0 1 3 14.3V1.7Z" />
    </svg>
);

function formatTime(time) {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

    return `${minutes}:${seconds}`;
}

function Player({
    audioUrl = "",
    title = "",
    artist = "",
    notice = "",
    playRequestId = 0,
}) {
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
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
    }, [volume]);

    useEffect(() => {
    if (!playRequestId || !hasTrack || !audioRef.current) return;

    audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
        setIsPlaying(false);
        setPlayerError(t("player.audioLoadError"));
        });
    }, [playRequestId, hasTrack, t]);

    const handlePlayPause = () => {
    if (!hasTrack || !audioRef.current) return;

    if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
    }

    audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
        setIsPlaying(false);
        setPlayerError(t("player.audioLoadError"));
        });
    };

    const handleSeek = (event) => {
    if (!hasTrack || !audioRef.current) return;

    const time = Number(event.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    };

    const handleVolume = (event) => {
    setVolume(Number(event.target.value));
    };

    const uiError = playerError || notice;

    console.log("Audio actual:", audioUrl);
    
    return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col gap-1 bg-black px-4 py-2 text-white">
        <audio
        ref={audioRef}
        src={audioUrl}
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
        onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
        }}
        onError={() => {
            setIsPlaying(false);
            setPlayerError(t("player.audioLoadError"));
        }}
        className="hidden"
        preload="metadata"
        />

        <div className="grid h-12 w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex min-w-0 flex-col justify-center self-end pb-1">
            <p className="truncate text-sm font-semibold">
            {title || t("player.noSongSelected")}
            </p>
            <p className="truncate text-xs text-gray-400">{artist}</p>
        </div>

        <div className="flex justify-center self-center">
            <button
            disabled={!hasTrack}
            onClick={handlePlayPause}
            className="rounded-full bg-white p-2.5 text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
            {isPlaying ? <Pause /> : <Play />}
            </button>
        </div>

        <div  iv className="hidden items-center justify-end gap-2 self-end pb-1 md:flex">
            <span className="text-xs text-gray-400">{t("player.volume")}</span>
            <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="w-24 cursor-pointer accent-white"
            />
        </div>
        </div>

        <div className="mx-auto flex w-[90%] items-center gap-2 md:w-[65%]">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>

        <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={!hasTrack}
            className="h-1 flex-1 cursor-pointer accent-green-500 disabled:cursor-not-allowed disabled:opacity-40"
        />

        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>

        {uiError && (
        <p className="mx-auto w-[90%] text-xs text-amber-300 md:w-[65%]">
            {uiError}
        </p>
        )}
    </div>
    );
}

export default Player;