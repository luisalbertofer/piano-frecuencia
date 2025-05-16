import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PianoPage from './pages/PianoPage';
import ComparadorPage from './pages/ComparadorPage';
import JuegoRangoPage from './pages/JuegoRangoPage';
import Navbar from './components/Navbar';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PianoPage />} />
        <Route path="/comparador" element={<ComparadorPage />} />
        <Route path="/juego-rango" element={<JuegoRangoPage />} />
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
