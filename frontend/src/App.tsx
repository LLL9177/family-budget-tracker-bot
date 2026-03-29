import { Route, Routes } from "react-router-dom";
import Login_en from "./components/en/Login";
import Login_uk from "./components/uk/Login";
import Register_en from "./components/en/register";
import Register_uk from "./components/uk/register";
import Main from "./components/en/Main";
import { useState } from "react";

export function App() {
  const [jwt, setJwt] = useState({});

  return (
    <Routes>
      <Route path="/en" element={<Main jwt={jwt} />} />
      <Route path="/en/login" element={<Login_en setJwt={setJwt} />} />
      <Route path="/uk/login" element={<Login_uk setJwt={setJwt} />} />
      <Route path="/en/register" element={<Register_en setJwt={setJwt} />} />
      <Route path="/uk/register" element={<Register_uk setJwt={setJwt} />} />
    </Routes>
  );
}

export default App;
