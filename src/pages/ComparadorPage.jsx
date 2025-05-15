import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ComparadorDeNotas from "../components/ComparadorDeNotas";
import { notes } from "../data/notes";
import * as Tone from "tone";
import { pageVariants } from "../utils/animationVariants";

const ComparadorPage = () => {
  const [synth, setSynth] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

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
    if (!isAudioReady) return;
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);
  }, [isAudioReady]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-4">🎧 Juego: Comparador de Notas</h1>

      {!isAudioReady && (
        <div className="text-orange-600 text-lg mb-6 text-center">
          Haz clic en cualquier parte para activar el audio.
        </div>
      )}

      {synth && isAudioReady && (
        <ComparadorDeNotas notes={notes} synth={synth} />
      )}

      <Link to="/" className="mt-8 text-blue-600 hover:underline">
        ← Volver al piano
      </Link>
    </Layout>
  );
};

export default ComparadorPage;
