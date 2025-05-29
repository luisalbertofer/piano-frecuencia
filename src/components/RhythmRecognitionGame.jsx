import React, { useState, useRef, useEffect } from "react";
import * as Tone from "tone";
import { Volume2, Check, X } from "lucide-react";

const RhythmRecognitionGame = () => {
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isPlayingRhythm, setIsPlayingRhythm] = useState(false);

  const synthRef = useRef(
    new Tone.Synth({
      oscillator: { type: "square" },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1,
      },
    }).toDestination()
  );

  // --- Funciones auxiliares ---

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function removeDuplicatePatterns(patterns) {
    const seen = new Set();
    return patterns.filter((pattern) => {
      const key = JSON.stringify(pattern);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function addRandomBeat(seq) {
    const lastTime = seq.length > 0 ? seq[seq.length - 1] : 0;
    const time = lastTime + Math.floor(Math.random() * 500) + 100;
    return [...seq, time].sort((a, b) => a - b);
  }

  function shiftRandomBeat(seq) {
    if (seq.length === 0) return seq;
    const index = Math.floor(Math.random() * seq.length);
    const offset = Math.random() < 0.5 ? -100 : 100;
    const newValue = Math.max(0, seq[index] + offset);
    const newSeq = [...seq];
    newSeq[index] = newValue;
    return newSeq.sort((a, b) => a - b);
  }

  function duplicateRandomBeat(seq) {
    if (seq.length === 0) return seq;
    const index = Math.floor(Math.random() * seq.length);
    const duplicated = [...seq, seq[index]].sort((a, b) => a - b);
    return duplicated;
  }

  function reorderBeats(seq) {
    if (seq.length <= 1) return seq;
    const shuffled = [...seq];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function arePatternsTooSimilar(a, b) {
    // Comparar si las secuencias tienen tiempos muy cercanos
    const threshold = 100; // Umbral de diferencia permitida
    return a.every((time, index) => Math.abs(time - b[index]) < threshold);
  }

  // --- Generar secuencia ---
  const generateSequence = () => {
    setIsPlayingRhythm(true);

    const lengths = [250, 500, 750];
    const seqLength = Math.floor(Math.random() * 3) + 2; // entre 2 y 4 pulsos
    let time = 0;
    const newSequence = [];

    for (let i = 0; i < seqLength; i++) {
      const step = lengths[Math.floor(Math.random() * lengths.length)];
      newSequence.push(time);
      time += step;
    }

    // Generar variantes
    let variants = [
      [...newSequence],
      addRandomBeat([...newSequence]),
      shiftRandomBeat([...newSequence]),
      duplicateRandomBeat([...newSequence]),
      reorderBeats([...newSequence]),
    ];

    // Eliminar duplicados y asegurar 3 opciones
    variants = removeDuplicatePatterns(variants).slice(0, 3);
    while (variants.length < 3) {
      variants.push(addRandomBeat([...newSequence]));
      variants = removeDuplicatePatterns(variants).slice(0, 3);
    }

    // Verificar que no haya opciones demasiado similares
    const finalOptions = [];
    for (const option of variants) {
      if (
        !finalOptions.some((existing) =>
          arePatternsTooSimilar(option, existing)
        )
      ) {
        finalOptions.push(option);
      }
    }

    // Si aún hay menos de 3 opciones, regenerar
    while (finalOptions.length < 3) {
      const newVariant = addRandomBeat([...newSequence]);
      if (
        !finalOptions.some((existing) =>
          arePatternsTooSimilar(newVariant, existing)
        )
      ) {
        finalOptions.push(newVariant);
      }
    }

    const allOptions = shuffleArray(finalOptions);

    setSequence(newSequence);
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback("");

    playSequence(newSequence);
  };

  // --- Reproducir secuencia ---
  const playSequence = async (seq) => {
    await Tone.start();

    const now = Tone.now();

    seq.forEach((timeMs) => {
      Tone.Transport.schedule((time) => {
        synthRef.current.triggerAttackRelease("C4", "8n", time);
      }, now + timeMs / 1000);
    });

    Tone.Transport.start(now);

    setTimeout(() => {
      setIsPlayingRhythm(false);
    }, seq[seq.length - 1] + 500);
  };

  // --- Evaluar respuesta ---
  const handleSelect = (index) => {
    setSelectedOption(index);
    const isCorrect = JSON.stringify(options[index]) === JSON.stringify(sequence);

    if (isCorrect) {
      setFeedback("✅ ¡Correcto!");
      setStats((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      const correctIndex = options.findIndex((opt) =>
        JSON.stringify(opt) === JSON.stringify(sequence)
      );
      setFeedback(`❌ Incorrecto. La opción correcta era la #${correctIndex + 1}`);
    }

    setStats((s) => ({ ...s, total: s.total + 1 }));
  };

  // --- Visualización del ritmo ---
  const renderWaveform = (pattern) => {
    const totalDuration = pattern.length > 0 ? pattern[pattern.length - 1] + 250 : 1000;

    return (
      <div className="relative h-6 w-full overflow-hidden rounded bg-gray-200">
        {pattern.map((t, i) => (
          <div
            key={i}
            className="absolute top-1/2 transform -translate-y-1/2 bg-blue-600 rounded-full w-3 h-3"
            style={{ left: `${(t / totalDuration) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-indigo-800">
        <Volume2 className="w-5 h-5" />
        Reconoce el Ritmo
      </h2>

      {/* Botón para escuchar */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generateSequence}
          disabled={isPlayingRhythm}
          className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center ${
            isPlayingRhythm ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isPlayingRhythm ? (
            <>
              <svg className="animate-spin mr-2 h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              </svg>
              Reproduciendo...
            </>
          ) : (
            <>
              <Volume2 className="mr-2" /> Escuchar Ritmo
            </>
          )}
        </button>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {options.map((opt, index) => (
          <div
            key={index}
            className={`p-4 border rounded-xl transition-all duration-300 ease-in-out ${
              selectedOption === index
                ? "bg-indigo-100 border-indigo-400 shadow-inner scale-105"
                : "bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300"
            }`}
            onClick={() => handleSelect(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">{renderWaveform(opt)}</div>
              {selectedOption === index && feedback && (
                <span className="ml-3">
                  {index === options.findIndex((o) => JSON.stringify(o) === JSON.stringify(sequence)) ? (
                    <Check className="text-green-600" size={24} />
                  ) : (
                    <X className="text-red-600" size={24} />
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resultado */}
      {feedback && (
        <div className="mb-6 text-center animate-fade-in-down">
          <p className={`text-xl font-bold ${feedback.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {feedback}
          </p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Progreso:{" "}
          <span className="font-medium text-gray-800">
            {stats.correct} / {stats.total}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RhythmRecognitionGame;