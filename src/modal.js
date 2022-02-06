export function BackDrop({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#000000a4] fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-40">
      {children}
    </div>
  );
}

export default function Modal({ modalComponent, onClick }) {
  return (
    <BackDrop onClick={onClick}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-[400px] rounded-xl bg-white fixed h-[400px] p-[10px], overflow-y-auto z-10000">
        {modalComponent}
      </div>
    </BackDrop>
  );
}
