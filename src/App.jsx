import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import LayoutShell from "./components/LayoutShell/LayoutShell.jsx";

function App() {
  return (
    <BrowserRouter>
      <LayoutShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </LayoutShell>
    </BrowserRouter>
  );
}

export default App;