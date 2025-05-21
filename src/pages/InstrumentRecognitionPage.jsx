import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InstrumentRecognitionGame from "../components/InstrumentRecognitionGame";
import * as Tone from "tone";

const InstrumentRecognitionPage = () => {
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
        <h1 className="text-3xl font-bold mb-4">🎹 Reconoce el Instrumento</h1>

        {!audioReady && (
          <p className="text-orange-500 text-lg mb-6 text-center">
            Pulsa en cualquier parte para activar el audio.
          </p>
        )}

        {audioReady && <InstrumentRecognitionGame />}
      </div>
    </Layout>
  );
};

export default InstrumentRecognitionPage;