export default function EndLeaderboard({ players, setInRoom, socket, name }) {
  async function exitRoom() {
    setInRoom(false);
    socket.emit("leave-room", { roomName: name });
  }

  return (
    <div className="absolute z-50 bg-black w-[90%] h-full border-2 border-yellow-500 rounded-lg">
      <h1 className="text-green-500 text-4xl text-center mt-10">Leaderboard</h1>
      <div className="flex flex-col justify-center items-center gap-5 mt-20 ">
        {players
          .sort((a, b) => {
            return b.score - a.score;
          })
          .map((player) => (
            <Entry key={player.socketId} player={player}></Entry>
          ))}
      </div>
      <div className="w-full flex justify-center mt-20">
        <button onClick={exitRoom} className="bg-red-500 w-20 h-10 rounded-lg">
          Exit
        </button>
      </div>
      <p className="text-red-400 mt-10 text-center text-wrap italic">
        <span className="font-bold text-yellow-500 text-xl not-italic">
          Note:{" "}
        </span>
        If the game did not end, it implies all players except you left the game
        !!
      </p>
    </div>
  );
}

function Entry({ player }) {
  return (
    <div className="text-2xl first:border-2 p-3 border-dotted border-yellow-400">
      <span className="text-orange-800">{player.username}</span>
      <span className="text-yellow-500 italic ml-5">{player.score}</span>
    </div>
  );
}
