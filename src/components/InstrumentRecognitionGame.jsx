import React, { useState, useRef } from "react";
import * as Tone from "tone";
import { Check, X } from "lucide-react";

// 🎵 Lista de instrumentos con timbres y colores
const instruments = [
  { id: "piano", name: "Piano", synth: "Synth", type: "triangle", color: "bg-blue-500" },
  { id: "flauta", name: "Flauta", synth: "FMSynth", type: "sine", color: "bg-green-500" },
  { id: "xilofono", name: "Xilófono", synth: "MetalSynth", type: "", color: "bg-yellow-500" },
  { id: "percusion", name: "Percusión", synth: "MembraneSynth", type: "", color: "bg-red-500" },
  { id: "violin", name: "Violín", synth: "AMSynth", type: "sine", color: "bg-purple-500" },
  { id: "trompeta", name: "Trompeta", synth: "Synth", type: "square", color: "bg-orange-500" },
];

const InstrumentRecognitionGame = () => {
  const [currentInst, setCurrentInst] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const prevInstRef = useRef(null);

  // 🔊 Reproducir el sonido según sintetizador y forma de onda
  const playInstrument = (synthType, waveType) => {
    let synth;
    switch (synthType) {
      case "FMSynth":
        synth = new Tone.FMSynth().toDestination();
        break;
      case "AMSynth":
        synth = new Tone.AMSynth().toDestination();
        break;
      case "MetalSynth":
        synth = new Tone.MetalSynth().toDestination();
        break;
      case "MembraneSynth":
        synth = new Tone.MembraneSynth().toDestination();
        break;
      default:
        synth = new Tone.Synth().toDestination();
    }

    if (waveType) synth.oscillator.type = waveType;
    synth.triggerAttackRelease("C4", "8n");
  };

  // ✅ Sonido de feedback positivo o negativo
  const playFeedbackSound = (isCorrect) => {
    const synth = new Tone.Synth().toDestination();
    const note = isCorrect ? "C5" : "A2";
    synth.triggerAttackRelease(note, "8n");
  };

  // 🧠 Generar nueva pregunta con opciones
  const generateQuestion = () => {
    let shuffled;
    let newCurrent;

    do {
      shuffled = [...instruments].sort(() => Math.random() - 0.5);
      newCurrent = shuffled[0];
    } while (newCurrent.id === prevInstRef.current?.id);

    prevInstRef.current = newCurrent;

    setCurrentInst(newCurrent);
    setOptions(shuffled.slice(0, 4)); // 4 opciones
    setSelectedOption(null);
    setFeedback("");

    playInstrument(newCurrent.synth, newCurrent.type);
  };

  // 🎯 Evaluar respuesta
  const evaluateAnswer = (optionId) => {
    const isCorrect = optionId === currentInst.id;
    setSelectedOption(optionId);

    if (isCorrect) {
      setFeedback("✅ ¡Correcto!");
      setStats((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setFeedback(`❌ Era: ${currentInst.name}`);
      setStats((prev) => ({ ...prev, total: prev.total + 1 }));
    }

    playFeedbackSound(isCorrect);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">🎵 ¿Qué instrumento es?</h2>

      {/* Botón de reproducir sonido */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generateQuestion}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
        >
          🔊 Escuchar
        </button>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => evaluateAnswer(opt.id)}
            disabled={selectedOption !== null}
            className={`flex items-center justify-between p-3 border rounded transition-all ${
              selectedOption === opt.id
                ? `${opt.color} text-white`
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            aria-label={`Opción: ${opt.name}`}
            title={opt.name}
          >
            <span>{opt.name}</span>
            {selectedOption === opt.id && (
              <span>
                {opt.id === currentInst?.id ? (
                  <Check className="text-white" />
                ) : (
                  <X className="text-white" />
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && <p className="text-lg font-bold text-center">{feedback}</p>}

      {/* Estadísticas */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Progreso: {stats.correct} / {stats.total}
      </p>
    </div>
  );
};

export default InstrumentRecognitionGame;
