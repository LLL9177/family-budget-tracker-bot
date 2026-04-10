import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import type { ITransaction } from "@/types/Transaction.interface";
import MainChart_en from "./mainChart";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import { SectionCards_en } from "./sectionCards";
import MainLeaderboard_en from "./mainLeaderboard";

export default function Main_en() {
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

  function fetchPrevMonth() {
    const fetchData = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/transaction/monthly_summary",
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              familyId,
              month: new Date().getMonth() - 1,
              year: new Date().getFullYear(),
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        ).then((res) => res.json());
        console.log(data);
      } catch {
        console.log("sss");
      }
    };

    return fetchData();
  }

  useEffect(() => {
    const getProfile = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            method: "POST",
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
          <h1 className="mb-5 text-2xl font-bold">Whoops!</h1>
          <p className="mb-3 w-150 text-center">
            Seems like your account doesn't have Family ID connected. To access
            this page properly, first connect family ID, or create your own
            family.
          </p>
          <div>
            <Button
              onClick={() => navigate("/en/connect_family")}
              className="ease transition duration-200 hover:border-3 hover:border-[rgba(255,255,255,0.35)]"
            >
              Connect Family
            </Button>
            <Button
              onClick={() => navigate("/en/create_family")}
              className="ease ml-3 transition duration-200 hover:border-3 hover:border-[rgba(255,255,255,0.35)]"
            >
              Create Family
            </Button>
          </div>
        </>
      ) : (
        <div className="flex h-[100vh] w-[100vw]">
          <MainLeaderboard_en
            data={{
              current: {
                prev: fetchPrevMonth(),
                pnl: familyData.pnl,
                totalSpent: familyData.totalSpent,
                totalEarnt: familyData.totalEarned,
                topEarner: earnersLeaderboard?.[0],
                topSpender: spendersLeaderboard?.[0],
                topCategory: categoriesLeaderboard?.[0],
              },
            }}
          />
          <div className="flex h-[100vh] w-full flex-col items-center justify-center gap-3">
            <SectionCards_en />
            <MainChart_en data={transactions as ITransactionWithDate[]} />
          </div>
        </div>
      )}
    </div>
  );
}
