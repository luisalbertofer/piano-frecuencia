import React, { useState, useEffect } from "react";
import PianoVirtual from "./PianoVirtual";
import * as Tone from "tone";
import { notes } from "./notes";
import VisualizadorOnda from "./VisualizadorOnda";
import VisualizadorFFT from "./VisualizadorFFT";
import VisualizadorEspectrograma from "./VisualizadorEspectrograma";
import { motion, AnimatePresence } from "framer-motion";
import { clasificarFrecuencia, getColor } from "./utils/audioUtils";
// import ComparadorDeNotas from "./ComparadorDeNotas";

function App() {
  const [currentNote, setCurrentNote] = useState(null);
  const [synth, setSynth] = useState(null);
  const [timbre, setTimbre] = useState("sine");
  const [volume, setVolume] = useState(0);        // in dB, Tone.Synth.volume.value
  const [duration, setDuration] = useState("0.5"); // in seconds
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const [activeTab, setActiveTab] = useState("onda");


  useEffect(() => {
    if (!isAudioReady) return;
    const initializeSynth = async () => {
      const fft = new Tone.Analyser("fft", 512);
      const waveform = new Tone.Analyser("waveform", 1024);
      const newSynth = new Tone.Synth({ oscillator: { type: timbre } });
      newSynth.volume.value = volume; // Set initial volume
      newSynth.connect(waveform);
      newSynth.connect(fft);
      waveform.toDestination();
      setSynth(newSynth);
      setAnalyser({ waveform, fft });
    };
    initializeSynth();
  }, [isAudioReady, timbre]);

  useEffect(() => {
    const handleFirstInteraction = async () => {
      await Tone.start();
      setIsAudioReady(true);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!synth || !isAudioReady) return;
    synth.oscillator.type = timbre;
    synth.volume.value = volume;
  }, [timbre, synth, isAudioReady]);

  const playNote = (note, freq) => {
    if (!synth || !isAudioReady) return;
    synth.triggerAttackRelease(note, duration); 
    const rango = clasificarFrecuencia(freq);
    setCurrentNote({ note, freq, rango });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🎹 Piano Frecuencia Visual</h1>

      {!isAudioReady && (
        <div className="text-orange-600 text-lg mb-6">
          Por favor, haz clic en cualquier parte para activar el sonido.
        </div>
      )}

      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="timbre" className="text-lg font-medium">Timbre:</label>
        <select
          id="timbre"
          value={timbre}
          onChange={(e) => setTimbre(e.target.value)}
          disabled={!isAudioReady}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="sine">Sinusoidal</option>
          <option value="square">Cuadrada</option>
          <option value="triangle">Triangular</option>
          <option value="sawtooth">Diente de sierra</option>
        </select>
      </div>

      <div className="w-full max-w-sm mb-4">
        <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
          Volumen: <span className="font-bold">{volume} dB</span>
        </label>
        <input
          id="volume"
          type="range"
          min="-60"
          max="0"
          step="1"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          disabled={!isAudioReady}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div className="w-full max-w-sm mb-4">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
          Duración: <span className="font-bold">{parseFloat(duration).toFixed(1)}s</span>
        </label>
        <input
          id="duration"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          disabled={!isAudioReady}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
      <PianoVirtual notes={notes} playNote={playNote} currentNote={currentNote} />

      <div className="mt-6 text-lg text-center">
        {currentNote ? (
          <>
            <p>🎵 Nota: <strong>{currentNote.note}</strong></p>
            <p>🎛️ Frecuencia: <strong>{currentNote.freq.toFixed(2)} Hz</strong></p>
            <p>
              🔊 Rango: <strong className={`${getColor(currentNote.rango)} capitalize`}>
                {currentNote.rango}
              </strong>
            </p>
          </>
        ) : (
          <p className="text-gray-500">Haz clic en una tecla para empezar</p>
        )}
      </div>
      <div className="mt-10 w-full max-w-2xl">
        {/* Pestañas */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "onda" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("onda")}
          >
            Onda
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "fft" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("fft")}
          >
            FFT
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "espectrograma" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("espectrograma")}
          >
            Espectrograma
          </button>
        </div>

        {/* Contenido animado */}
        <AnimatePresence mode="wait">
          {activeTab === "onda" && analyser?.waveform && (
            <motion.div
              key="onda"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">Visualizador de Onda</h3>
              <VisualizadorOnda analyser={analyser.waveform} />
            </motion.div>
          )}

          {activeTab === "fft" && analyser?.fft && (
            <motion.div
              key="fft"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">Visualizador FFT</h3>
              <VisualizadorFFT analyser={analyser.fft} currentNote={currentNote} />
            </motion.div>
          )}

          {activeTab === "espectrograma" && analyser?.fft && (
            <motion.div
              key="espectrograma"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">Espectrograma</h3>
              <VisualizadorEspectrograma analyser={analyser.fft} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
