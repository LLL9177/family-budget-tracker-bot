import { Route, Routes } from "react-router-dom";
import Login_en from "./components/en/Login";
import Login_uk from "./components/uk/Login";
import { useEffect, useState } from "react";
import Register_en from "./components/en/register";
import Register_uk from "./components/uk/register";
import Main from "./components/en/Main";

export function App() {
  const cookies = document.cookie.split("; ").find((el) => {
    const cookie = el.split("=");
    if (cookie[0] == "jwt") return true;
  });

  const [jwt, setJwt] = useState(
    cookies ? JSON.parse(cookies[0].split("=")[1]) : {}
  );

  console.log(jwt);

  useEffect(() => {
    document.cookie = `jwt=${jwt}`;
  }, [jwt]);

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
