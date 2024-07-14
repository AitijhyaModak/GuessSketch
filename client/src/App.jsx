import GameConfiguration from "./components/GameConfiguration";
import Game from "./components/Game";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [roomState, setRoomState] = useState({});
  return (
    <div className="font-quicksand">
      <Toaster toastOptions={{ duration: 1000 }}></Toaster>
      {!inRoom && (
        <GameConfiguration
          setInRoom={setInRoom}
          setRoomState={setRoomState}
        ></GameConfiguration>
      )}
      {inRoom && (
        <Game roomState={roomState} setRoomState={setRoomState}></Game>
      )}
    </div>
  );
}

export default App;
