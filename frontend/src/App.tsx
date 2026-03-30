import { Route, Routes } from "react-router-dom";
import Login_en from "./components/en/Login";
import Login_uk from "./components/uk/Login";
import Register_en from "./components/en/register";
import Register_uk from "./components/uk/register";
import Main from "./components/en/Main";
import { useState } from "react";
import { AuthContext } from "./contexts/AuthContext";

export function App() {
  const [access, setAccess] = useState("");

  // LAST THING DID IS PROVIDED THE CONTEXT. NOW USE IT
  return (
    <AuthContext value={{ access, setAccess }}>
      <Routes>
        <Route path="/en" element={<Main />} />
        <Route path="/en/login" element={<Login_en />} />
        <Route path="/uk/login" element={<Login_uk />} />
        <Route path="/en/register" element={<Register_en />} />
        <Route path="/uk/register" element={<Register_uk />} />
      </Routes>
    </AuthContext>
  );
}

export default App;
