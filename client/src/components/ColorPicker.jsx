import { BsEraserFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

export function ColorPicker({
  setColor,
  clearCanvas,
  setIsEraser,
  setBrushWidth,
}) {
  return (
    <div className="h-fit w-fit mx-auto flex p-2 gap-2 mt-3 flex-wrap justify-center items-center">
      <div
        className="active:opacity-50 h-6 w-6 bg-red-500 cursor-pointer"
        onClick={() => setColor("#EF4444")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-green-500 cursor-pointer"
        onClick={() => setColor("#22C55E")}
      ></div>
      {/* fasfasfdads */}
      <div
        className="active:opacity-50 h-6 w-6 bg-amber-900 cursor-pointer"
        onClick={() => setColor("#78350f")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-blue-500 cursor-pointer"
        onClick={() => setColor("#3b82f6")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-orange-500 cursor-pointer"
        onClick={() => setColor("#f97316")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-yellow-500 cursor-pointer"
        onClick={() => setColor("#eab308")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-pink-500 cursor-pointer"
        onClick={() => setColor("#ec4899")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-white cursor-pointer"
        onClick={() => setColor("#FFFFFF")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-cyan-500 cursor-pointer"
        onClick={() => setColor("#06b6d4")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-violet-500 cursor-pointer"
        onClick={() => setColor("#8b5cf6")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-teal-500 cursor-pointer"
        onClick={() => setColor("#14b8a6")}
      ></div>
      <div
        className="active:opacity-50 h-6 w-6 bg-amber-500 cursor-pointer"
        onClick={() => setColor("#f59e0b")}
      ></div>
      <div
        onClick={() => setIsEraser(true)}
        className="active:opacity-50 h-6 w-6 flex items-center justify-center border-green-500 border-2 cursor-pointer"
      >
        <BsEraserFill className="fill-green-500"></BsEraserFill>
      </div>
      <div
        onClick={clearCanvas}
        className="active:opacity-50 h-6 w-6 flex items-center justify-center border-2 border-green-500 cursor-pointer"
      >
        <MdDelete className="fill-green-500"></MdDelete>
      </div>

      <div
        onClick={() => setBrushWidth(2)}
        className="h-6 w-6  flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-1 w-1 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(4)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(8)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(16)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(32)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-5 w-5 rounded-full bg-green-500"></div>
      </div>

      <div
        onClick={() => setBrushWidth(64)}
        className="h-6 w-6 flex justify-center items-center cursor-pointer active:opacity-50"
      >
        <div className="h-6 w-6 rounded-full bg-green-500"></div>
      </div>
    </div>
  );
}
