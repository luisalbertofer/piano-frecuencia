import React, { useState, useEffect } from "react";
import JuegoRango from "../components/JuegoRango";
import TimbreSelector from "../components/TimbreSelector";
import { notes } from "../data/notes";
import * as Tone from "tone";
import Layout from "../components/Layout";

function JuegoRangoPage() {
  const [synth, setSynth] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const [dificultad, setDificultad] = useState("facil");
  const [timbre, setTimbre] = useState("sine");
  const [volume, setVolume] = useState(0);

  // Iniciar AudioContext con primer evento de usuario
  useEffect(() => {
    const handleFirstInteraction = async () => {
      await Tone.start();
      setAudioReady(true);
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

  // Crear synth apenas el audio esté listo
  useEffect(() => {
    if (!audioReady) return;

    const newSynth = new Tone.Synth().toDestination();
    newSynth.volume.value = volume;
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, [audioReady]);

  // Actualizar timbre cuando cambie
  useEffect(() => {
    if (!synth || !audioReady) return;
    synth.oscillator.type = timbre;
  }, [timbre]);

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (!synth || !audioReady) return;
    synth.volume.value = volume;
  }, [volume]);

  return (
    <Layout>
      <div className="min-h-screen bg-white text-gray-800 font-sans p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">🎯 Adivina el Rango Auditivo</h1>

        {!audioReady && (
          <p className="text-orange-500 text-lg mb-6">
            Pulsa en cualquier parte de la pantalla para activar el audio.
          </p>
        )}

        {audioReady && (
          <>
            <div className="flex flex-col md:flex-row gap-6 mb-6 w-full max-w-2xl px-4">
              {/* Selector de dificultad */}
              <div className="flex-1 bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                <label className="text-lg font-medium text-gray-700 mb-2">Dificultad:</label>
                <select
                  value={dificultad}
                  onChange={(e) => setDificultad(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="facil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>

              {/* TimbreSelector */}
              <div className="flex-1 bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                <label className="text-lg font-medium text-gray-700 mb-2">Timbre:</label>
                <TimbreSelector 
                  timbre={timbre} 
                  setTimbre={setTimbre} 
                  volume={volume} 
                  setVolume={setVolume} 
                  disabled={!audioReady}
                />
              </div>
            </div>

            <JuegoRango synth={synth} notes={notes} dificultad={dificultad} />
          </>
        )}
      </div>
    </Layout>
  );
}

export default JuegoRangoPage;