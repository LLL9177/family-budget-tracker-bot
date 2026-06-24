import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import CreateFamily from "./components/create-family/create-family";
import AuthBootstrap from "./hooks/useRenewAccess";
import { TransactionsContext } from "./contexts/TransactionsContext";
import type { ITransaction } from "./types/Transaction.interface";
import type { ITransactionWithDate } from "./types/TransactionWithDate.interface";
import { FamilyContext } from "./contexts/FamilyContext";
import type { IFamily } from "./types/Family.interface";
import User from "./components/user/user";
import Landing from "./components/landing/landing";
import ConnectFamily from "./components/connect-family/connect-family";
import Family from "./components/family/family";
import Dashboard from "./components/dashboard/dashboard";
import Login from "./components/Login";
import Register from "./components/register";
import Renew from "./components/renew";
import Tutorial from "./components/tutorial/tutorial";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/renew" element={<Renew />} />
            <Route path="/connect_family" element={<ConnectFamily />} />
            <Route path="/family" element={<Family />} />
            <Route path="/create_family" element={<CreateFamily />} />
            <Route path="/user" element={<User />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
        </FamilyContext>
      </TransactionsContext>
    </AuthContext>
  );
}

export default App;
