import React, { useState, useEffect } from "react";
import { GiMusicalNotes } from "react-icons/gi";
import { notes } from "../data/notes";

const rangosPorDificultad = {
  facil: [
    { nombre: "Grave", min: 65, max: 400, color: "bg-blue-300 hover:bg-blue-400" },
    { nombre: "Medio", min: 401, max: 700, color: "bg-yellow-300 hover:bg-yellow-400" },
    { nombre: "Agudo", min: 701, max: 1000, color: "bg-red-300 hover:bg-red-400" }
  ],
  media: [
    { nombre: "Muy grave", min: 65, max: 320, color: "bg-blue-200 hover:bg-blue-300" },
    { nombre: "Grave", min: 321, max: 450, color: "bg-blue-300 hover:bg-blue-400" },
    { nombre: "Medio", min: 451, max: 600, color: "bg-yellow-300 hover:bg-yellow-400" },
    { nombre: "Agudo", min: 601, max: 800, color: "bg-red-300 hover:bg-red-400" },
    { nombre: "Muy agudo", min: 801, max: 1000, color: "bg-red-400 hover:bg-red-500" }
  ],
  dificil: [
    { nombre: "R1", min: 65, max: 200, color: "bg-indigo-200 hover:bg-indigo-300" },
    { nombre: "R2", min: 201, max: 300, color: "bg-blue-200 hover:bg-blue-300" },
    { nombre: "R3", min: 301, max: 400, color: "bg-blue-300 hover:bg-blue-400" },
    { nombre: "R4", min: 401, max: 500, color: "bg-yellow-300 hover:bg-yellow-400" },
    { nombre: "R5", min: 501, max: 600, color: "bg-orange-300 hover:bg-orange-400" },
    { nombre: "R6", min: 601, max: 700, color: "bg-red-300 hover:bg-red-400" },
    { nombre: "R7", min: 701, max: 1000, color: "bg-red-400 hover:bg-red-500" }
  ]
};

const JuegoRango = ({ synth, dificultad = "facil" }) => {
  const [nota, setNota] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [indicatorColor, setIndicatorColor] = useState("bg-blue-500");

  const rangos = rangosPorDificultad[dificultad];

  const generarNotaAleatoria = () => {
    const minGlobal = Math.min(...rangos.map(r => r.min));
    const maxGlobal = Math.max(...rangos.map(r => r.max));
    const notasFiltradas = notes.filter(
      (n) => n.freq >= minGlobal && n.freq <= maxGlobal
    );

    const aleatoria = notasFiltradas[Math.floor(Math.random() * notasFiltradas.length)];

    setNota(aleatoria);
    setResultado(null);
    setIndicatorColor("bg-blue-500");
    setIsPlaying(true);

    synth.triggerAttackRelease(aleatoria.note, "1", "+0.5");

    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const evaluarRespuesta = (nombreRango) => {
    if (!nota || isPlaying) return;

    const rango = rangos.find(
      (r) => r.nombre.toLowerCase() === nombreRango.toLowerCase()
    );

    const acierto = nota.freq >= rango.min && nota.freq <= rango.max;

    setResultado(acierto ? "✅ ¡Correcto!" : "❌ Incorrecto");
    setStats((s) => ({
      correct: s.correct + (acierto ? 1 : 0),
      total: s.total + 1
    }));

    setIndicatorColor(acierto ? "bg-green-500" : "bg-red-500");

    synth.triggerAttackRelease(nota.note, "1", "+0.5");

    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setIndicatorColor("bg-blue-500");
      generarNotaAleatoria();
    }, 2000);
  };

  useEffect(() => {
    setNota(null);
    setResultado(null);
    setStats({ correct: 0, total: 0 });
    setIndicatorColor("bg-blue-500");
  }, [dificultad]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-6 border rounded bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">🎯 Adivina el Rango Auditivo</h2>
      <p className="text-sm text-gray-600 mb-2 text-center">
        Dificultad: <strong>{dificultad}</strong>
      </p>

      <div className="mt-4 flex justify-center min-h-[4rem]">
        <div className={`transition-all duration-300 w-16 h-16 rounded-full flex items-center justify-center ${
          isPlaying ? `${indicatorColor} animate-pulse` : "opacity-0"
        }`}>
          <GiMusicalNotes className="text-white text-xl" />
        </div>
      </div>

      <div className="flex gap-3 mb-6 mt-6">
        <button
          onClick={generarNotaAleatoria}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isPlaying || !synth}
        >
          {isPlaying ? "⏳ Tocando…" : "▶️ Escuchar Nota"}
        </button>
        <button
          onClick={() => {
            setStats({ correct: 0, total: 0 });
            setResultado(null);
            setNota(null);
          }}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          🔄 Reiniciar
        </button>
      </div>

      {nota && (
        <div className="text-center">
          <p className="mb-2">¿En qué rango crees que está esta nota?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {rangos.map((rango) => (
              <button
                key={rango.nombre}
                onClick={() => evaluarRespuesta(rango.nombre)}
                disabled={isPlaying}
                className={`px-4 py-2 rounded disabled:opacity-50 ${rango.color}`}
              >
                {rango.nombre}
              </button>
            ))}
          </div>
          {resultado && (
            <>
              <p className="mt-4 text-lg font-bold">{resultado}</p>
              <p className="mt-1 text-sm text-gray-700">
                Nota reproducida: <strong>{nota.note}</strong> ({nota.name}, {nota.freq.toFixed(2)} Hz)
              </p>
            </>
          )}
          <p className="mt-2 text-sm text-gray-600">
            Progreso: {stats.correct} / {stats.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default JuegoRango;
