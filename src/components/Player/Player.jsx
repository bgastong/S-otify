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

// Iconos de volumen con mejor accesibilidad
const VolumeHigh = () => (
    <svg 
        role="img" 
        aria-hidden="false" 
        aria-label="Volumen alto" 
        height="16" 
        width="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-white/70 hover:text-white"
    >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
);

const VolumeMedium = () => (
    <svg 
        role="img" 
        aria-hidden="false" 
        aria-label="Volumen medio" 
        height="16" 
        width="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-white/70 hover:text-white"
    >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
);

const VolumeMute = () => (
    <svg 
        role="img" 
        aria-hidden="false" 
        aria-label="Silenciado" 
        height="16" 
        width="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-white/70 hover:text-white"
    >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
);

// Slider minimalista estilo YouTube Music - barra finita con thumb cuadrado
function YTSlider({ value, max, onChange, disabled, isVolume = false }) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const isProgress = !isVolume;
    
    return (
        <div className="relative group w-full" style={{ height: '5px' }}>
            {/* Track - 4px */}
            <div 
                className="absolute w-full"
                style={{ 
                    height: '4px', 
                    top: '0.5px',
                    backgroundColor: isProgress ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                }}
            />
            
            {/* Progress - 4px */}
            <div 
                style={{ 
                    width: `${percentage}%`, 
                    height: '4px',
                    top: '0.5px',
                    backgroundColor: '#fff'
                }}
                className="absolute"
            />
            
            {/* Thumb - 4x4 */}
            {!disabled && (
                <div 
                    style={{ 
                        left: `${percentage}%`,
                        width: '4px', 
                        height: '4px',
                        top: '0.5px',
                        borderRadius: '0px',
                        backgroundColor: '#fff'
                    }}
                    className="absolute"
                />
            )}
            
            {/* Input - sin estilos de browser */}
            <input
                type="range"
                min="0"
                max={max}
                step={max <= 1 ? 0.01 : 1}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="absolute w-full cursor-pointer"
                style={{ 
                    height: '5px', 
                    opacity: 0,
                    margin: 0,
                    padding: 0,
                    background: 'transparent'
                }}
            />
        </div>
    );
}

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
    
    return (
        <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col gap-1 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-xl border-t border-white/5 px-4 py-3 text-white">
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

            {/* Fila principal: Info + Controls | Progress | Volume */}
            <div className="flex items-center gap-4">
                {/* Info + Controls - izquierda */}
                <div className="flex items-center gap-3">
                    {/* Play button - primero */}
                    <button
                        disabled={!hasTrack}
                        onClick={handlePlayPause}
                        className="rounded-full bg-green-500 p-2.5 text-black transition-all hover:scale-105 hover:bg-green-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isPlaying ? <Pause /> : <Play />}
                    </button>

                    {/* Info canción */}
                    <div className="flex min-w-0 flex-col">
                        <p className={`truncate text-sm font-semibold ${!title ? 'text-zinc-500' : 'text-zinc-100'}`}>
                            {title || t("player.noSongSelected")}
                        </p>
                        <p className="truncate text-xs text-zinc-500">{artist}</p>
                    </div>
                </div>

                {/* Progress bar - centro */}
                <div className="hidden md:flex flex-1 items-center gap-2">
                    <span className="w-8 text-xs text-white/50 tabular-nums select-none shrink-0">{formatTime(currentTime)}</span>
                    <YTSlider
                        value={currentTime}
                        max={duration || 0}
                        onChange={handleSeek}
                        disabled={!hasTrack}
                    />
                    <span className="w-8 text-right text-xs text-white/50 tabular-nums select-none shrink-0">{formatTime(duration)}</span>
                </div>

                {/* Volume - derecha */}
                <div className="hidden items-center justify-end gap-2 md:flex">
                    {/* Icono de volumen con accesibilidad */}
                    <button 
                        onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                        className="flex items-center justify-center p-1 rounded hover:bg-white/10 transition-colors shrink-0"
                        aria-label={volume === 0 ? "Activar sonido" : "Silenciar"}
                    >
                        {volume === 0 ? (
                            <VolumeMute />
                        ) : volume < 0.5 ? (
                            <VolumeMedium />
                        ) : (
                            <VolumeHigh />
                        )}
                    </button>
                    <div className="w-20">
                        <YTSlider
                            value={volume}
                            max={1}
                            onChange={handleVolume}
                            disabled={!hasTrack}
                            isVolume={true}
                        />
                    </div>
                </div>
            </div>

            {/* Progress bar - solo mobile */}
            <div className="flex md:hidden items-center gap-2">
                <span className="w-8 text-xs text-white/50 tabular-nums select-none shrink-0">{formatTime(currentTime)}</span>
                <YTSlider
                    value={currentTime}
                    max={duration || 0}
                    onChange={handleSeek}
                    disabled={!hasTrack}
                />
                <span className="w-8 text-right text-xs text-white/50 tabular-nums select-none shrink-0">{formatTime(duration)}</span>
            </div>

            {uiError && <p className="text-xs text-amber-400">{uiError}</p>}
        </div>
    );
}

export default Player;