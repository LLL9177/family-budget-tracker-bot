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
import CreateFamily_en from "./components/en/create-family/create-family";
import AuthBootstrap from "./hooks/useRenewAccess";
import { TransactionsContext } from "./contexts/TransactionsContext";
import type { ITransaction } from "./types/Transaction.interface";
import type { ITransactionWithDate } from "./types/TransactionWithDate.interface";
import { FamilyContext } from "./contexts/FamilyContext";
import type { IFamily } from "./types/Family.interface";
import User_en from "./components/en/user/user";
import Landing from "./components/landing";

export function App() {
  const [access, setAccess] = useState("");
  const [transactions, setTransactions] = useState<
    ITransaction[] | [] | ITransactionWithDate[]
  >([]);
  const [family, setFamily] = useState<IFamily | null>(null);

  return (
    <AuthContext value={{ access, setAccess }}>
      <TransactionsContext value={{ transactions, setTransactions }}>
        <FamilyContext value={{ family, setFamily }}>
          <AuthBootstrap />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/en" element={<Main_en />} />
            <Route path="/uk" element={<Main_uk />} />
            <Route path="/en/login" element={<Login_en />} />
            <Route path="/uk/login" element={<Login_uk />} />
            <Route path="/en/register" element={<Register_en />} />
            <Route path="/uk/register" element={<Register_uk />} />
            <Route path="/en/renew" element={<Renew_en />} />
            <Route path="/en/connect_family" element={<ConnectFamily_en />} />
            <Route path="/en/family" element={<Family_en />} />
            <Route path="/en/create_family" element={<CreateFamily_en />} />
            <Route path="/en/user" element={<User_en />} />
          </Routes>
        </FamilyContext>
      </TransactionsContext>
    </AuthContext>
  );
}

export default App;
