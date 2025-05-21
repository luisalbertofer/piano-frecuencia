import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import RhythmRecognitionGame from "../components/RhythmRecognitionGame";
import TimbreSelector from "../components/TimbreSelector";
import * as Tone from "tone";

const RhythmRecognitionPage = () => {
  const [audioReady, setAudioReady] = useState(false);

  // Iniciar AudioContext al primer clic/touch
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

  return (
    <Layout>
      <div className="min-h-screen bg-white text-gray-800 font-sans p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">🥁 Ritmo Auditivo</h1>

        {!audioReady && (
          <p className="text-orange-500 text-lg mb-6 text-center">
            Pulsa en cualquier parte de la pantalla para activar el audio.
          </p>
        )}

        {audioReady && (
          <RhythmRecognitionGame />
        )}
      </div>
    </Layout>
  );
};

export default RhythmRecognitionPage;