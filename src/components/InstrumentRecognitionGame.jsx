// src/components/InstrumentRecognitionGame.jsx
import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { Check, X } from "lucide-react";

// Lista de instrumentos disponibles con sus configuraciones
const instruments = [
  { id: "piano", name: "Piano", color: "bg-blue-500" },
  { id: "flute", name: "Flauta", color: "bg-green-500" },
  { id: "xylophone", name: "Xilófono", color: "bg-yellow-500" },
  { id: "french-horn", name: "Trompa", color: "bg-red-500" },
  { id: "violin", name: "Violín", color: "bg-purple-500" },
  { id: "trumpet", name: "Trompeta", color: "bg-orange-500" },
];

const InstrumentRecognitionGame = () => {
  const [currentInst, setCurrentInst] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Referencias para los instrumentos cargados
  const instrumentsRef = useRef({});
  const prevInstRef = useRef(null);

  // Cargar instrumentos al iniciar
  useEffect(() => {
    window.Tone = Tone;
    // Asegurarse de que SampleLibrary esté disponible
    if (typeof window.SampleLibrary === 'undefined') {
      console.error("SampleLibrary no está disponible. Verifica que Tonejs-Instruments.js esté cargado correctamente.");
      return;
    }

    // Configurar la URL base para las muestras
    window.SampleLibrary.baseUrl = '/piano-frecuencia/samples/audio/';
    
    // Cargar instrumentos de forma progresiva
    const loadInstruments = async () => {
      setIsLoading(true);
      const totalInstruments = instruments.length;
      
      for (let i = 0; i < totalInstruments; i++) {
        const inst = instruments[i];
        try {
          // Cargar instrumento con optimización (minify: true reduce la cantidad de muestras)
          const loadedInst = await new Promise(resolve => {
            const sampler = window.SampleLibrary.load({
              instruments: inst.id,
              minify: true,
              onload: () => resolve(sampler)
            });
            // Conectar a la salida principal
            sampler.toDestination();
          });
          
          // Guardar instrumento cargado
          instrumentsRef.current[inst.id] = loadedInst;
          
          // Actualizar progreso
          setLoadingProgress(Math.round(((i + 1) / totalInstruments) * 100));
        } catch (error) {
          console.error(`Error al cargar el instrumento ${inst.id}:`, error);
        }
      }
      
      setIsLoading(false);
    };

    loadInstruments();

    // Limpiar al desmontar
    return () => {
      // Dispose de los instrumentos cargados
      Object.values(instrumentsRef.current).forEach(inst => {
        if (inst && typeof inst.dispose === 'function') {
          inst.dispose();
        }
      });
    };
  }, []);

  // Reproducir instrumento seleccionado
  const playInstrument = (instrumentId) => {
    const instrument = instrumentsRef.current[instrumentId];
    if (!instrument) {
      console.error(`Instrumento ${instrumentId} no encontrado`);
      return;
    }

    // Seleccionar una nota aleatoria dentro del rango del instrumento
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    
    // Reproducir la nota
    instrument.triggerAttackRelease(randomNote, "2n");
  };

  // Sonido de feedback positivo o negativo
  const playFeedbackSound = (isCorrect) => {
    const synth = new Tone.Synth().toDestination();
    const note = isCorrect ? "C5" : "A2";
    synth.triggerAttackRelease(note, "8n");
  };

  // Generar nueva pregunta con opciones
  const generateQuestion = () => {
    if (isLoading || Object.keys(instrumentsRef.current).length === 0) {
      console.warn("Los instrumentos aún no están cargados");
      return;
    }

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

    playInstrument(newCurrent.id);
  };

  // Evaluar respuesta
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

  // Reproducir de nuevo el sonido actual
  const replaySound = () => {
    if (currentInst) {
      playInstrument(currentInst.id);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">🎵 ¿Qué instrumento es?</h2>

      {isLoading ? (
        <div className="mb-6">
          <p className="text-center mb-2">Cargando instrumentos... {loadingProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <>
          {/* Botones de control */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={generateQuestion}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
            >
              🔊 Nueva pregunta
            </button>
            {currentInst && (
              <button
                onClick={replaySound}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
              >
                🔄 Repetir sonido
              </button>
            )}
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
        </>
      )}
    </div>
  );
};

export default InstrumentRecognitionGame;
