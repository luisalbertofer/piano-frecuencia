import React, { useState } from "react";
import { GiMusicalNotes } from "react-icons/gi"; // Icono de nota musical

const grados = {
  tercera: 2,
  quinta: 4,
  octava: 7,
};

const ComparadorDeNotas = ({ notes, synth }) => {
  const [resultado, setResultado] = useState(null);
  const [notasActivas, setNotasActivas] = useState([]);
  const [dificultad, setDificultad] = useState("quinta");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingNote, setIsPlayingNote] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState("bg-blue-500");
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const generarParDeNotas = () => {
    const distancia = grados[dificultad];
    const maxIndex = notes.length - distancia;
    const base = Math.floor(Math.random() * maxIndex);
    const ascending = Math.random() < 0.5;

    const nota1 = ascending ? notes[base] : notes[base + distancia];
    const nota2 = ascending ? notes[base + distancia] : notes[base];

    return [nota1, nota2];
  };

  const reproducirNotas = () => {
    if (!synth) return;

    const [nota1, nota2] = generarParDeNotas();
    setNotasActivas([nota1, nota2]);
    setResultado(null);
    setIsPlaying(true);
    setIndicatorColor("bg-blue-500"); // Resetear color
    setIsPlayingNote(true);

    synth.triggerAttackRelease(nota1.note, "0.5", 0);
    synth.triggerAttackRelease(nota2.note, "0.5", "+1.2");

    setTimeout(() => {
      setIsPlaying(false);
      setIsPlayingNote(false);
    }, 2000);
  };

  const evaluarRespuesta = (respuesta) => {
    if (!synth || notasActivas.length < 2 || isPlaying) return;

    const [n1, n2] = notasActivas;
    const correcta = n2.freq > n1.freq ? "agudo" : "grave";
    const acierto = respuesta === correcta;

    setResultado(acierto ? "✅ ¡Correcto!" : `❌ Incorrecto (era ${correcta})`);
    setStats((s) => ({
      correct: s.correct + (acierto ? 1 : 0),
      total: s.total + 1,
    }));

    const newColor = acierto ? "bg-green-500" : "bg-red-500";
    setIndicatorColor(newColor);
    setIsPlayingNote(true);
    setIsPlaying(true);

    synth.triggerAttackRelease(n1.note, "0.5", "+1.5");
    synth.triggerAttackRelease(n2.note, "0.5", "+2.7");

    setTimeout(() => {
      setIsPlaying(false);
      setIsPlayingNote(false);
      setIndicatorColor("bg-blue-500"); // Volver al azul original
      reproducirNotas(); // flujo continuo
    }, 4000);
  };

  const resetJuego = () => {
    setStats({ correct: 0, total: 0 });
    setNotasActivas([]);
    setResultado(null);
    setIsPlaying(false);
    setIndicatorColor("bg-blue-500");
    setIsPlayingNote(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-6 border rounded bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">🎵 Comparador de Notas</h2>

      {/* Indicador visual con icono */}
      <div className="mt-4 flex justify-center min-h-[4rem]">
        <div
          className={`transition-all duration-300 w-16 h-16 rounded-full flex items-center justify-center ${
            isPlayingNote ? `${indicatorColor} animate-pulse` : "opacity-0"
          }`}
        >
          <GiMusicalNotes className="text-white text-xl" />
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor="dificultad" className="font-medium">Dificultad:</label>
        <select
          id="dificultad"
          value={dificultad}
          onChange={(e) => setDificultad(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={isPlaying}
        >
          <option value="tercera">Tercera (3 notas)</option>
          <option value="quinta">Quinta (5 notas)</option>
          <option value="octava">Octava (8 notas)</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={reproducirNotas}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isPlaying || !synth}
        >
          {isPlaying ? "⏳ Tocando…" : "▶️ Tocar Notas"}
        </button>
        <button
          onClick={resetJuego}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          🔄 Reiniciar
        </button>
      </div>

      {notasActivas.length > 0 && (
        <div className="mt-6 text-center">
          <p className="mb-2">¿La segunda nota es más…?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => evaluarRespuesta("grave")}
              className="px-4 py-2 bg-red-300 hover:bg-red-400 rounded disabled:opacity-50"
              disabled={isPlaying}
            >
              ⬇ Grave
            </button>
            <button
              onClick={() => evaluarRespuesta("agudo")}
              className="px-4 py-2 bg-green-300 hover:bg-green-400 rounded disabled:opacity-50"
              disabled={isPlaying}
            >
              ⬆ Agudo
            </button>
          </div>
          {resultado && (
            <p className="mt-4 text-lg font-bold">{resultado}</p>
          )}
          <p className="mt-2 text-sm text-gray-600">
            Progreso: {stats.correct} / {stats.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparadorDeNotas;