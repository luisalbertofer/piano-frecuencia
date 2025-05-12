import React, { useState, useEffect } from "react";
import PianoVirtual from "./PianoVirtual";
import * as Tone from "tone";
import { notes } from "./notes";
import VisualizadorOnda from "./VisualizadorOnda";
import VisualizadorFFT from "./VisualizadorFFT";
// import ComparadorDeNotas from "./ComparadorDeNotas";

function App() {
  const [currentNote, setCurrentNote] = useState(null);
  const [synth, setSynth] = useState(null);
  const [timbre, setTimbre] = useState("sine");
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [analyser, setAnalyser] = useState(null);

  useEffect(() => {
    if (!isAudioReady) return;
    const initializeSynth = async () => {
      const fft = new Tone.Analyser("fft", 512);
      const waveform = new Tone.Analyser("waveform", 1024);
      const newSynth = new Tone.Synth({ oscillator: { type: timbre } });
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
  }, [timbre, synth, isAudioReady]);

  const playNote = (note, freq) => {
    if (!synth || !isAudioReady) return;
    synth.triggerAttackRelease(note, "0.5");
    const rango = clasificarFrecuencia(freq);
    setCurrentNote({ note, freq, rango });
  };

  const clasificarFrecuencia = (freq) => {
    if (freq <= 125) return "muy grave";
    if (freq <= 250) return "grave";
    if (freq <= 500) return "medio-bajo";
    if (freq <= 2000) return "medio-alto";
    if (freq <= 4000) return "agudo";
    if (freq <= 8000) return "muy agudo";
    return "ultra-agudo";
  };

  const getColor = (rango) => {
    switch (rango) {
      case "muy grave": return "text-gray-700";
      case "grave": return "text-green-600";
      case "medio-bajo": return "text-yellow-600";
      case "medio-alto": return "text-orange-600";
      case "agudo": return "text-red-500";
      case "muy agudo": return "text-purple-500";
      case "ultra-agudo": return "text-blue-600";
      default: return "text-black";
    }
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

      <div className="mt-10 w-full flex flex-col items-center gap-8">
        {analyser?.waveform && (
          <div className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">Visualizador de Onda</h3>
            <VisualizadorOnda analyser={analyser.waveform} />
          </div>
        )}

        {analyser?.fft && (
          <div className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">Visualizador FFT</h3>
            <VisualizadorFFT analyser={analyser.fft} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
