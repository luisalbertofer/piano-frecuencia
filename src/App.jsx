import React, { useState } from "react";

import PianoVirtual from "./PianoVirtual";
import * as Tone from "tone";
import { notes } from "./notes";


function App() {
  const [currentNote, setCurrentNote] = useState(null);

  const playNote = (note, freq) => {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, "0.5");
    const rango = clasificarFrecuencia(freq);
    setCurrentNote({ note, freq, rango });
  };

  const clasificarFrecuencia = (freq) => {
    if (freq <= 250) return "grave";
    if (freq <= 800) return "medio";
    return "agudo";
  };

  const getColor = (rango) => {
    switch (rango) {
      case "grave":
        return "#4f8bf9"; // azul
      case "medio":
        return "#2ecc71"; // verde
      case "agudo":
        return "#e74c3c"; // rojo
      default:
        return "#000";
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Piano Frecuencia Visual</h1>

      <PianoVirtual notes={notes} playNote={playNote} currentNote={currentNote} />

      {currentNote && (
        <div style={{ marginTop: "2rem", fontSize: "1.5rem" }}>
          <p>Nota: <strong>{currentNote.note}</strong></p>
          <p>Frecuencia: <strong>{currentNote.freq.toFixed(2)} Hz</strong></p>
          <p>
            Rango:{" "}
            <strong style={{ color: getColor(currentNote.rango), textTransform: "capitalize" }}>
              {currentNote.rango}
            </strong>
          </p>
        </div>
      )}


    </div>
  );
}

export default App;
