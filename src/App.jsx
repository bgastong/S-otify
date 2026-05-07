import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LayoutShell from "./components/LayoutShell/LayoutShell.jsx";
import Player from "./components/Player.jsx";

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
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />

        {/* CONTENIDO PRINCIPAL: 
            Aquí aplicamos pt-28 (padding top) para empujar el contenido debajo de la Navbar
            y pb-32 (padding bottom) para que el Player no tape el final de las listas. */}
        <main className="flex-grow pt-28 md:pt-32 pb-36">
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