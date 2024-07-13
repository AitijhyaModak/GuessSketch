import { useRef, useState, useEffect } from "react";
import { BsEraserFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

export default function Game() {
  return (
    <div className="h-[dvh] flex flex-col">
      <div className="w-full">
        <Canvas></Canvas>
      </div>

      <div className="flex flex-1 justify-between">
        <PlayersList></PlayersList>
        <GuessAndChat></GuessAndChat>
      </div>
    </div>
  );
}

function PlayersList() {
  return (
    <div className="min-w-fit w-[5%] flex flex-col justify-end pb-3 mr-5 pl-5">
      {roomData.players.map((item) => (
        <Player player={item}></Player>
      ))}
    </div>
  );
}
function Player({ player }) {
  return (
    <div className="flex justify-between">
      <span className="text-green-500">{player.name}</span>
      <span className="ml-3 text-yellow-400">{player.score} pnts</span>
    </div>
  );
}

const roomData = {
  players: [
    { name: "John", score: 85 },
    { name: "Emily", score: 92 },
    { name: "David", score: 78 },
    { name: "Sophia", score: 89 },
    { name: "Michael", score: 91 },
  ],
};

function Canvas() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [isEraser, setIsEraser] = useState(false);
  const [brushWidth, setBrushWidth] = useState(2);

  function startDrawing(e) {
    setIsDrawing(true);
    let x;
    let y;
    if (e.touches) {
      x = e.pageX || e.touches[0].clientX;
      y = e.pageY || e?.touches[0].clientY;
    } else {
      x = e.pageX;
      y = e.pageY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    console.log(ctx);
    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
    return false;
  }

  function draw(e) {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x;
    let y;
    if (e.touches) {
      x = e.pageX || e.touches[0].clientX;
      y = e.pageY || e?.touches[0].clientY;
    } else {
      x = e.pageX;
      y = e.pageY;
    }

    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
    return false;
  }

  function stopDrawing(e) {
    setIsDrawing(false);
    ctx.closePath();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.height = 450;
    canvas.width = rect.right - rect.left;
    const c = canvas.getContext("2d");
    c.strokeStyle = color;
    c.lineWidth = brushWidth;
    c.lineCap = "round";
    setCtx(c);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    const c = ctx;

    if (isEraser) {
      c.strokeStyle = "#020617";
    } else c.strokeStyle = color;

    c.lineWidth = brushWidth;
    setCtx(c);
  }, [color, isEraser, brushWidth]);

  function changeColor(clr) {
    setIsEraser(false);
    setColor(clr);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="w-full h-fit relative">
      <canvas
        ref={canvasRef}
        id="canvas"
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        className="bg-slate-950 w-full h-[450px] overflow-hidden"
      ></canvas>

      <ColorPicker
        setColor={changeColor}
        clearCanvas={clearCanvas}
        setIsEraser={setIsEraser}
        setBrushWidth={setBrushWidth}
      ></ColorPicker>
    </div>
  );
}

function GuessAndChat() {
  return (
    <div className="w-full h-full flex flex-col justify-end max-w-[500px]">
      <div className="h-12 ">
        <form className="flex justify-between items-center p-3">
          <input
            type="text"
            className="outline-none bg-black text-green-500 placeholder:text-green-700 w-full"
            placeholder="guess/chat"
          />
          <button className="text-green-500">.</button>
        </form>
      </div>
    </div>
  );
}

function ColorPicker({ setColor, clearCanvas, setIsEraser, setBrushWidth }) {
  return (
    <div className="h-fit w-fit mx-auto flex p-2 gap-2 mt-3 flex-wrap justify-center items-center">
      <div
        className="active:opacity-50 h-6 w-6 bg-red-500 cursor-pointer"
        onClick={() => setColor("#EF4444")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-green-500 cursor-pointer"
        onClick={() => setColor("#22C55E")}
      ></div>
      {/* fasfasfdads */}
      <div
        className="active:opacity-50 h-6 w-6 bg-amber-900 cursor-pointer"
        onClick={() => setColor("#78350f")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-blue-500 cursor-pointer"
        onClick={() => setColor("#3b82f6")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-orange-500 cursor-pointer"
        onClick={() => setColor("#f97316")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-yellow-500 cursor-pointer"
        onClick={() => setColor("#eab308")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-pink-500 cursor-pointer"
        onClick={() => setColor("#ec4899")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-white cursor-pointer"
        onClick={() => setColor("#FFFFFF")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-cyan-500 cursor-pointer"
        onClick={() => setColor("#06b6d4")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-violet-500 cursor-pointer"
        onClick={() => setColor("#8b5cf6")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-teal-500 cursor-pointer"
        onClick={() => setColor("#14b8a6")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-amber-500 cursor-pointer"
        onClick={() => setColor("#f59e0b")}
      ></div>
      <div
        onClick={() => setIsEraser(true)}
        className="active:opacity-50 h-6 w-6 flex items-center justify-center border-green-500 border-2 cursor-pointer"
      >
        <BsEraserFill className="fill-green-500"></BsEraserFill>
      </div>
      <div
        onClick={clearCanvas}
        className="active:opacity-50 h-6 w-6 flex items-center justify-center border-2 border-green-500 cursor-pointer"
      >
        <MdDelete className="fill-green-500"></MdDelete>
      </div>

      <div
        onClick={() => setBrushWidth(2)}
        className="h-6 w-6  flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-1 w-1 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(4)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(8)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(16)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(32)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-5 w-5 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(64)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-6 w-6 rounded-full bg-green-500"></div>
      </div>
    </div>
  );
}
