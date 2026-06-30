import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LayoutShell from "./components/LayoutShell/LayoutShell.jsx";
import Player from "./components/Player/Player.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [playerNotice, setPlayerNotice] = useState("");
  const [playRequestId, setPlayRequestId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentGenre, setCurrentGenre] = useState("");

  const handleFilterChange = useCallback((genre) => {
    setCurrentGenre(genre);
  }, []);

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
      <div className="min-h-screen bg-black text-white">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentGenre={currentGenre}
          onFilterChange={handleFilterChange}
        />

        <LayoutShell selectedSong={selectedSong}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onSelectSong={handleSelectSong}
                  searchTerm={searchTerm}
                  currentGenre={currentGenre}
                />
              }
            />

            <Route
              path="/details/:id"
              element={<Details onSelectSong={handleSelectSong} />}
            />

            <Route
              path="/favorites"
              element={<Favorites onSelectSong={handleSelectSong} />}
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>

          <Footer />
        </LayoutShell>

        <Player
          audioUrl={selectedSong?.audioUrl || ""}
          title={selectedSong?.name || ""}
          artist={selectedSong?.artist || ""}
          image={selectedSong?.image || ""}
          notice={playerNotice}
          playRequestId={playRequestId}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;