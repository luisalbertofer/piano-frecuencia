import React, { useState, useEffect } from "react";
import PianoVirtual from "./PianoVirtual";
import * as Tone from "tone";
import { notes } from "./notes";
import VisualizadorOnda from "./VisualizadorOnda";
import VisualizadorFFT from "./VisualizadorFFT";

function App() {
  const [currentNote, setCurrentNote] = useState(null);
  const [synth, setSynth] = useState(null);
  const [timbre, setTimbre] = useState("sine");
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [analyser, setAnalyser] = useState(null);


  // Inicializa el sintetizador después de la primera interacción del usuario
  useEffect(() => {
    if (!isAudioReady) return;

    const initializeSynth = async () => {
      const fft = new Tone.Analyser("fft", 512); // puedes probar 32, 64, 128...
      const waveform = new Tone.Analyser("waveform", 1024);
      const newSynth = new Tone.Synth({ oscillator: { type: timbre } });

      newSynth.connect(waveform);
      newSynth.connect(fft);
      waveform.connect(Tone.Destination); // solo necesitas uno conectado al output

      setSynth(newSynth);
      setAnalyser({ waveform, fft });
    };

    initializeSynth();
  }, [isAudioReady, timbre]);

  // Escuchar la primera interacción del usuario (click o touchstart)
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

  // Cambiar el tipo de oscilador si cambia el timbre
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
    return "ultra-agudo"; // opcional para frecuencias muy altas
  };

  const getColor = (rango) => {
    switch (rango) {
      case "muy grave":
        return "#5D6D7E"; // gris oscuro
      case "grave":
        return "#2ECC71"; // verde
      case "medio-bajo":
        return "#F1C40F"; // amarillo
      case "medio-alto":
        return "#E67E22"; // naranja
      case "agudo":
        return "#E74C3C"; // rojo
      case "muy agudo":
        return "#9B59B6"; // morado
      case "ultra-agudo":
        return "#3498DB"; // azul brillante
      default:
        return "#000";
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>🎹 Piano Frecuencia Visual</h1>

      {/* Mensaje inicial hasta que el usuario active el audio */}
      {!isAudioReady && (
        <div style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#e67e22" }}>
          <p>Por favor, haz clic en cualquier parte para activar el sonido.</p>
        </div>
      )}

      {/* Selector de timbre */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="timbre" style={{ marginRight: "0.5rem" }}>Selecciona un timbre:</label>
        <select
          id="timbre"
          value={timbre}
          onChange={(e) => setTimbre(e.target.value)}
          disabled={!isAudioReady}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="sine">Sinusoidal</option>
          <option value="square">Cuadrada</option>
          <option value="triangle">Triangular</option>
          <option value="sawtooth">Diente de sierra</option>
        </select>
      </div>

      <PianoVirtual notes={notes} playNote={playNote} currentNote={currentNote} />

      <div style={{ marginTop: "2rem" }}>
        {currentNote ? (
          <div style={{ fontSize: "1.5rem" }}>
            <p>🎵 Nota: <strong>{currentNote.note}</strong></p>
            <p>🎛️ Frecuencia: <strong>{currentNote.freq.toFixed(2)} Hz</strong></p>
            <p>
              🔊 Rango:{" "}
              <strong style={{ color: getColor(currentNote.rango), textTransform: "capitalize" }}>
                {currentNote.rango}
              </strong>
            </p>
          </div>
        ) : (
          <p>Haz clic en una tecla para empezar</p>
        )}
      </div>
      <div style={{ marginTop: "2rem" }}>
        {/* Visualizador de Onda */}
        {analyser && analyser.waveform && (
          <div>
            <h3 style={{ marginBottom: "0.5rem", color: "#2C3E50" }}>Visualizador de Onda</h3>
            <VisualizadorOnda analyser={analyser.waveform} />
          </div>
        )}

        {/* Visualizador FFT */}
        {analyser && analyser.fft && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "0.5rem", color: "#2C3E50" }}>Visualizador FFT</h3>
            <VisualizadorFFT analyser={analyser.fft} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;