export default function ToastSuccess({ message, t }) {
  return (
    <div className="w-fit px-5 py-3 bg-black font-semibold text-green-500 border-2 border-green-500">
      {message}
    </div>
  );
}

//t.visible ? "animate-enter" : "animate-leave"
