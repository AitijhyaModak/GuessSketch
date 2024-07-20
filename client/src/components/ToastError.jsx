export default function ToastError({ message, t }) {
  return (
    <div
      className={`w-fit px-5 py-3 bg-black font-semibold text-red-500 border-2 border-red-500 ${
        t.visible ? "animate-enter" : "animate-exit"
      }`}
    >
      {message}
    </div>
  );
}
