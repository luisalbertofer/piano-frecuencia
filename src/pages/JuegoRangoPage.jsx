import React, { useState, useEffect } from "react";
import JuegoRango from "../components/JuegoRango";
import { notes } from "../data/notes";
import * as Tone from "tone";
import Layout from "../components/Layout";

function JuegoRangoPage() {
  const [synth, setSynth] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const [dificultad, setDificultad] = useState("facil");

  useEffect(() => {
    const handleStart = async () => {
      await Tone.start();
      setSynth(new Tone.Synth().toDestination());
      setAudioReady(true);
      document.removeEventListener("click", handleStart);
      document.removeEventListener("touchstart", handleStart);
    };

    document.addEventListener("click", handleStart);
    document.addEventListener("touchstart", handleStart);

    return () => {
      document.removeEventListener("click", handleStart);
      document.removeEventListener("touchstart", handleStart);
    };
  }, []);

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
            <div className="mb-6">
              <label className="mr-2 font-medium text-lg">Dificultad:</label>
              <select
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="facil">Fácil</option>
                <option value="media">Media</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <JuegoRango synth={synth} notes={notes} dificultad={dificultad} />
          </>
        )}
      </div>
    </Layout>
  );
}

export default JuegoRangoPage;