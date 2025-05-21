import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ComparadorDeNotas from "../components/ComparadorDeNotas";
import { notes } from "../data/notes";
import * as Tone from "tone";
import TimbreSelector from "../components/TimbreSelector";

const ComparadorPage = () => {
  const [synth, setSynth] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [timbre, setTimbre] = useState("sine");
  const [volume, setVolume] = useState(0);

  // Inicializar AudioContext al primer clic/touch
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

  // Crear un synth básico apenas el audio esté listo
  useEffect(() => {
    if (!isAudioReady) return;

    const initialSynth = new Tone.Synth().toDestination();
    initialSynth.volume.value = volume;
    setSynth(initialSynth);

    return () => {
      initialSynth.dispose();
    };
  }, [isAudioReady]);

  // Actualizar el tipo de oscilador si cambia el timbre
  useEffect(() => {
    if (!synth || !isAudioReady) return;
    synth.oscillator.type = timbre;
  }, [timbre]);

  // Actualizar el volumen si cambia
  useEffect(() => {
    if (!synth || !isAudioReady) return;
    synth.volume.value = volume;
  }, [volume]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-4">🎧 Comparador de Notas</h1>

      {!isAudioReady && (
        <div className="text-orange-600 text-lg mb-6 text-center">
          Haz clic en cualquier parte para activar el audio.
        </div>
      )}

      {synth && isAudioReady && (
        <>
          <div className="mb-6 w-full max-w-md mx-auto">
            <TimbreSelector 
              timbre={timbre} 
              setTimbre={setTimbre} 
              volume={volume} 
              setVolume={setVolume} 
              disabled={!isAudioReady}
            />
          </div>

          <ComparadorDeNotas notes={notes} synth={synth} />
        </>
      )}
    </Layout>
  );
};

export default ComparadorPage;