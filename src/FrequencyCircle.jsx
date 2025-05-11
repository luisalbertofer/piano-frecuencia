import React from "react";

const FrequencyCircle = ({ freq, rango }) => {
  const maxFreq = 2200;
  const minSize = 50;
  const maxSize = 200;

  // Calcula el tamaño del círculo proporcionalmente
  const size = Math.min(
    Math.max((freq / maxFreq) * maxSize, minSize),
    maxSize
  );

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
    <div
      style={{
        marginTop: "2rem",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: getColor(rango),
          transition: "all 0.4s ease-in-out",
          boxShadow: `0 0 15px ${getColor(rango)}99`,
        }}
      />
    </div>
  );
};

export default FrequencyCircle;
