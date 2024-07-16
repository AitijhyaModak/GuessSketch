import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { BsEraserFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { io } from "socket.io-client";
import { SocketContext } from "../context/socket";
import { AiOutlineEnter } from "react-icons/ai";

export default function Game({ roomState, setRoomState, username }) {
  const socket = useContext(SocketContext);
  const [showWord, setShowWord] = useState(false);
  const [notifs, setNotifs] = useState([
    { message: "you joined", index: 0, type: "join-notif" },
  ]);

  useEffect(() => {
    socket.on("update-player-joined", (data) => {
      data.notif.index = notifs.length;
      setRoomState(data.roomData);
      setNotifs((prevState) => [...prevState, data.notif]);
    });

    socket.on("notif", (notif) => {
      notif.index = notifs.length;
      setNotifs((prevState) => [...prevState, notif]);
    });

    socket.on("update-start-game", (data) => {
      setRoomState(data.roomData);
      data.notif1.index = notifs.length;
      data.notif2.index = notifs.length + 1;
      setNotifs((prevState) => [...prevState, data.notif1, data.notif2]);
      setShowWord(true);
    });
  }, [socket]);

  return (
    <div className="h-[100dvh] flex flex-col overflow relative">
      {showWord && (
        <Word
          turnIndex={roomState.turnIndex}
          word={roomState.currentWord}
          players={roomState.players}
          id={socket.id}
        ></Word>
      )}
      <div className="w-full">
        <Canvas roomState={roomState} socket={socket}></Canvas>
      </div>

      <div className="flex justify-between h-full overflow-hidden">
        <PlayersList roomState={roomState}></PlayersList>
        <GuessAndChat
          username={username}
          notifs={notifs}
          setNotifs={setNotifs}
          roomState={roomState}
        ></GuessAndChat>
      </div>
    </div>
  );
}

function PlayersList({ roomState }) {
  return (
    <div className="min-w-fit w-[5%] flex flex-col justify-end pb-3 mr-5 pl-5">
      {roomState.players.map((item) => (
        <Player player={item} key={item.id}></Player>
      ))}
    </div>
  );
}
function Player({ player }) {
  return (
    <div className="flex justify-between">
      <span className="text-green-500">{player.username}</span>
      <span className="ml-3 text-yellow-400">{player.score} pnts</span>
    </div>
  );
}

function Canvas({ socket, roomState }) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawerCtx, setDrawerCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [isEraser, setIsEraser] = useState(false);
  const [brushWidth, setBrushWidth] = useState(2);
  // const [i, setI] = useState(1);

  useEffect(() => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (drawerCtx) {
      socket.on("start-drawing", (data) => {
        console.log(drawerCtx);
        drawerCtx.beginPath();
        drawerCtx.moveTo(data.x - rect.left, data.y - rect.top);
      });

      socket.on("draw", (data) => {
        drawerCtx.lineTo(data.x - rect.left, data.y - rect.top);
        drawerCtx.stroke();
      });

      socket.on("stop-drawing", (data) => {
        drawerCtx.closePath();
      });
    }
  }, [drawerCtx, socket]);

  function startDrawing(e) {
    if (
      roomState.gameStarted &&
      socket.id != roomState.players[roomState.turnIndex].socketId
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

    socket.emit("start-drawing", { x: x, y: y, roomName: roomState.name });
    return false;
  }

  function draw(e) {
    if (!isDrawing) return;
    if (
      roomState.gameStarted &&
      socket.id != roomState.players[roomState.turnIndex].socketId
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

    socket.emit("draw", { x: x, y: y, roomName: roomState.name });
    return false;
  }

  function stopDrawing(e) {
    if (
      roomState.gameStarted &&
      socket.id != roomState.players[roomState.turnIndex].socketId
    )
      return;
    setIsDrawing(false);
    ctx.closePath();
    socket.emit("stop-drawing", { roomName: roomState.name });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.height = 600;
    // canvas.width = 800;
    const c = canvas.getContext("2d");
    c.strokeStyle = color;
    c.lineWidth = brushWidth;
    c.lineCap = "round";
    setDrawerCtx(c);
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
        width={800}
        className="bg-slate-950  mx-auto h-[600px] overflow-hidden text-green-500"
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

function GuessAndChat({ notifs, setNotifs, roomState, username }) {
  const scrollRef = useRef(null);
  const [typed, setTyped] = useState("");
  const socket = useContext(SocketContext);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("notif", {
      roomName: roomState.name,
      message: typed,
      username: username,
      type: "message-notif",
    });
    const notif = {
      type: "message-notif",
      senderName: "you",
      message: typed,
      index: notifs.length,
    };
    setNotifs((prevState) => [...prevState, notif]);
    setTyped("");
  };

  useEffect(() => {
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [notifs]);

  return (
    <div className="w-full h-full flex flex-col justify-between max-w-[800px] ">
      <div
        ref={scrollRef}
        className="h-full max-h-full p-3 overflow-hidden overflow-y-scroll"
      >
        {notifs.map((item) => (
          <Notification notif={item} key={item.index}></Notification>
        ))}
      </div>
      <form className="h-12 flex items-center p-3">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          type="text"
          className="outline-none w-28 mr-5 bg-black text-green-500 placeholder:text-green-700"
          placeholder="guess/chat"
        />
        <button onClick={(e) => sendMessage(e)} className="text-green-500">
          <AiOutlineEnter></AiOutlineEnter>
        </button>
      </form>
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

function Notification({ notif }) {
  function handleNotif() {
    switch (notif.type) {
      case "join-notif":
        return <span className="text-yellow-500 italic">{notif.message}</span>;
      case "leave-notif":
        return <span className="text-red-500 italic">{notif.message}</span>;
      case "message-notif":
        return (
          <>
            <span className="mr-2 text-blue-600 italic">
              {notif.senderName}:
            </span>
            <span className="text-orange-600">{notif.message}</span>
          </>
        );
      case "imp-notif":
        return <span className="text-pink-500">{notif.message}</span>;

      default:
        return null;
    }
  }

  return <div className="">{handleNotif()}</div>;
}

function Word({ word, players, turnIndex, id }) {
  function handleShowWord() {
    if (players[turnIndex].socketId !== id) {
      let temp = "";
      for (let i = 0; i < word.length; i++) temp += "_ ";
      return temp;
    }
    return word;
  }

  return (
    <div className="absolute bg-white border-2 top-3 left-3 z-10 h-10 items-center flex p-3">
      {handleShowWord()}
    </div>
  );
}
