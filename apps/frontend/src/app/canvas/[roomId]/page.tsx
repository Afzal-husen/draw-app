"use client";

import { useEffect, useRef, useState } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (window) {
      setCanvasDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      window.onresize = (e: UIEvent) => {
        setCanvasDimensions((prev) => ({
          ...prev,
          width: window.innerWidth,
          height: window.innerHeight,
        }));
      };
    }
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      let isMouseDown: boolean = false;
      let startX = 0;
      let startY = 0;
      canvas.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
      });
      canvas.addEventListener("mouseup", (e) => {
        isMouseDown = false;
        console.log(e.clientX);
        console.log(e.clientY);
      });
      canvas.addEventListener("mousemove", (e) => {
        if (isMouseDown) {
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#fff";
          ctx.strokeRect(startX, startY, width, height);
        }
      });
    }
  }, [canvasRef]);
  return (
    <div className="w-screen h-screen">
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}></canvas>
    </div>
  );
};

export default Canvas;
