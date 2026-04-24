import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Details from './pages/Details';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto p-8">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-white/60">
                <h2 className="text-3xl mb-2">🎵 Catálogo de canciones</h2>
              </div>
            } />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/favorites" element={
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-white/60">
                <h2 className="text-3xl mb-2">❤️ Tus favoritos</h2>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;