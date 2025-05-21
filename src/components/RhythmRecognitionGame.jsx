import React, { useState, useRef } from "react";
import * as Tone from "tone";
import { Volume2, Check, X } from 'lucide-react';

const RhythmRecognitionGame = () => {
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isPlayingRhythm, setIsPlayingRhythm] = useState(false);
  const synthRef = useRef(
    new Tone.Synth({
      oscillator: { type: "square" }, // ¡Sonido tipo tambor!
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1,
      },
    }).toDestination()
  );

  // Generar una secuencia aleatoria
// Generar una secuencia rítmica aleatoria
const generateSequence = () => {
  const lengths = [250, 500, 750];
  const seqLength = Math.floor(Math.random() * 3) + 2; // entre 2 y 4 pulsos
  let time = 0;
  const newSequence = [];

  for (let i = 0; i < seqLength; i++) {
    const step = lengths[Math.floor(Math.random() * lengths.length)];
    newSequence.push(time);
    time += step;
  }

  // --- Generar opciones con diferencias claras ---
  const option1 = [...newSequence]; // opción correcta

  // Opción 2: Añadir un pulso adicional
  let option2 = [...newSequence];
  const randomTime = Math.floor(Math.random() * time) + 100;
  option2 = [...option2, randomTime].sort((a, b) => a - b);

  // Opción 3: Eliminar un pulso
  let option3 = [...newSequence];
  if (option3.length > 1) {
    const indexToRemove = Math.floor(Math.random() * option3.length);
    option3.splice(indexToRemove, 1);
  }

  // Mezclar las opciones y asegurarnos de que no sean iguales
  const allOptions = shuffleArray([option1, option2, option3]);

  setSequence(option1);
  setOptions(allOptions);
  setSelectedOption(null);
  setFeedback("");
  playSequence(option1);
};

// Función auxiliar para mezclar las opciones
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

  // Reproducir secuencia
  const playSequence = (seq) => {
    seq.forEach((time) => {
      setTimeout(() => {
        synthRef.current.triggerAttackRelease("C4", "8n");
      }, time);
    });
  };

  // Evaluar respuesta
  const handleSelect = (index) => {
    setSelectedOption(index);

    const isCorrect = JSON.stringify(options[index]) === JSON.stringify(sequence);
    if (isCorrect) {
      setFeedback("✅ ¡Correcto!");
      setStats((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setFeedback(`❌ Inténtalo otra vez`);
    }
    setStats((s) => ({ ...s, total: s.total + 1 }));
  };

  // Dibujar una mini-forma de onda (gráfica simple)
const renderWaveform = (pattern) => {
  const totalDuration = pattern.length > 0 ? pattern[pattern.length - 1] + 250 : 1000;
  const barsCount = 8;
  const msPerBar = totalDuration / barsCount;

  const bars = Array(barsCount).fill(false).map((_, i) => {
    const start = i * msPerBar;
    const end = start + msPerBar;
    return pattern.some(t => t >= start && t <= end);
  });

  return (
    <div className="flex gap-1 h-6">
      {bars.map((hasBeat, i) => (
        <div
          key={i}
          className={`w-2 rounded-sm ${
            hasBeat ? "bg-blue-500" : "bg-gray-300"
          }`}
          style={{ height: hasBeat ? "100%" : "30%" }}
        ></div>
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
                {index === options.findIndex(o => JSON.stringify(o) === JSON.stringify(sequence)) ? (
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