import React, { useRef, useEffect } from "react";

const VisualizadorOnda = ({ analyser }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);
      const dataArray = analyser.getValue(); // obtiene nuevos datos cada frame

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3498db";
      ctx.beginPath();

      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] + 1) / 2; // normalizar: de [-1,1] → [0,1]
        const y = v * canvas.height;

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
      className="mx-auto border border-gray-400 rounded mt-6"
    />
  );
};

export default VisualizadorOnda;
