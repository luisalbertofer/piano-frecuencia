import React, { useState } from "react";
import * as Tone from "tone";
import { Volume2, Check, X } from "lucide-react";

const InstrumentRecognitionGame = () => {
  const [currentInstrument, setCurrentInstrument] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  // Tus instrumentos con sus audios
  const instruments = [
    { name: "Violín", audioPath: "/audio/violin.mp3" },
    { name: "Flauta", audioPath: "/audio/flute.mp3" },
    { name: "Guitarra", audioPath: "/audio/guitar.mp3" },
    { name: "Piano", audioPath: "/audio/piano.mp3" },
  ];

  // Iniciar nueva pregunta
  const startNewRound = () => {
    const correctIndex = Math.floor(Math.random() * instruments.length);
    const correct = instruments[correctIndex];

    // Generar 2 opciones distintas
    let otherOptions = [];
    while (otherOptions.length < 2) {
      const randIndex = Math.floor(Math.random() * instruments.length);
      const candidate = instruments[randIndex];
      if (!otherOptions.includes(candidate) && candidate !== correct) {
        otherOptions.push(candidate);
      }
    }

    const allOptions = shuffleArray([correct, ...otherOptions]);

    setCurrentInstrument(correct);
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback("");
  };

  // Reproducir el audio del instrumento
  const playAudio = async () => {
    if (!currentInstrument) return;

    await Tone.start(); // Necesario en algunos navegadores

    const player = new Tone.Player(currentInstrument.audioPath).toDestination();
    player.autostart = true;
  };

  // Evaluar respuesta
  const handleSelect = (index) => {
    const selected = options[index];
    setSelectedOption(index);

    if (selected === currentInstrument) {
      setFeedback("✅ ¡Correcto!");
      setStats((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setFeedback(`❌ Incorrecto. Era ${currentInstrument.name}`);
    }

    setStats((s) => ({ ...s, total: s.total + 1 }));
  };

  // Función auxiliar: mezclar array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
      <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-indigo-800">
        <Volume2 className="w-5 h-5" />
        Reconoce el Instrumento
      </h2>
      {/* Botón para escuchar */}
      <div className="flex justify-center mb-6">
        <button
          onClick={startNewRound}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center"
        >
          <Volume2 className="mr-2" /> Escuchar Instrumento
        </button>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {options.map((opt, index) => (
          <div
            key={index}
            className={`p-4 border rounded-xl transition-all duration-300 ease-in-out ${selectedOption === index
              ? "bg-indigo-100 border-indigo-400 scale-105"
              : "bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300"
              }`}
            onClick={() => handleSelect(index)}
          >
            <div className="flex items-center justify-between">
              <span>{opt.name}</span>
              {selectedOption === index && feedback && (
                <span>
                  {opt === currentInstrument ? (
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
        <div className="mb-6 text-center">
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

export default InstrumentRecognitionGame;