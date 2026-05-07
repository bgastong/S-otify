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

const YT_API_URL = "https://www.youtube.com/iframe_api";
let ytApiPromise;

function loadYouTubeApi() {
    if (window.YT?.Player) {
    return Promise.resolve(window.YT);
    }

    if (ytApiPromise) {
    return ytApiPromise;
    }

    ytApiPromise = new Promise((resolve, reject) => {
    const prevReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        resolve(window.YT);
    };

    const existingScript = document.querySelector(`script[src="${YT_API_URL}"]`);
    if (existingScript) {
        return;
    }

    const script = document.createElement("script");
    script.src = YT_API_URL;
    script.async = true;
    script.onerror = () => reject(new Error("YouTube API Error"));
    document.body.appendChild(script);
    });

    return ytApiPromise;
}

function formatTime(time) {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function Player({
    audioUrl = "",
    youtubeId = "",
    title = "",
    artist = "",
    notice = "",
    playRequestId = 0,
}) {
    const { t } = useTranslation();
    const audioRef = useRef(null);
    const ytContainerRef = useRef(null);
    const ytPlayerRef = useRef(null);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [playerError, setPlayerError] = useState("");
    const [errorSourceKey, setErrorSourceKey] = useState("");
    const [audioFailedSourceKey, setAudioFailedSourceKey] = useState("");

    const sourceKey = `${audioUrl}|${youtubeId}`;
    const useAudio = Boolean(audioUrl) && audioFailedSourceKey !== sourceKey;
    const hasTrack = useAudio ? Boolean(audioUrl) : Boolean(youtubeId);

    useEffect(() => {
        setPlayerError("");
        setDuration(0);
        setCurrentTime(0);
        setIsPlaying(false);
    }, [sourceKey]);

    useEffect(() => {
    let mounted = true;

    loadYouTubeApi()
        .then(() => {
        if (!mounted || ytPlayerRef.current || !ytContainerRef.current) {
        return;
        }

        ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
                height: "200",
                width: "200",
                videoId: "",
                playerVars: {
                autoplay: 0,
                controls: 0,
                rel: 0,
                playsinline: 1,
                origin: window.location.origin,
            },
            events: {
            onReady: () => {
                if (mounted) setIsReady(true);
            },
            onStateChange: (event) => {
                const states = window.YT.PlayerState;
                if (event.data === states.PLAYING) setIsPlaying(true);
                if (event.data === states.PAUSED) setIsPlaying(false);
                if (event.data === states.ENDED) {
                setIsPlaying(false);
                setCurrentTime(0);
                }
            },
            onError: () => {
                setPlayerError(t('player.videoUnavailable'));
                setErrorSourceKey(sourceKey);
                setIsPlaying(false);
            },
        },
        });
    })
    .catch(() => {
        setIsReady(false);
    });

    return () => {
        mounted = false;
    };
}, [sourceKey]);

    useEffect(() => {
    if (useAudio) {
        ytPlayerRef.current?.stopVideo?.();
        return;
    }

    if (!isReady || !ytPlayerRef.current) {
        return;
    }

    if (!youtubeId) {
        ytPlayerRef.current.stopVideo();
        return;
    }

    ytPlayerRef.current.cueVideoById(youtubeId);
    }, [useAudio, youtubeId, isReady, sourceKey]);

    useEffect(() => {
    if (useAudio && audioRef.current) {
        audioRef.current.volume = volume;
        return;
    }

    if (!useAudio && isReady && ytPlayerRef.current) {
      ytPlayerRef.current.setVolume(volume * 100);
    }
    }, [volume, useAudio, isReady]);

    useEffect(() => {
    if (useAudio || !isReady || !ytPlayerRef.current || !youtubeId) {
        return;
    }

    const timer = setInterval(() => {
        const player = ytPlayerRef.current;
        if (!player?.getCurrentTime || !player?.getDuration) {
        return;
    }

        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
    }, 500);

    return () => clearInterval(timer);
    }, [useAudio, isReady, youtubeId]);

    useEffect(() => {
    if (!playRequestId || !hasTrack) {
        return;
    }

    if (useAudio && audioRef.current) {
        audioRef.current.play().catch(() => {
        setAudioFailedSourceKey(sourceKey);
        setPlayerError(t('player.audioLoadError'));
        setErrorSourceKey(sourceKey);
        });
        return;
    }

    if (!useAudio && isReady && ytPlayerRef.current && !playerError) {
        ytPlayerRef.current.playVideo();
    }
    }, [playRequestId, hasTrack, useAudio, isReady, sourceKey]);

    useEffect(() => {
    return () => {
        ytPlayerRef.current?.destroy?.();
    };
    }, []);

    const handlePlayPause = () => {
    if (!hasTrack) {
        return;
    }

    if (useAudio && audioRef.current) {
        if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
        }

        audioRef.current.play().catch(() => {
        setAudioFailedSourceKey(sourceKey);
        setPlayerError(t('player.audioLoadError'));
        setErrorSourceKey(sourceKey);
        });
        return;
    }

    if (!ytPlayerRef.current) {
        return;
    }

    if (playerError) {
        const query = `${title} ${artist}`.trim();
        const fallbackUrl = query
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        : `https://www.youtube.com/watch?v=${youtubeId}`;
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
        return;
    }

    if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
    } else {
        ytPlayerRef.current.playVideo();
    }
    };

    const handleSeek = (event) => {
    if (!hasTrack) {
        return;
    }

    const time = Number(event.target.value);

    if (useAudio && audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
        return;
    }

    ytPlayerRef.current?.seekTo?.(time, true);
    setCurrentTime(time);
    };

    const uiError = (errorSourceKey === sourceKey ? playerError : "") || notice;

    return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col gap-1 bg-black px-4 py-2 text-white">
        <audio
        ref={audioRef}
        src={useAudio ? audioUrl : ""}
        onLoadedMetadata={() => {
            if (!audioRef.current) return;
            setDuration(audioRef.current.duration || 0);
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
            setAudioFailedSourceKey(sourceKey);
            setPlayerError(t('player.audioLoadError'));
            setErrorSourceKey(sourceKey);
            setIsPlaying(false);
        }}
        className="hidden"
        preload="metadata"
        />

        <div
        ref={ytContainerRef}
        className="pointer-events-none absolute left-[-9999px] top-0 h-[200px] w-[200px] opacity-0"
        />

        <div className="grid h-12 w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="min-w-0 self-end flex flex-col justify-center pb-1">
            <p className="text-sm font-semibold">{title || t('player.noSongSelected')}</p>
            <p className="text-xs text-gray-400">{artist}</p>
        </div>

        <div className="flex self-center justify-center">
            <button
            disabled={!hasTrack || (!useAudio && !isReady)}
            onClick={handlePlayPause}
            className="rounded-full bg-white p-2.5 text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
            {isPlaying ? <Pause /> : <Play />}
            </button>
        </div>

        <div className="flex self-end items-center justify-end gap-2 pb-1 hidden md:flex">
            <span className="text-xs text-gray-400">{t('player.volume')}</span>
            <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-24 cursor-pointer accent-white"
            style={{ height: '2px' }}
            />
        </div>
        </div>

        <div className="mx-auto flex w-[65%] items-center gap-2">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={!hasTrack || (!useAudio && !isReady)}
            className="h-1 flex-1 cursor-pointer accent-green-500 disabled:cursor-not-allowed disabled:opacity-40"
        />
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>

        {uiError && (
        <p className="mx-auto w-[65%] text-xs text-amber-300">
            {uiError}{playerError && !useAudio ? ` ${t('player.tryYoutubeFallback')}` : ""}
        </p>
        )}
    </div>
    );
}

export default Player;
