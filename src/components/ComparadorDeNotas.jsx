import React, { useState } from "react";

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
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const reproducirNotas = () => {
    const distancia = grados[dificultad];
    const maxIndex = notes.length - distancia;
    const base = Math.floor(Math.random() * maxIndex);
    const ascending = Math.random() < 0.5;

    let nota1, nota2;
    if (ascending) {
      nota1 = notes[base];
      nota2 = notes[base + distancia];
    } else {
      nota1 = notes[base + distancia];
      nota2 = notes[base];
    }

    setNotasActivas([nota1, nota2]);
    setResultado(null);
    setIsPlaying(true);

    synth.triggerAttackRelease(nota1.note, "0.5", 0);
    synth.triggerAttackRelease(nota2.note, "0.5", "+1.2");

    setTimeout(() => setIsPlaying(false), 2000);
  };

  const evaluarRespuesta = (respuesta) => {
    if (notasActivas.length < 2 || isPlaying) return;

    const [n1, n2] = notasActivas;
    let correcta;
    if (n2.freq === n1.freq) correcta = "igual";
    else correcta = n2.freq > n1.freq ? "agudo" : "grave";

    const acierto = respuesta === correcta;
    setResultado(acierto ? "✅ ¡Correcto!" : `❌ Incorrecto (era ${correcta})`);
    setStats((s) => ({
      correct: s.correct + (acierto ? 1 : 0),
      total: s.total + 1,
    }));

    setIsPlaying(true);
    synth.triggerAttackRelease(n1.note, "0.5", "+1.5");
    synth.triggerAttackRelease(n2.note, "0.5", "+2.7");

    setTimeout(() => {
      setIsPlaying(false);
      reproducirNotas();
    }, 4000);
  };

  return (
    <div className="mt-8 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">🎵 Comparador de Notas</h2>

      <div className="mb-3">
        <label htmlFor="dificultad" className="mr-2">Dificultad:</label>
        <select
          id="dificultad"
          value={dificultad}
          onChange={(e) => setDificultad(e.target.value)}
          className="p-1"
          disabled={isPlaying}
        >
          <option value="tercera">Tercera (3 notas)</option>
          <option value="quinta">Quinta (5 notas)</option>
          <option value="octava">Octava (8 notas)</option>
        </select>
      </div>

      <button
        onClick={reproducirNotas}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isPlaying}
      >
        ▶️ Tocar Notas
      </button>

      {notasActivas.length > 0 && (
        <div className="mt-4">
          <p>¿La segunda nota es más…?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={() => evaluarRespuesta("grave")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              disabled={isPlaying}
            >
              ⬇ Grave
            </button>
            <button
              onClick={() => evaluarRespuesta("agudo")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              disabled={isPlaying}
            >
              ⬆ Agudo
            </button>
          </div>
          {resultado && (
            <p className="mt-4 text-lg font-bold">{resultado}</p>
          )}
          <p className="mt-2 text-sm">
            Progreso: {stats.correct} / {stats.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparadorDeNotas;