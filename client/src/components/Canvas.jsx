import { useContext, useState, useEffect, useRef } from "react";
import { SocketContext } from "../context/socket";
import { ColorPicker } from "./ColorPicker";

export default function Canvas({ roomState, showInfo, setShowInfo }) {
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawerCtx, setDrawerCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [isEraser, setIsEraser] = useState(false);
  const [brushWidth, setBrushWidth] = useState(2);

  useEffect(() => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (ctx && drawerCtx) {
      socket.on("update-nextturn", () => {
        resetCanvas();
      });

      socket.on("start-drawing", (data) => {
        drawerCtx.beginPath();
        drawerCtx.moveTo(
          data.x * rect.width - rect.left,
          data.y * rect.height - rect.top
        );
      });

      socket.on("draw", (data) => {
        drawerCtx.lineTo(
          data.x * rect.width - rect.left,
          data.y * rect.height - rect.top
        );
        drawerCtx.stroke();
      });

      socket.on("stop-drawing", (data) => {
        drawerCtx.closePath();
      });

      socket.on("brush-change", (data) => {
        const c = drawerCtx;
        c.lineWidth = data.brushWidth;
        c.strokeStyle = data.color;
        setDrawerCtx(c);
      });

      socket.on("clear-canvas", () => {
        drawerCtx.clearRect(0, 0, rect.right - rect.left, 450);
      });
    }
  }, [drawerCtx, socket, ctx]);

  function startDrawing(e) {
    if (
      roomState.gameStarted &&
      socket.id !== roomState.players[roomState.turnIndex].socketId
    )
      return;
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
    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
    socket.emit("start-drawing", {
      x: x / rect.width,
      y: y / rect.height,
      roomName: roomState.name,
    });
    return false;
  }

  function draw(e) {
    if (!isDrawing) return;
    if (
      roomState.gameStarted &&
      socket.id !== roomState.players[roomState.turnIndex].socketId
    )
      return;
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

    socket.emit("draw", {
      x: x / rect.width,
      y: y / rect.height,
      roomName: roomState.name,
    });
    return false;
  }

  function stopDrawing(e) {
    if (
      roomState.gameStarted &&
      socket.id !== roomState.players[roomState.turnIndex].socketId
    )
      return;
    setIsDrawing(false);
    ctx.closePath();
    socket.emit("stop-drawing", { roomName: roomState.name });
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
    setDrawerCtx(c);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    const c = ctx;

    if (isEraser) {
      c.strokeStyle = "#020617";
    } else c.strokeStyle = color;

    c.lineWidth = brushWidth;

    if (
      roomState.gameStarted &&
      roomState.players[roomState.turnIndex].socketId === socket.id
    ) {
      socket.emit("brush-change", {
        brushWidth,
        color: c.strokeStyle,
        roomName: roomState.name,
      });
    }

    setCtx(c);
  }, [color, isEraser, brushWidth]);

  function changeColor(clr) {
    setIsEraser(false);
    setColor(clr);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.right - rect.left, 450);
    socket.emit("clear-canvas", { roomName: roomState.name });
  }

  function resetCanvas() {
    const canvas = canvasRef.current;
    console.log(canvas);
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.right - rect.left, 450);
    const c = canvas.getContext("2d");
    c.strokeStyle = "#FFFFFF";
    c.lineWidth = 2;
    c.lineCap = "round";
    setCtx(c);
    setDrawerCtx(c);
  }

  return (
    <div className="w-full h-fit relative">
      {showInfo && (
        <div className="w-full h-[450px] bg-black opacity-70 absolute top-0 left-0 z-20 flex justify-center items-center">
          {!roomState.gameStarted && <WaitingLobbyInfo></WaitingLobbyInfo>}
          {roomState.gameStarted && (
            <TurnStartLobbyInfo
              word={roomState.currentWord}
              player={roomState.players[roomState.turnIndex]}
            ></TurnStartLobbyInfo>
          )}
        </div>
      )}

      <canvas
        ref={canvasRef}
        id="canvas"
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        className="bg-slate-900 w-full h-[450px]"
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

function WaitingLobbyInfo() {
  return (
    <div className="text-center">
      <h1 className="text-green-500 text-3xl">You have joined the room !!</h1>
      <p className="text-green-600 mt-5">
        Game will start when all the players join ...
      </p>
    </div>
  );
}

function TurnStartLobbyInfo({ player, word }) {
  return (
    <div className="text-center">
      <h1 className="text-green-400 text-3xl">
        {player.username} will be drawing now !
      </h1>
      <p className="text-green-500 mt-5 text-lg">
        The word is of <span className="font-bold">{word.length}</span> letters
      </p>
    </div>
  );
}
