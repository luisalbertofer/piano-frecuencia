import React, { useRef, useEffect } from "react";

const VisualizadorFFT = ({ analyser }) => {
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

        ctx.fillStyle = `hsl(${(i / dataArray.length) * 240}, 80%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth;
      }
    };

    draw();
  }, [analyser]);

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
