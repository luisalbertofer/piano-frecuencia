import React, { useState } from "react";
import * as Tone from "tone";

const grados = {
  "tercera": 2,
  "quinta": 4,
  "octava": 7,
};

const ComparadorDeNotas = ({ notes, synth }) => {
  const [resultado, setResultado] = useState(null);
  const [notasActivas, setNotasActivas] = useState([]);
  const [dificultad, setDificultad] = useState("quinta");

const reproducirNotas = () => {
  const distancia = grados[dificultad];
  const maxIndex = notes.length - distancia - 1;
  const indexBase = Math.floor(Math.random() * maxIndex);

  const nota1 = notes[indexBase];
  const nota2 = notes[indexBase + distancia];

  setNotasActivas([nota1, nota2]);
  setResultado(null);

  // Toca nota1 en el momento actual
  synth.triggerAttackRelease(nota1.note, "0.5", "+0");

  // Espera más: nota2 se toca después de 1.5 segundos
  synth.triggerAttackRelease(nota2.note, "0.5", "+1.5");
};

  const evaluarRespuesta = (respuesta) => {
    if (notasActivas.length < 2) return;

    const [n1, n2] = notasActivas;
    const correcta = n2.freq > n1.freq ? "agudo" : "grave";

    const acierto = respuesta === correcta;
    setResultado(acierto ? "✅ ¡Correcto!" : "❌ Incorrecto");

    // Repetir para reforzar
    synth.triggerAttackRelease(n1.note, "0.5", "+1.2");
    synth.triggerAttackRelease(n2.note, "0.5", "+2.7"); // más lento que antes

    // Reiniciar para nueva ronda tras un pequeño retraso
    setTimeout(() => {
      reproducirNotas();
    }, 3000);
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
        >
          <option value="tercera">Tercera (3 notas)</option>
          <option value="quinta">Quinta (5 notas)</option>
          <option value="octava">Octava (8 notas)</option>
        </select>
      </div>

      <button
        onClick={reproducirNotas}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            >
              ⬇ Grave
            </button>
            <button
              onClick={() => evaluarRespuesta("agudo")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              ⬆ Agudo
            </button>
          </div>
          {resultado && (
            <p className="mt-4 text-lg font-bold">{resultado}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparadorDeNotas;
