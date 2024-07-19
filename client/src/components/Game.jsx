import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/socket";
import Canvas from "./Canvas";
import PlayersList from "./PlayerList";
import GuessAndChat from "./GuessAndChat";
import EndLeaderboard from "./EndLeaderboard";

export default function Game({ roomState, setRoomState, username, setInRoom }) {
  const socket = useContext(SocketContext);
  const [showWord, setShowWord] = useState(false);
  const [notifs, setNotifs] = useState([
    { message: "you joined", index: 0, type: "join-notif" },
  ]);
  const [didGuess, setDidGuess] = useState(false);
  const [time, setTime] = useState(95);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    socket.on("update-player-joined", (data) => {
      setRoomState(data.roomData);
      setNotifs((prevState) => [...prevState, data.notif]);
    });

    socket.on("notif", (notif) => {
      setNotifs((prevState) => [...prevState, notif]);
    });

    socket.on("update-start-game", (data) => {
      setRoomState(data.roomData);
      setShowWord(true);
      DisplayInformationBetweenTurns();
      setTime(95);
    });

    socket.on("update-nextturn", (data) => {
      setRoomState(data.roomData);
      setTime(95);
      setDidGuess(false);
      DisplayInformationBetweenTurns();
      setShowWord(true);
    });

    socket.on("guess-score-update", (data) => {
      setRoomState(data.roomData);
    });

    socket.on("end-game", (data) => {
      setShowLeaderboard(true);
      setShowWord(false);
      setRoomState(data.roomData);
    });

    socket.on("room-update", (data) => {
      setRoomState(data.roomData);
    });
  }, [socket]);

  function DisplayInformationBetweenTurns() {
    setShowInfo(true);
    setInterval(() => {
      setShowInfo(false);
    }, 5000);
  }

  return (
    <div className="h-[100dvh] flex flex-col relative items-center w-full">
      {showLeaderboard && (
        <EndLeaderboard
          name={roomState.name}
          socket={socket}
          players={roomState.players}
          setInRoom={setInRoom}
        ></EndLeaderboard>
      )}

      {!showInfo && showWord && !didGuess && (
        <Word
          turnIndex={roomState.turnIndex}
          word={roomState.currentWord}
          players={roomState.players}
          id={socket.id}
        ></Word>
      )}

      {!showInfo && showWord && (
        <Timer
          setShowWord={setShowWord}
          roomName={roomState.name}
          socket={socket}
          word={roomState.currentWord}
          id={roomState.players[roomState.turnIndex].socketId}
          time={time}
          setTime={setTime}
        ></Timer>
      )}

      <Canvas
        roomState={roomState}
        socket={socket}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      ></Canvas>

      <div className="flex h-full w-full overflow-hidden">
        <PlayersList roomState={roomState}></PlayersList>
        <GuessAndChat
          username={username}
          notifs={notifs}
          id={socket.id}
          time={time}
          setNotifs={setNotifs}
          roomState={roomState}
          didGuess={didGuess}
          setDidGuess={setDidGuess}
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
    <div className="absolute bg-white top-3 left-3 z-10 h-10 items-center flex p-3">
      {handleShowWord()}
    </div>
  );
}

function Timer({ setShowWord, roomName, socket, id, word, time, setTime }) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (time <= 0) {
        setShowWord(false);
        if (socket.id == id) socket.emit("time-finish", { roomName, word });
        return;
      }
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <div className="absolute bg-white top-3 right-3 z-10 h-10 items-center flex p-3">
      {time} s
    </div>
  );
}
