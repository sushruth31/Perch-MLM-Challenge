import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "./store";
import "bootstrap/dist/css/bootstrap.css";
import { BackDrop } from "./modal";
import { LinearProgress } from "@mui/material";

function AppLoading() {
  return (
    <>
      <LinearProgress />
      <div className="w-screen h-screen flex items-center justify-center ">
        <div className="font-bold">Getting your data...</div>
      </div>
    </>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <Suspense fallback={<AppLoading />}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Suspense>
  </BrowserRouter>,

  document.getElementById("root")
);
