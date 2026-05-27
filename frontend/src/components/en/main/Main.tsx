import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import type { ITransaction } from "@/types/Transaction.interface";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import type { IFetchError } from "@/types/FetchError.interface";
import type { IFamilyData } from "@/types/FamilyData.interface";
import type { IMonthlySummary } from "@/types/MonthlySummary.interface";
import { Button } from "@/components/ui/button";
import MonthComparison_en from "./monthComparison";
import { SectionCards_en } from "./sectionCards";
import MainChart_en from "./mainChart";
import SpenderLeaderboard_en from "./spenderLeaderboard";
import EarnerLeaderboard_en from "./earnerLeaderboard";
import EarnerCategoryLeaderboard_en from "./earnerCategoryLeaderboard";
import SpenderCategoryLeaderboard_en from "./spenderCategoryLeaderboard";
import DifferentMonthsComparison_en from "./differentMonthsComparison";
import FamilyId_en from "./familyId";
import { useTheme } from "@/components/theme-provider";

export default function Main_en() {
  const auth = useContext(AuthContext);
  const decodedJwt = auth.access ? jwtDecode(auth.access) : "";
  const navigate = useNavigate();
  const [familyId, setFamilyId] = useState("");
  const [transactions, setTransactions] = useState<
    ITransaction[] | [] | ITransactionWithDate[]
  >([]);
  const [prevMonth, setPrevMonth] = useState<IFetchError | IMonthlySummary>();
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const familyData: IFamilyData = {
    pnl: 0,
    totalSpent: 0,
    totalEarned: 0,
    mostSpentOn: {
      key: "None",
      value: 0,
    },
    leastSpentOn: {
      key: "None",
      value: 0,
    },
    mostEarnedFrom: {
      key: "None",
      value: 0,
    },
    leastEarnedFrom: {
      key: "None",
      value: 0,
    },
    topEarner: {
      earner: "None",
      value: 0,
    },
    smallestEarner: {
      earner: "None",
      value: 0,
    },
    topSpender: {
      spender: "None",
      value: 0,
    },
    smallestSpender: {
      spender: "None",
      value: 0,
    },
  };

  const spenderMap = new Map<string, number>();
  const earnerMap = new Map<string, number>();
  const categorySpentMap = new Map<string, number>();
  const categoryEarnedMap = new Map<string, number>();

  for (const transaction of transactions) {
    familyData.pnl += transaction.amount;
    if (transaction.amount > 0) {
      familyData.totalEarned += transaction.amount;
      earnerMap.set(
        transaction.user.username,
        (earnerMap.get(transaction.user.username) || 0) + transaction.amount
      );
      categoryEarnedMap.set(
        transaction.category,
        (categoryEarnedMap.get(transaction.category) || 0) + transaction.amount
      );
    } else {
      familyData.totalSpent += transaction.amount;
      spenderMap.set(
        transaction.user.username,
        (spenderMap.get(transaction.user.username) || 0) + transaction.amount
      );
      categorySpentMap.set(
        transaction.category,
        (categorySpentMap.get(transaction.category) || 0) + transaction.amount
      );
    }
  }

  const topSpentOn = [...categorySpentMap.entries()].sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  const topEarnedFrom = [...categoryEarnedMap.entries()].sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  const topSpenders = spenderMap.size
    ? [...spenderMap.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    : undefined;

  const topEarners = earnerMap.size
    ? [...earnerMap.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    : undefined;

  if (topSpentOn.length > 0) {
    familyData.mostSpentOn = { key: topSpentOn[0][0], value: topSpentOn[0][1] };
    if (topSpentOn.length > 1) {
      const i = topSpentOn.length - 1;
      familyData.leastSpentOn = {
        key: topSpentOn[i][0],
        value: topSpentOn[i][1],
      };
    }
  }

  if (topEarnedFrom.length > 0) {
    familyData.mostEarnedFrom = {
      key: topEarnedFrom[0][0],
      value: topEarnedFrom[0][1],
    };
    if (topEarnedFrom.length > 1) {
      const i = topEarnedFrom.length - 1;
      familyData.mostEarnedFrom = {
        key: topEarnedFrom[i][0],
        value: topEarnedFrom[i][1],
      };
    }
  }
  if (topEarners) {
    familyData.topEarner = {
      earner: topEarners[0][0],
      value: topEarners[0][1],
    };
    if (topEarners.length > 1) {
      const i = topEarners.length - 1;
      familyData.smallestEarner = {
        earner: topEarners[i][0],
        value: topEarners[i][1],
      };
    }
  }
  if (topSpenders) {
    familyData.topSpender = {
      spender: topSpenders[0][0],
      value: topSpenders[0][1],
    };
    if (topSpenders.length > 1) {
      const i = topSpenders.length - 1;
      familyData.smallestSpender = {
        spender: topSpenders[i][0],
        value: topSpenders[i][1],
      };
    }
  }

  useEffect(() => {
    if (!familyId) return;
    const fetchData = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/transaction/monthly_summary",
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              familyId,
              month: new Date().getMonth(), // not subtracting 1 because of Date being brilliant
              year: new Date().getFullYear(),
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        ).then((res) => res.json());
        setPrevMonth(data);
        return data;
      } catch {
        console.error("");
      }
    };

    fetchData();
  }, [familyId, auth.access]);

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

        setFamilyId(data.family.id);
        const _familyId = data.family.id;
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
            const transactions = data
              .map((t: ITransaction) => {
                t.createdAt = new Date(t.createdAt);
                return t;
              })
              .filter((t: ITransactionWithDate) => {
                const today = new Date();
                if (
                  t.createdAt.getMonth() == today.getMonth() &&
                  t.createdAt.getFullYear() == today.getFullYear()
                )
                  return true;
                return false;
              });
            setTransactions(transactions);
          } catch (err) {
            console.error(err);
          }
        };

        getData();
      } catch (err) {
        console.error(err);
      }
    };
    getProfile();
  }, [decodedJwt, auth.access, navigate]);

  return (
    <div
      className={
        "flex h-full w-[100vw] flex-col items-center justify-center bg-cover bg-fixed bg-center" +
        `${currentTheme === "dark" ? " bg-[url('/main-background.png')]" : " bg-[url('/main-background-light.jpg')]"}`
      }
    >
      {familyId == "" || !familyId ? (
        <div className="flex h-[100vh] flex-col items-center justify-center">
          <h1 className="mb-5 text-2xl font-bold">Whoops!</h1>
          <p className="mb-3 w-150 text-center">
            Seems like your account doesn't have Family ID connected. To access
            this page properly, first connect Family ID, or create your own
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
        </div>
      ) : (
        <div className="h-full w-[100vw] flex-col items-center justify-center gap-3">
          <div className="flex h-full w-[100vw] items-center justify-center gap-3">
            <div className="h-[100vh] w-125">
              <MonthComparison_en
                data={{
                  prev: prevMonth as IMonthlySummary | undefined,
                  current: {
                    ...familyData,
                    mostSpentOn: familyData.mostSpentOn.key ?? "-",
                    mostEarnedFrom: familyData.mostEarnedFrom.key ?? "-",
                    topSpenderId: familyData.topSpender.spender,
                    topEarnerId: familyData.topEarner.earner,
                  },
                }}
                caption="Last Month Comparison"
                monthOneName="This Month"
                monthTwoName="Last Month"
              />
              <DifferentMonthsComparison_en familyId={familyId} />
              <FamilyId_en familyId={familyId} />
            </div>
            <div className="flex h-[100vh] w-[72vw] flex-col items-center justify-center gap-3">
              <SectionCards_en
                data={{
                  ...familyData,
                  mostSpentOn: familyData.mostSpentOn.key ?? "-",
                  leastSpentOn: familyData.leastSpentOn.key ?? "-",
                  mostEarnedFrom: familyData.mostEarnedFrom.key ?? "-",
                  leastEarnedFrom: familyData.leastEarnedFrom.key ?? "-",
                  smallestSpender: familyData.smallestSpender.spender,
                  smallestEarner: familyData.smallestEarner.earner,
                  biggestEarner: familyData.topEarner.earner,
                  biggestSpender: familyData.topSpender.spender,
                }}
              />
              <MainChart_en data={transactions as ITransactionWithDate[]} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-5">
            <SpenderLeaderboard_en topSpenders={topSpenders} />
            <EarnerLeaderboard_en topEarners={topEarners} />
            <EarnerCategoryLeaderboard_en topEarnerCategories={topEarnedFrom} />
            <SpenderCategoryLeaderboard_en topSpenderCategories={topSpentOn} />
          </div>
        </div>
      )}
    </div>
  );
}
