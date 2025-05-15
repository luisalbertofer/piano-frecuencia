import React, { useRef, useEffect } from "react";

const VisualizadorFFT = ({ analyser, currentNote }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const dataArray = new Float32Array(analyser.size);

    const getBarColor = (freq, match = false) => {
      if (match) return "#3498DB"; // Azul: nota actual
      if (freq <= 250) return "#2ECC71";     // Grave → verde
      if (freq <= 2000) return "#F1C40F";    // Medio → amarillo
      return "#E74C3C";                      // Agudo → rojo
    };

    const drawScale = () => {
      ctx.font = "10px Arial";
      ctx.fillStyle = "#444";
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
        const x = (index / dataArray.length) * width;
        ctx.fillText(label, x, height - 2);
      });
    };

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getValue().forEach((v, i) => (dataArray[i] = v)); // Copiar valores FFT

      ctx.clearRect(0, 0, width, height);

      const barWidth = width / dataArray.length;

      for (let i = 0; i < dataArray.length; i++) {
        const db = dataArray[i];
        const normalized = (db + 100) / 100; // de -100 a 0 → [0, 1]
        const barHeight = normalized * (height - 20); // deja espacio para etiquetas
        const freq = (i / dataArray.length) * 7902;

        const isMatch =
          currentNote && Math.abs(freq - currentNote.freq) < 50;

        ctx.fillStyle = getBarColor(freq, isMatch);
        ctx.fillRect(i * barWidth, height - 20 - barHeight, barWidth, barHeight);
      }

      drawScale(); // solo redibuja encima
    };

    draw();
  }, [analyser, currentNote]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={160}
      className="mx-auto border border-gray-400 rounded shadow"
    />
  );
};

export default VisualizadorFFT;
