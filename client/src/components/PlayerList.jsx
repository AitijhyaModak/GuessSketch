export default function PlayersList({ roomState }) {
  return (
    <div className="min-w-fit flex flex-col justify-end pb-3 mr-5 pl-5">
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
