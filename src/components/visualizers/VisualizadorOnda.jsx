import React, { useRef, useEffect } from "react";

const VisualizadorOnda = ({ analyser }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);
      const dataArray = analyser.getValue();

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Fondo suave
      ctx.fillStyle = "#f5f7fa";
      ctx.fillRect(0, 0, width, height);

      // Línea de referencia central
      ctx.strokeStyle = "#ccc";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Dibujar la onda
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3498db";
      ctx.beginPath();

      const sliceWidth = width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] + 1) / 2; // normalizar [-1,1] → [0,1]
        const y = v * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={150}
      className="mx-auto border border-gray-300 rounded shadow mt-6 bg-white"
    />
  );
};

export default VisualizadorOnda;
