import { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import { SocketContext } from "../context/socket";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const emptyForm1 = {
  playerName: "",
  roomName: "",
  password: "",
  totalPlayers: 2,
  rounds: 2,
};
const emptyForm2 = {
  roomName: "",
  password: "",
};

export default function GameConfiguration({
  setInRoom,
  setRoomState,
  setUsername,
}) {
  const socket = useContext(SocketContext);
  const [formData1, setFormData1] = useState(emptyForm1);
  const [formData2, setFormData2] = useState(emptyForm2);

  const handleSubmit = (e, type) => {
    e.preventDefault();

    if (formData1.playerName === "") {
      toast.error("Username is required !!");
      return;
    }

    if (formData1.playerName.length < 3) {
      toast.error("Username must be atleast 3 letters long !!");
      return;
    }

    setUsername(formData1.playerName);

    if (type === "create") {
      if (formData1.roomName === "" || formData1.password === "") {
        toast.error("Credentials cannot be empty !!");
        return;
      }

      socket.emit("create-room", formData1);
      setFormData1(emptyForm1);
    } else {
      if (formData2.roomName === "" || formData2.password === "") {
        toast.error("Credentials cannot be empty !!");
        return;
      }

      socket.emit("join-room", {
        ...formData2,
        playerName: formData1.playerName,
      });
      setFormData2(emptyForm2);
    }
  };

  useEffect(() => {
    socket.on("success-created-room", (roomData) => {
      toast.custom((t) => (
        <SuccessToast message={"Room created and joined"} t={t}></SuccessToast>
      ));
      setInRoom(true);
      setRoomState(roomData);
    });

    socket.on("success-joined-room", (roomData) => {
      toast.custom((t) => {
        <SuccessToast message={"Room joined"} t={t}></SuccessToast>;
      });
      setInRoom(true);
      setRoomState(roomData);
    });

    socket.on("error", (message) => {
      toast.custom((t) => <ErrorToast message={message} t={t}></ErrorToast>);
    });
  }, [socket]);

  return (
    <>
      <Navbar></Navbar>

      <div className="w-fit mx-auto curs">
        <Link to="about" clas>
          <div className="text-green-300 w-fit mx-auto">how to play?</div>
        </Link>
      </div>

      <div className="max-w-[500px] mt-6 mx-auto p-4 flex flex-col justify-center">
        <input
          type="text"
          value={formData1.playerName}
          onChange={(e) =>
            setFormData1({ ...formData1, playerName: e.target.value })
          }
          placeholder="click to set username"
          className="outline-none text-green-500 bg-black w-fit mx-auto mb-10 h-10 placeholder:text-green-700 text-center"
        />

        <form className="flex flex-col ">
          <input
            value={formData1.roomName}
            onChange={(e) =>
              setFormData1({ ...formData1, roomName: e.target.value })
            }
            type="text"
            className="text-center text-green-500 outline-none bg-black w-3/4 mx-auto h-10 rounded-lg px-2 placeholder:text-green-700"
            placeholder="click to set room name"
          />
          <input
            value={formData1.password}
            onChange={(e) =>
              setFormData1({ ...formData1, password: e.target.value })
            }
            type="password"
            placeholder="click to set room password"
            className="text-center text-green-500 outline-none bg-black w-3/4 mx-auto mt-4 h-10 rounded-lg px-2 placeholder:text-green-700"
          />
          <div className="flex gap-3 justify-center mt-4">
            <span className="text-green-700">rounds:</span>
            <input
              value={formData1.rounds}
              onChange={(e) =>
                setFormData1({ ...formData1, rounds: e.target.value })
              }
              type="number"
              min={1}
              max={4}
              placeholder="2"
              className="text-center bg-black outline-none placeholder:text-green-700 text-green-500"
            />
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <span className="text-green-700">players:</span>
            <input
              value={formData1.totalPlayers}
              onChange={(e) =>
                setFormData1({ ...formData1, totalPlayers: e.target.value })
              }
              type="number"
              min={2}
              max={5}
              placeholder="2"
              className="text-center bg-black outline-none placeholder:text-green-700 text-green-500
              "
            />
          </div>
          <button
            className="mt-7 w-3/4 mx-auto h-10 rounded-lg px-2 text-green-500"
            onClick={(e) => handleSubmit(e, "create")}
          >
            click to create room
          </button>
        </form>

        <form className="mt-20 flex flex-col">
          <input
            value={formData2.roomName}
            type="text"
            onChange={(e) =>
              setFormData2({ ...formData2, roomName: e.target.value })
            }
            placeholder="click to enter room name"
            className="text-center text-green-500 outline-none bg-black w-3/4 mx-auto h-10 rounded-lg px-2 placeholder:text-green-700"
          />
          <input
            type="password"
            value={formData2.password}
            onChange={(e) =>
              setFormData2({ ...formData2, password: e.target.value })
            }
            placeholder="click to enter room password"
            className="mt-4 text-center text-green-500 outline-none bg-black w-3/4 mx-auto h-10 rounded-lg px-2 placeholder:text-green-700"
          />
          <button
            onClick={(e) => handleSubmit(e, "join")}
            className="mt-7 w-3/4 mx-auto h-10 rounded-lg px-2 text-green-500"
          >
            click to join room
          </button>
        </form>
      </div>
    </>
  );
}

function SuccessToast({ message, t }) {
  return (
    <div
      className={`bg-black text-green-500 py-4 rounded-lg px-4 opacity:60 ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      Room created and joined
    </div>
  );
}

function ErrorToast({ message, t }) {
  return (
    <div
      className={`bg-black text-red-500 py-4 rounded-lg px-4 opacity:60 ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      {message}
    </div>
  );
}
