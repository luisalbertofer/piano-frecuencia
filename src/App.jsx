import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PianoPage from './pages/PianoPage';
import ComparadorPage from './pages/ComparadorPage';
import JuegoRangoPage from './pages/JuegoRangoPage';
import RhythmGamePage from './pages/RhythmGamePage';
import InstrumentRecognitionPage from './pages/InstrumentRecognitionPage';
import PianoRealPage from './pages/PianoRealPage';
import Navbar from './components/Navbar';
import MainMenuPage from './pages/MainMenuPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainMenuPage />} />
        <Route path="/piano" element={<PianoPage />} />
        <Route path="/comparador" element={<ComparadorPage />} />
        <Route path="/juego-rango" element={<JuegoRangoPage />} />
        <Route path="/juego-ritmo" element={<RhythmGamePage />} />
        <Route path="/reconocimiento-instrumento" element={<InstrumentRecognitionPage />} />
        <Route path="/piano-real" element={<PianoRealPage />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <AnimatedRoutes />
    </>
  );
}

export default App;
