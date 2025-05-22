import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import piano from "../data/piano-full";
import { notesReal } from "../data/notesReal";
import PianoRealVirtual from "../components/PianoRealVirtual";
import InstrumentSelector from "../components/InstrumentSelector";
import Layout from "../components/Layout";

const PianoRealPage = () => {
  const [sampler, setSampler] = useState(null);
  const [ready, setReady] = useState(false);
  const [samplerReady, setSamplerReady] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [instrumento, setInstrumento] = useState("piano");

  const instrumentosDisponibles = [
    "piano",
    "violin",
    "flute",
    "trumpet",
    "cello",
    "organ",
    "guitar-electric",
    "guitar-acoustic",
    "saxophone",
    // añade más según tus carpetas
    ];

  // Activar AudioContext
  useEffect(() => {
    const handleStart = async () => {
      await Tone.start();
      console.log("✅ AudioContext iniciado.");
      setReady(true);
      document.removeEventListener("click", handleStart);
    };
    document.addEventListener("click", handleStart);
    return () => document.removeEventListener("click", handleStart);
  }, []);

  // Cargar sampler al estar listo
  useEffect(() => {
    if (!ready) return;
    console.log("🎹 Cargando sampler...");

    const s = new Tone.Sampler({
      urls: piano,
      baseUrl: "public/samples/audio/piano/",
      onload: () => {
        console.log("✅ Sampler cargado.");
        setSampler(s);
        setSamplerReady(true);
      },
    }).toDestination();
  }, [ready]);

  // ✅ Aquí debe ir la función antes del return
  const playNote = (note, freq) => {
    if (!sampler || !samplerReady) return;
    sampler.triggerAttackRelease(note, "1n");
    setCurrentNote({ note, freq });
  };

  return (
    <Layout>
        <div className="min-h-screen bg-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">🎹 Piano Real (Muestras)</h1>

        {!ready && (
            <p className="text-orange-600">Haz clic en cualquier parte para activar el audio.</p>
        )}

        {ready && !samplerReady && (
            <p className="text-blue-600">🎧 Cargando muestras de piano real...</p>
        )}

        <InstrumentSelector
            instrumentos={instrumentosDisponibles}
            instrumentoActual={instrumento}
            setInstrumentoActual={setInstrumento}
            />

        {ready && samplerReady && (
            <PianoRealVirtual
            notes={notesReal}
            playNote={playNote}
            currentNote={currentNote}
            />
        )}
        </div>
    </Layout>
  );
};

export default PianoRealPage;
