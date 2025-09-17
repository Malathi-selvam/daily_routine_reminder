import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./assets/Login/Login";
import Home from "./assets/Components/Home";
import MyTask from "./assets/Components/MyTask";
import NewTask from "./assets/Components/NewTask";
import Manageimages from "./assets/Components/Mangeimages";
import { ToastContainer } from "react-toastify";
import Remind from "./assets/Components/Remind";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <BrowserRouter>
        {loading && (
          <LinearProgress
            color="secondary"
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 9999,
            }}
          />
        )}
        <ToastContainer />
        <Remind />
        <Routes>
          <Route path="/" element={<Login setLoading={setLoading} />} />
          <Route path="/Home" element={<Home setLoading={setLoading} />} />
          <Route path="/MyTask" element={<MyTask setLoading={setLoading} />} />
          <Route
            path="/NewTask"
            element={<NewTask setLoading={setLoading} />}
          />
          <Route
            path="/Manageimages"
            element={<Manageimages setLoading={setLoading} />}
          />
          <Route
            path="/NewTask/Manageimages"
            element={<Manageimages setLoading={setLoading} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
