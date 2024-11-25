import React, { useRef, useState, useEffect } from "react";

// Type for drawing paths
interface Point {
  x: number;
  y: number;
}

const CanvasDraw: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);
  let points: Point[] = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;

    contextRef.current = context;

    // Initialize SharedWorker
    const worker = new SharedWorker(
      new URL("../shared-worker.ts", import.meta.url),
      { type: "module" },
    );

    setSharedWorker(worker);

    // Listen for messages from the SharedWorker
    worker.port.onmessage = (event) => {
      const { type, data } = event.data;

      if (type === "draw") {
        drawPath(data);
      } else if (type === "init") {
        // Draw existing paths when joining
        data.forEach((path: Point[]) => drawPath(path));
      } else if (type === "clear") {
        clearCanvas();
      }
    };

    // Start the worker's port
    worker.port.start();

    return () => {
      worker.port.close();
    };
  }, []);

  const startDrawing = (x: number, y: number) => {
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    points = [{ x, y }];
    setIsDrawing(true);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing || !contextRef.current) return;

    points = [...points, { x, y }];
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);

    if (sharedWorker) {
      sharedWorker.port.postMessage({
        type: "draw",
        data: points,
      });
    }
    points = [];
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    startDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    draw(offsetX, offsetY);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  const drawPath = (path: Point[]) => {
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    path.forEach((point, index) => {
      if (index === 0) {
        contextRef.current?.moveTo(point.x, point.y);
      } else {
        contextRef.current?.lineTo(point.x, point.y);
      }
    });
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    if (sharedWorker) {
      sharedWorker.port.postMessage({ type: "clear" });
    }

    if (contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height,
      );
    }
  };

  return (
    <div>
      <button onClick={clearCanvas}>Clear</button>

      <canvas
        ref={canvasRef}
        className="border border-black cursor-crosshair w-full h-full touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default CanvasDraw;
