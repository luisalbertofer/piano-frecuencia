// App.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Importaciones normales (no perezosas)
import PianoPage from './pages/PianoPage';
import ComparadorPage from './pages/ComparadorPage';
import JuegoRangoPage from './pages/JuegoRangoPage';
import RhythmGamePage from './pages/RhythmGamePage';
import InstrumentRecognitionPage from './pages/InstrumentRecognitionPage';
import MainMenuPage from './pages/MainMenuPage';

// Importación perezosa SOLO para la página pesada
const PianoRealPage = lazy(() => import('./pages/PianoRealPage'));

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
        <Route
          path="/piano-real"
          element={
            <Suspense fallback={<div className="text-center mt-10">Cargando piano real...</div>}>
              <PianoRealPage />
            </Suspense>
          }
        />
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
