import { useRef, useState } from "react";

const Pause = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.7 1.3A.7.7 0 0 1 3.4 2v12a.7.7 0 0 1-1.4 0V2a.7.7 0 0 1 .7-.7Zm9.9 0a.7.7 0 0 1 .7.7v12a.7.7 0 0 1-1.4 0V2a.7.7 0 0 1 .7-.7Z"></path>
    </svg>
);

const Play = () => (
    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 1.7a.7.7 0 0 1 1.05-.6l10 6.3a.7.7 0 0 1 0 1.2l-10 6.3A.7.7 0 0 1 3 14.3V1.7Z"></path>
    </svg>
);
    function Player ({
        audio = "",
        title = "Sin ninguna cancion seleccionada",
        artist = "",
    }){

        const [duration, setDuration] = useState(0);
        const [currentTime, setCurrentTime] = useState(0);
        const [volume, setVolume] = useState(1);

        const handleTimeUpdate = () => {
            setCurrentTime(audioRef.current.currentTime);
        };


        const handleLoaded = () => {
            setDuration(audioRef.current.duration);
            audioRef.current.volume = volume;
        };

        const handleSeek = (e) => {
            const time = Number(e.target.value);
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        };

        const handleVolume = (e) => {
            const newVolume = Number(e.target.value);
            setVolume(newVolume);
            audioRef.current.volume = newVolume;
        };

        const formatTime = (time) => {
            if (!time) return "0:00";

            const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");

            return `${minutes}:${seconds}`;
        };

        const audioRef = useRef(null);
        const [isPlaying, setIsPlaying] = useState(false);       
        
        
        const hasAudio = Boolean(audio);

        const playPause = () => {
            if(!hasAudio) return;

            if(isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        };
        return( 
            <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col gap-1 bg-black px-4 py-2 text-white">
                <div className="grid h-12 w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="min-w-0 self-end flex flex-col justify-center pb-1">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-gray-400">{artist}</p>
                </div>
                <div className="flex self-center justify-center">
                    <button
                        disabled={!hasAudio}
                        onClick={playPause}
                        className="rounded-full bg-white p-2.5 text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                    {isPlaying ? <Pause /> : <Play />}
                    </button>
                </div>
                <div className="flex self-end items-center justify-end gap-2 pb-1">
                <span className="text-xs text-gray-400">Vol</span>
                    <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                    className="w-24 cursor-pointer accent-green-500"
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
                        className="h-1 flex-1 cursor-pointer accent-green-500"
                    />
                    <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                </div>
                <audio
                    ref={audioRef}
                    src={audio}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoaded}
                    onEnded={() => setIsPlaying(false)}
                />
            </div>
        );
    }


    export default Player;