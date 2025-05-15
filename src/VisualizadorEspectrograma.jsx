import React, { useRef, useEffect } from "react";

const VisualizadorEspectrograma = ({ analyser }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const dataArray = new Float32Array(analyser.size);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getValue().forEach((v, i) => (dataArray[i] = v));

      // Desplaza la imagen 1px a la izquierda
      const img = ctx.getImageData(1, 0, width - 1, height);
      ctx.putImageData(img, 0, 0);

      // Dibuja nueva columna a la derecha
      for (let y = 0; y < height; y++) {
        const bin = Math.floor(((height - y - 1) / height) * (dataArray.length - 1));
        const db = dataArray[bin];
        const norm = Math.min(Math.max((db + 100) / 100, 0), 1);

        const hue = 240 - norm * 240;
        const lightness = 30 + norm * 40;
        ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        ctx.fillRect(width - 1, y, 1, 1);
      }

      // Líneas horizontales guía
      for (let i = 1; i < 5; i++) {
        const y = (i / 5) * height;
        ctx.strokeStyle = "rgba(200,200,200,0.1)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    draw();
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={256}
      className="mx-auto border border-gray-400 rounded shadow mt-6 bg-black"
    />
  );
};

export default VisualizadorEspectrograma;
