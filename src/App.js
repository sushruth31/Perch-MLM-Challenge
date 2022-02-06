import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Create from "./create";

function App() {
  return (
    <>
      <div className="flex justify-center w-screen h-screen p-[20px]">
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit" element={<Create />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
