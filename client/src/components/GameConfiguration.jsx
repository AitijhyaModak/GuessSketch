export default function GameConfiguration() {
  return (
    <div className="max-w-[500px] mt-10 mx-auto p-4">
      <form className="flex flex-col">
        <input
          type="text"
          className="text-center text-green-500 outline-none bg-black w-3/4 mx-auto h-10 rounded-lg px-2 placeholder:text-green-700"
          placeholder="click to set room name"
        />
        <input
          type="password"
          placeholder="click to set room password"
          className="text-center text-green-500 outline-none bg-black w-3/4 mx-auto mt-4 h-10 rounded-lg px-2 placeholder:text-green-700"
        />
        <button className="mt-7 w-3/4 mx-auto h-10 rounded-lg px-2 text-green-500">
          click to create room
        </button>
      </form>

      <form className="mt-20 flex flex-col">
        <input
          type="text"
          placeholder="click to enter room name"
          className="text-center text-green-500 outline-none bg-black w-3/4 mx-auto h-10 rounded-lg px-2 placeholder:text-green-700"
        />
        <input
          type="password"
          placeholder="click to enter password"
          className="mt-4 text-center text-green-500 outline-none bg-black w-3/4 mx-auto h-10 rounded-lg px-2 placeholder:text-green-700"
        />
        <button className="mt-7 w-3/4 mx-auto h-10 rounded-lg px-2 text-green-500">
          click to join room
        </button>
      </form>
    </div>
  );
}
