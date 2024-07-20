import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../context/socket";
import Canvas from "./Canvas";
import PlayersList from "./PlayerList";
import GuessAndChat from "./GuessAndChat";
import EndLeaderboard from "./EndLeaderboard";
import { Howl } from "howler";
import playerJoin from "../sounds/playerJoin.mp3";
import playerGuessed from "../sounds/playerGuessed.mp3";
import playerLeft from "../sounds/playerLeft.mp3";
import turnStart from "../sounds/turnStart.mp3";
import gameEnd from "../sounds/gameEnd.mp3";

const joinSound = new Howl({
  src: [playerJoin],
  html5: true,
});

const gameEndSound = new Howl({
  src: [gameEnd],
  html5: true,
});

const guessSound = new Howl({
  src: [playerGuessed],
  html5: true,
});

const leftSound = new Howl({
  src: [playerLeft],
  html5: true,
});

const turnStartSound = new Howl({
  src: [turnStart],
  html5: true,
});

export default function Game({ roomState, setRoomState, username, setInRoom }) {
  const socket = useContext(SocketContext);
  const [showWord, setShowWord] = useState(false);
  const [notifs, setNotifs] = useState([
    { message: "you joined", index: 0, type: "join-notif" },
  ]);
  const [didGuess, setDidGuess] = useState(false);
  const [time, setTime] = useState(90);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    async function handleStartGameOrNextTurn(data) {
      turnStartSound.play();
      setRoomState(data.roomData);
      setDidGuess(false);
      setShowInfo(true);
      await delay(4500);
      setShowInfo(false);
      setShowWord(true);
      setTime(90);
    }

    function handleUpdatePlayerJoined(data) {
      joinSound.play();
      setRoomState(data.roomData);
      setNotifs((prevState) => [...prevState, data.notif]);
    }

    function handleNotif(notif) {
      if (notif.type === "leave-notif") leftSound.play();
      setNotifs((prevState) => [...prevState, notif]);
    }

    function handleGuessScoreUpdate(data) {
      guessSound.play();
      setRoomState(data.roomData);
    }

    function handleEndGame(data) {
      gameEndSound.play();
      setShowLeaderboard(true);
      setShowWord(false);
      setRoomState(data.roomData);
    }

    function handleRoomUpdate(data) {
      setRoomState(data.roomData);
    }

    async function delay(ms) {
      return await new Promise((res) => setTimeout(res, ms));
    }

    socket.on("update-player-joined", handleUpdatePlayerJoined);
    socket.on("notif", handleNotif);
    socket.on("update-start-game", handleStartGameOrNextTurn);
    socket.on("update-nextturn", handleStartGameOrNextTurn);
    socket.on("guess-score-update", handleGuessScoreUpdate);
    socket.on("end-game", handleEndGame);
    socket.on("room-update", handleRoomUpdate);

    return () => {
      socket.off("update-player-joined", handleUpdatePlayerJoined);
      socket.off("notif", handleNotif);
      socket.off("update-start-game", handleStartGameOrNextTurn);
      socket.off("update-nextturn", handleStartGameOrNextTurn);
      socket.off("guess-score-update", handleGuessScoreUpdate);
      socket.off("end-game", handleEndGame);
      socket.off("room-update", handleRoomUpdate);
    };
  }, [socket, setRoomState]);

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
          id={roomState.players[roomState.turnIndex]?.socketId}
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
  const savedCallback = useRef();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    savedCallback.current = () => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor(
        (currentTime - startTimeRef.current) / 1000
      );
      const newTime = time - elapsedTime;

      if (newTime <= 0) {
        setShowWord(false);
        if (socket.id === id) socket.emit("time-finish", { roomName, word });
        setTime(0);
      } else setTime(newTime);

      startTimeRef.current = currentTime;
    };
  }, [time, setTime, setShowWord, roomName, socket, id, word]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (savedCallback.current) savedCallback.current();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <div className="absolute bg-white top-3 right-3 z-10 h-10 items-center flex p-3">
      {time} s
    </div>
  );
}
