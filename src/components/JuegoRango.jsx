import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { clasificarFrecuencia } from "../utils/audioUtils";

const rangosCompletos = [
  { label: "Muy Grave", value: "muy grave" },
  { label: "Grave", value: "grave" },
  { label: "Medio-bajo", value: "medio-bajo" },
  { label: "Medio-alto", value: "medio-alto" },
  { label: "Agudo", value: "agudo" },
  { label: "Muy Agudo", value: "muy agudo" },
  { label: "Ultra Agudo", value: "ultra-agudo" },
];

const rangosPorDificultad = {
  facil: ["grave", "medio-bajo", "medio-alto", "agudo"],
  media: ["muy grave", "grave", "medio-bajo", "medio-alto", "agudo", "muy agudo"],
  dificil: ["muy grave", "grave", "medio-bajo", "medio-alto", "agudo", "muy agudo", "ultra-agudo"],
};

const JuegoRango = ({ synth, notes, dificultad = "facil" }) => {
  const [notaActual, setNotaActual] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [mostrandoSolucion, setMostrandoSolucion] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);

  const reproducirNotaActual = async () => {
    if (!notaActual || !synth) return;
    await Tone.context.resume();
    synth.triggerAttackRelease(notaActual.note, "0.6");
  };

    const reproducirNuevaNota = async () => {
    if (!notes || notes.length === 0) return;
    const aleatoria = notes[Math.floor(Math.random() * notes.length)];
    
    // Primero, actualiza el estado
    setNotaActual(aleatoria);
    setResultado(null);
    setMostrandoSolucion(false);
    
    // Luego programa la reproducción para un tiempo futuro
    await Tone.context.resume();
    
    // Usar '+0.1' en lugar de tiempo inmediato para asegurar que sea mayor al anterior
    synth.triggerAttackRelease(aleatoria.note, "0.6", "+0.1");
    };

    const manejarRespuesta = (rangoElegido) => {
    const correcto = clasificarFrecuencia(notaActual.freq);
    const esCorrecto = correcto === rangoElegido;

    setResultado({
        correcto,
        elegido: rangoElegido,
        esCorrecto,
    });
    setMostrandoSolucion(true);

    if (esCorrecto) {
        setAciertos((prev) => prev + 1);
    } else {
        setFallos((prev) => prev + 1);
    }
    };


  useEffect(() => {
    if (synth && notes && notes.length > 0) {
      reproducirNuevaNota();
    }
  }, [synth]);

  const rangosFiltrados = rangosCompletos.filter((r) =>
    rangosPorDificultad[dificultad]?.includes(r.value)
  );

  return (
    <div className="text-center mt-4">

        {notaActual && (
            <>
                <div className="flex justify-center gap-4 mb-4 text-lg font-medium">
                <div className="text-green-600">✅ Aciertos: {aciertos}</div>
                <div className="text-red-600">❌ Fallos: {fallos}</div>
                </div>
                <button
                onClick={reproducirNotaActual}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                🔊 Reproducir Nota
                </button>
            </>
            )}

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {rangosFiltrados.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => manejarRespuesta(value)}
            className={`px-4 py-2 rounded border ${
              resultado && resultado.elegido === value
                ? resultado.esCorrecto
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            disabled={mostrandoSolucion}
          >
            {label}
          </button>
        ))}
      </div>

      {mostrandoSolucion && (
        <div className="text-lg mb-4">
          <p>
            La nota era <strong>{notaActual.note}</strong> (
            {notaActual.freq.toFixed(2)} Hz), clasificada como{" "}
            <strong className="capitalize">{resultado.correcto}</strong>.
          </p>
          <p className={resultado.esCorrecto ? "text-green-600" : "text-red-600"}>
            {resultado.esCorrecto ? "¡Correcto! 🎉" : "Incorrecto 😅"}
          </p>
          <button
            onClick={reproducirNuevaNota}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            ➕ Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default JuegoRango;