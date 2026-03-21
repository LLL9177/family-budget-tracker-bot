import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { useState } from "react";

export function App() {
  const [jwt, setJwt] = useState({});

  return (
    <Routes>
      <Route path="/login" element={<Login setJwt={setJwt} />}></Route>
    </Routes>
  );
}

export default App;
