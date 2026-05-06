import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LayoutShell from "./components/LayoutShell/LayoutShell.jsx";
import Player from "./components/Player.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Header />
        <LayoutShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </LayoutShell>
        <Player />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;