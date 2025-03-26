import { useEffect, useRef } from "react";
import io from "socket.io-client";

//const socket = io("http://localhost:5000");
const socket = io("https://backend-random-url.ngrok.io");


const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  let drawing = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    // Listen for incoming drawing data
    socket.on("draw", ({ x, y, type }) => {
      if (type === "start") {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (type === "draw") {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    return () => {
      socket.off("draw");
    };
  }, []);

  const startDrawing = (e) => {
    drawing = true;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.clientX, e.clientY);
    socket.emit("draw", { x: e.clientX, y: e.clientY, type: "start" });
  };

  const draw = (e) => {
    if (!drawing) return;
    ctxRef.current.lineTo(e.clientX, e.clientY);
    ctxRef.current.stroke();
    socket.emit("draw", { x: e.clientX, y: e.clientY, type: "draw" });
  };

  const stopDrawing = () => {
    drawing = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      style={{ border: "2px solid black", background: "white" }}
    />
  );
};

export default Whiteboard;
