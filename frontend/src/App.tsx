import { Route, Routes } from "react-router-dom";
import Login_en from "./components/en/Login";
import Login_uk from "./components/uk/Login";
import Register_en from "./components/en/register";
import Register_uk from "./components/uk/register";
import Main_en from "./components/en/main/Main";
import { useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Main_uk from "./components/uk/main/Main";
import Renew_en from "./components/en/renew";
import ConnectFamily_en from "./components/en/connect-family/connect-family";
import Family_en from "./components/en/family/family";

export function App() {
  const [access, setAccess] = useState("");

  return (
    <AuthContext value={{ access, setAccess }}>
      <Routes>
        <Route path="/en" element={<Main_en />} />
        <Route path="/uk" element={<Main_uk />} />
        <Route path="/en/login" element={<Login_en />} />
        <Route path="/uk/login" element={<Login_uk />} />
        <Route path="/en/register" element={<Register_en />} />
        <Route path="/uk/register" element={<Register_uk />} />
        <Route path="/en/renew" element={<Renew_en />} />
        <Route path="/en/connect_family" element={<ConnectFamily_en />} />
        <Route path="/en/family" element={<Family_en />} />
      </Routes>
    </AuthContext>
  );
}

export default App;
