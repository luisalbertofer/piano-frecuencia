import React, { useRef, useEffect } from "react";

const VisualizadorFFT = ({ analyser, currentNote }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);
      const dataArray = analyser.getValue(); // valores entre -100 y 0 (dB)

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const db = dataArray[i];
        const normalized = (db + 100) / 100; // normalizar de [-100, 0] → [0, 1]
        const barHeight = normalized * canvas.height;

        // Colores por rango de frecuencia
        const freq = (i / dataArray.length) * 7902; // Escalar frecuencia
        const getBarColor = (freq) => {
          if (freq <= 250) return "#2ECC71"; // Verde para graves
          if (freq <= 2000) return "#F1C40F"; // Amarillo para medios
          return "#E74C3C"; // Rojo para agudos
        };

        ctx.fillStyle = getBarColor(freq);

        // Resaltar la barra de la nota actual
        if (currentNote && Math.abs(freq - currentNote.freq) < 50) {
          ctx.fillStyle = "#3498DB"; // Azul para resaltar
        }

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
      }

      // Dibujar escala de frecuencias
      const drawScale = () => {
        ctx.font = "10px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";

        const frequencies = [
          { freq: 65.41, label: "C2" },
          { freq: 130.81, label: "C3" },
          { freq: 261.63, label: "C4" },
          { freq: 523.25, label: "C5" },
          { freq: 1046.50, label: "C6" },
          { freq: 2093.00, label: "C7" },
          { freq: 4186.01, label: "C8" },
        ];

        frequencies.forEach(({ freq, label }) => {
          const index = Math.round((freq / 7902) * dataArray.length);
          const x = (index / dataArray.length) * canvas.width;
          ctx.fillText(label, x, canvas.height - 5);
        });
      };

      drawScale();
    };

    draw();
  }, [analyser, currentNote]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={150}
      className="mx-auto border border-gray-400 rounded mt-6"
    />
  );
};

export default VisualizadorFFT;