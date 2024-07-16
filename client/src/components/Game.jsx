import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { SocketContext } from "../context/socket";
import Canvas from "./Canvas";
import PlayersList from "./PlayerList";
import GuessAndChat from "./GuessAndChat";

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
    <div className="h-[100dvh] flex flex-col relative items-center w-full">
      {showWord && (
        <Word
          turnIndex={roomState.turnIndex}
          word={roomState.currentWord}
          players={roomState.players}
          id={socket.id}
        ></Word>
      )}

      <Canvas roomState={roomState} socket={socket}></Canvas>

      <div className="flex h-full w-full overflow-hidden">
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
