import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LayoutShell from "./components/LayoutShell/LayoutShell.jsx";
import Player from "./components/Player/Player.jsx";

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [playerNotice, setPlayerNotice] = useState("");
  const [playRequestId, setPlayRequestId] = useState(0);

  const handleSelectSong = useCallback((song, options = {}) => {
    if (!song) return;

    setSelectedSong(song);
    setPlayerNotice("");

    if (!song.audioUrl) {
      setPlayerNotice(`La canción "${song.name}" no tiene audio disponible.`);
    }

    if (options.autoplay) {
      setPlayRequestId((prev) => prev + 1);
    }
  }, []);

  return (
    <BrowserRouter>
      <div 
        className="min-h-screen flex flex-col text-white overflow-x-hidden relative"
        style={{
          backgroundColor: '#000000',
          backgroundImage: `
            radial-gradient(circle at top left, rgba(10, 35, 10, 0.7) 0%, transparent 45%),
            radial-gradient(circle at top right, rgba(10, 35, 10, 0.7) 0%, transparent 45%),
            linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 100%)
            `,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
}}
      >
        <Header />
        <main className="grow pt-28 md:pt-32 pb-36">
          <LayoutShell>
            <Routes>
              <Route path="/" element={<Home onSelectSong={handleSelectSong} />} />
              <Route path="/details/:id" element={<Details onSelectSong={handleSelectSong} />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </LayoutShell>
        </main>

        <Player
          audioUrl={selectedSong?.audioUrl || ""}
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