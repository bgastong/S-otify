import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LayoutShell from "./components/LayoutShell/LayoutShell.jsx";
import Player from "./components/Player.jsx";
import { songsService } from "./services/songsService";
import { isYouTubeEmbeddable } from "./utils/youtubeValidation";

function App() {
  const { t } = useTranslation();
  const [selectedSong, setSelectedSong] = useState(null);
  const [playerNotice, setPlayerNotice] = useState("");
  const [playRequestId, setPlayRequestId] = useState(0);
  const requestIdRef = useRef(0);

  const findEmbeddableAlternative = useCallback(async (song) => {
    if (!song?.artist) {
      return null;
    }

    const relatedSongs = await songsService.getSongsByArtist({
      artist: song.artist,
      page: 1,
      limit: 30,
    });

    for (const candidate of relatedSongs) {
      if (candidate.id === song.id) {
        continue;
      }

      if (candidate.audioUrl) {
        return candidate;
      }

      const embeddable = await isYouTubeEmbeddable(candidate.youtubeId);
      if (embeddable) {
        return candidate;
      }
    }

    return null;
  }, []);

  const handleSelectSong = useCallback(async (song, options = {}) => {
    if (!song) {
      return;
    }

    const shouldAutoplay = Boolean(options.autoplay);

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setSelectedSong(song);
    setPlayerNotice("");
    if (shouldAutoplay) {
      setPlayRequestId((prev) => prev + 1);
    }

    if (song.audioUrl) {
      return;
    }

    const embeddable = await isYouTubeEmbeddable(song.youtubeId);
    if (requestId !== requestIdRef.current) {
      return;
    }

    if (embeddable) {
      return;
    }

    try {
      const alternative = await findEmbeddableAlternative(song);
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (alternative) {
        setSelectedSong(alternative);
        setPlayerNotice(t('app.alternativeSongPlaying', { originalName: song.name, artistName: song.artist }));
        if (shouldAutoplay) {
          setPlayRequestId((prev) => prev + 1);
        }
        return;
      }
    } catch {
      // Si falla la busqueda de alternativa, se mantiene la cancion original.
    }

    setPlayerNotice(t('app.songNotFound', { songName: song.name }));
  }, [findEmbeddableAlternative]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Header />
        <LayoutShell>
          <Routes>
            <Route path="/" element={<Home onSelectSong={handleSelectSong} />} />
            <Route
              path="/details/:id"
              element={<Details onSelectSong={handleSelectSong} />}
            />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </LayoutShell>
        <Player
          audioUrl={selectedSong?.audioUrl || ""}
          youtubeId={selectedSong?.youtubeId || ""}
          title={selectedSong?.name || ""}
          artist={selectedSong?.artist || ""}
          notice={playerNotice}
          playRequestId={playRequestId}
        />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;