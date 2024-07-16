import GameConfiguration from "./components/GameConfiguration";
import Game from "./components/Game";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [roomState, setRoomState] = useState({});
  const [username, setUsername] = useState("");

  return (
    <div className="font-quicksand h-[100dvh]">
      <Toaster toastOptions={{ duration: 1000 }}></Toaster>
      {!inRoom && (
        <GameConfiguration
          setUsername={setUsername}
          setInRoom={setInRoom}
          setRoomState={setRoomState}
        ></GameConfiguration>
      )}
      {inRoom && (
        <Game
          username={username}
          roomState={roomState}
          setRoomState={setRoomState}
        ></Game>
      )}
    </div>
  );
}

export default App;
