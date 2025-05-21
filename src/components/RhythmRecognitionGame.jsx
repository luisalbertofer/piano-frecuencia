import React, { useState, useRef } from "react";
import * as Tone from "tone";

const RhythmRecognitionGame = () => {
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
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
    <div className="w-full max-w-md mx-auto p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">🥁 Reconoce el Ritmo</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={generateSequence}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔊 Escuchar Ritmo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {options.map((opt, index) => (
          <div
            key={index}
            className={`p-3 border rounded flex items-center justify-between cursor-pointer ${
              selectedOption === index
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleSelect(index)}
          >
            <div>{renderWaveform(opt)}</div>
            {selectedOption === index && feedback && (
              <span className="ml-2 text-sm font-semibold">
                {index === options.findIndex(o => JSON.stringify(o) === JSON.stringify(sequence)) ? "✅" : "❌"}
              </span>
            )}
          </div>
        ))}
      </div>

      {feedback && <p className="text-lg font-bold text-center">{feedback}</p>}

      <p className="mt-4 text-sm text-gray-600 text-center">
        Progreso: {stats.correct} / {stats.total}
      </p>
    </div>
  );
};

export default RhythmRecognitionGame;