import React from "react";

const getGroupColor = (note) => {
  if (note.includes("1")) return "#A9A9A9"; // Gris para octava 1
  if (note.includes("2")) return "#FFD700"; // Amarillo
  if (note.includes("3")) return "#FF7F50"; // Coral
  if (note.includes("4")) return "#87CEEB"; // Azul claro
  if (note.includes("5")) return "#32CD32"; // Verde
  if (note.includes("6")) return "#BA55D3"; // Morado
  if (note.includes("7")) return "#FF4500"; // Naranja
  if (note.includes("8")) return "#FF00FF"; // Rosa neón
  return "#FFFFFF"; // Blanco por defecto
};
const PianoVirtual = ({ notes, playNote, currentNote }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {notes.map(({ note, freq, name }) => (
        <div
          key={note}
          onClick={() => playNote(note, freq)}
          style={{
            width: note.includes("#") ? "30px" : "40px",
            height: "150px",
            margin: "1px",
            backgroundColor: note.includes("#")
              ? "#000"
              : currentNote?.note === note
              ? "#f39c12" // Resalta la tecla actual (naranja)
              : getGroupColor(note),
            color: note.includes("#") ? "#fff" : "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "bold",
            border: "1px solid #333",
            position: "relative",
            zIndex: note.includes("#") ? 1 : 0,
            transition: "background-color 0.3s ease, transform 0.2s ease",
            transform: currentNote?.note === note ? "scale(1.1)" : "scale(1)", // Animación de escala
          }}
        >
          <div>{note}</div>
          <div style={{ fontSize: "10px", marginTop: "4px" }}>{name}</div>
        </div>
      ))}
    </div>
  );
};

export default PianoVirtual;