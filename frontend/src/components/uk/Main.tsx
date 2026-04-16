import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import type { ITransaction } from "@/types/Transaction.interface";
import MainChart_uk from "./mainChart";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";

export default function Main_uk() {
  const auth = useContext(AuthContext);
  const decodedJwt = auth.access ? jwtDecode(auth.access) : "";
  const navigate = useNavigate();
  const [familyId, setFamilyId] = useState("");
  const [transactions, setTransactions] = useState<
    ITransaction[] | [] | ITransactionWithDate[]
  >([]);

  const familyData = {
    pnl: 0,
    totalSpent: 0,
    totalEarned: 0,
  };

  const categoryMap = new Map<string, number>();
  const spenderMap = new Map<string, number>();
  const earnerMap = new Map<string, number>();

  for (const transaction of transactions) {
    familyData.pnl += transaction.amount;
    if (transaction.amount > 0) {
      familyData.totalEarned += transaction.amount;
      spenderMap.set(
        transaction.userId,
        (spenderMap.get(transaction.userId) || 0) + transaction.amount
      );
    } else {
      familyData.totalSpent += transaction.amount;
      earnerMap.set(
        transaction.category,
        (earnerMap.get(transaction.userId) || 0) + transaction.amount
      );
    }

    categoryMap.set(
      transaction.category,
      (categoryMap.get(transaction.category) || 0) + transaction.amount
    );
  }

  const topCategories = [...categoryMap.entries()].sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  const topSpenders = spenderMap.size
    ? [...spenderMap.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    : undefined;

  const topEarners = earnerMap.size
    ? [...earnerMap.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    : undefined;

  const categoriesLeaderboard = Object.fromEntries(
    topCategories.map(([k, v]) => [k, [v]])
  );

  const earnersLeaderboard = topEarners
    ? Object.fromEntries(topEarners.map(([k, v]) => [k, [v]]))
    : undefined;

  const spendersLeaderboard = topSpenders
    ? Object.fromEntries(topSpenders.map(([k, v]) => [k, [v]]))
    : undefined;

  useEffect(() => {
    const getProfile = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        ).then((res) => res.json());
        if (data.message) {
          if (data.statusCode == 401) navigate("/en/login");
        }

        setFamilyId(data.family);
        const _familyId = data.family;

        if (_familyId == null) return;

        const getData = async function () {
          try {
            const data = await fetch(
              import.meta.env.VITE_BACKEND_URL +
                `/transaction/get_family_transactions?family_uuid=${_familyId}`,
              {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: auth.access ? `Bearer ${auth.access}` : "",
                },
              }
            ).then((res) => res.json());
            const transactions = data.map((t: ITransaction) => {
              t.createdAt = new Date(t.createdAt);
              return t;
            });
            setTransactions(transactions);
          } catch (err) {
            console.log(err);
          }
        };

        getData();
      } catch (err) {
        console.log(err);
      }
    };

    getProfile();
  }, [decodedJwt, auth.access, navigate]);

  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center">
      {familyId == "" || !familyId ? (
        <>
          <h1 className="mb-5 text-2xl font-bold">Отакої!</h1>
          <p className="mb-3 w-150 text-center">
            Схоже що ваш аккаунт не під'єднанний до жодної сім'ї. Щоб правильно
            відкрити цю сторінку, спочатку підєеднайте Family ID, або створіть
            свою сім'ю
          </p>
          <div>
            <Button
              onClick={() => navigate("/en/connect_family")}
              className="ease transition duration-200 hover:border-3 hover:border-[rgba(255,255,255,0.35)]"
            >
              Підключитися до сім'ї
            </Button>
            <Button
              onClick={() => navigate("/en/create_family")}
              className="ease ml-3 transition duration-200 hover:border-3 hover:border-[rgba(255,255,255,0.35)]"
            >
              Створити сім'ю
            </Button>
          </div>
        </>
      ) : (
        <div className="h-[100vh] w-[100vw] items-center justify-center">
          <MainChart_uk data={transactions as ITransactionWithDate[]} />
        </div>
      )}
    </div>
  );
}
