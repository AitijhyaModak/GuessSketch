import { useContext, useState, useRef, useEffect } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { SocketContext } from "../context/socket";

export default function GuessAndChat({
  notifs,
  setNotifs,
  roomState,
  username,
  didGuess,
  setDidGuess,
  id,
  time,
}) {
  const scrollRef = useRef(null);
  const [typed, setTyped] = useState("");
  const socket = useContext(SocketContext);

  const sendMessage = (e) => {
    e.preventDefault();

    if (
      roomState.gameStarted &&
      roomState.players[roomState.turnIndex].socketId === id
    )
      return;

    if (
      roomState.gameStarted &&
      !didGuess &&
      typed.toLowerCase() === roomState.currentWord
    ) {
      setDidGuess(true);
      setNotifs((prevState) => [
        ...prevState,
        { message: "you guessed the word !", type: "imp-notif" },
      ]);
      const guessData = {
        roomName: roomState.name,
        message: typed,
        word: roomState.currentWord,
        username: username,
        type: "message-notif",
        addScore: time * 2,
      };

      socket.emit("guess", guessData);
      setTyped("");
      return;
    }

    if (
      roomState.gameStarted &&
      didGuess &&
      typed.toLowerCase() === roomState.currentWord
    )
      return;

    const notif = {
      type: "message-notif",
      senderName: "you",
      message: typed,
      roomName: roomState.name,
    };
    setNotifs((prevState) => [...prevState, notif]);
    setTyped("");
    notif.senderName = username;
    socket.emit("notif", notif);
  };

  useEffect(() => {
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [notifs]);

  return (
    <div className="w-full overflow-x-hidden flex flex-col justify-between h-full">
      <div
        ref={scrollRef}
        className="h-full p-3 overflow-hidden overflow-y-scroll w-full"
      >
        {notifs.map((item, index) => (
          <Notification notif={item} key={index}></Notification>
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

function Notification({ notif }) {
  function handleNotif() {
    switch (notif.type) {
      case "join-notif":
        return (
          <span className="text-yellow-500 italic text-wrap">
            {notif.message}
          </span>
        );
      case "leave-notif":
        return (
          <span className="text-red-500 italic text-wrap">{notif.message}</span>
        );
      case "message-notif":
        return (
          <>
            <span className="mr-2 text-blue-600 italic text-wrap">
              {notif.senderName}:
            </span>
            <span className="text-orange-600 text-wrap">{notif.message}</span>
          </>
        );
      case "imp-notif":
        return <span className="text-pink-500 text-wrap">{notif.message}</span>;

      default:
        return null;
    }
  }

  return <div className="text-wrap mb-2">{handleNotif()}</div>;
}
