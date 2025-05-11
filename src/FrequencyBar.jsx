import React from "react";

const FrequencyBar = ({ freq, rango }) => {
const maxFreq = 2200; // ahora escala real hasta C7 (2093 Hz)
const barHeight = Math.min(Math.max((freq / maxFreq) * 100, 5), 100);

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
    <div style={{ marginTop: "2rem", height: "150px", width: "40px", margin: "auto", border: "1px solid #ccc", display: "flex", alignItems: "flex-end" }}>
      <div
        style={{
          height: `${barHeight}%`,
          width: "100%",
          backgroundColor: getColor(rango),
          transition: "height 0.3s ease",
        }}
      ></div>
    </div>
  );
};

export default FrequencyBar;
// Este componente se encarga de mostrar una barra de frecuencia que cambia de color según el rango de la frecuencia.