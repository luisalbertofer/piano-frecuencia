import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import InstrumentSelector from "./InstrumentSelector";
import PianoRealVirtual from "./PianoRealVirtual";
import { filtrarNotasExistentes } from "../utils/filtrarNotasExistentes";
import { instrumentThemes } from "../data/instrumentColors";
import VisualizadorOnda from "./visualizers/VisualizadorOnda";
import VisualizadorFFT from "./visualizers/VisualizadorFFT";
import { instrumentTranslations } from "../data/instrumentTranslations";

const instrumentosDisponibles = [
  "piano",
  "violin",
  "flute",
  "guitar-acoustic",
  "guitar-electric",
  "guitar-nylon",
  "bass-electric",
  "saxophone",
  "clarinet",
  "organ",
  "harp",
  "trombone",
  "trumpet",
  "tuba",
  "xylophone",
  "cello",
  "contrabass",
  "french-horn",
  "harmonium",
  "bassoon"
];

const InstrumentLoader = () => {
  const [instrumento, setInstrumento] = useState("piano");
  const [sampler, setSampler] = useState(null);
  const [samplerReady, setSamplerReady] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const theme = instrumentThemes[instrumento] || {
    color: "bg-gray-100",
    emoji: "🎼",
    label: instrumento
  };

  // Activar AudioContext
  useEffect(() => {
    const start = async () => {
      await Tone.start();
      setAudioReady(true);
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    };
    document.addEventListener("click", start);
    document.addEventListener("touchstart", start);
    return () => {
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    };
  }, []);

  // Cargar el sampler y las notas al cambiar de instrumento
useEffect(() => {
  if (!audioReady) return;

  const cargarInstrumento = async () => {
    setSamplerReady(false);
    setNotes([]);
    setCurrentNote(null);

    try {
        console.log("Intentando importar: ", `../data/notes_${instrumento}.js`);
      const rutas = await import(`../data/${instrumento}.js`);
      const notas = await import(`../data/notes_${instrumento}.js`);
      const baseUrl = `/piano-frecuencia/samples/audio/${instrumento}/`;  

      const rutasFiltradas = await filtrarNotasExistentes(rutas.default, baseUrl);
      console.log("🎧 Rutas filtradas:", rutasFiltradas);
      console.log("🎹 URLs importadas:", rutas.default);

        const fft = new Tone.Analyser("fft", 512);
        const waveform = new Tone.Analyser("waveform", 1024);

        const s = new Tone.Sampler({
        urls: rutasFiltradas,
        baseUrl: baseUrl,
        onload: () => {
            console.log(`✅ ${instrumento} cargado`);
            setSampler(s);
            setSamplerReady(true);
            setNotes(notas[`notes_${instrumento.replace(/-/g, "_")}`]);
            setAnalyser({ waveform, fft }); // ✅ ahora sí
        },
        });

        // 🔌 Conectamos Sampler a visualizadores y destino
        s.connect(waveform);
        s.connect(fft);
        s.toDestination();

    } catch (error) {
      console.error("❌ Error al cargar instrumento:", error);
    }
  };

  cargarInstrumento();
}, [instrumento, audioReady]);


  const playNote = (note, freq) => {
    if (!sampler || !samplerReady) return;
    sampler.triggerAttackRelease(note, "1n");
    setCurrentNote({ note, freq });
  };

    return (
    <div className="min-h-screen bg-white text-center p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
            <span className="text-4xl">{theme.emoji}</span>
            <span>Teclado de {instrumentTranslations[instrumento] || instrumento}</span>
        </h1>

        <InstrumentSelector
        instrumentos={instrumentosDisponibles}
        instrumentoActual={instrumento}
        setInstrumentoActual={setInstrumento}
        />

        {!audioReady && (
        <p className="text-orange-600 text-lg">Haz clic en la página para activar el audio.</p>
        )}

        {audioReady && !samplerReady && (
        <p className="text-blue-600 text-lg">
            🎧 Cargando muestras de {theme.label.toLowerCase()}...
        </p>
        )}

        {audioReady && samplerReady && (
        <>
            <PianoRealVirtual
            notes={notes}
            playNote={playNote}
            currentNote={currentNote}
            />

            <div className="mt-4 text-lg">
            {currentNote ? (
                <>
                <p>🎵 Nota: <strong>{currentNote.note}</strong></p>
                <p>🎚️ Frecuencia: <strong>{currentNote.freq} Hz</strong></p>
                </>
            ) : (
                <p className="text-gray-500">Toca una nota para empezar</p>
            )}
            </div>

            <div className="mt-6">
            <VisualizadorOnda analyser={analyser?.waveform} />
            <VisualizadorFFT analyser={analyser?.fft} currentNote={currentNote} />
            </div>
        </>
        )}
    </div>
    );
};

export default InstrumentLoader;
