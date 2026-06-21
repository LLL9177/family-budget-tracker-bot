import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import type { ITransaction } from "@/types/Transaction.interface";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import type { IFetchError } from "@/types/FetchError.interface";
import type { IFamilyData } from "@/types/FamilyData.interface";
import type { IMonthlySummary } from "@/types/MonthlySummary.interface";
import { Button } from "@/components/ui/button";
import MonthComparison from "./monthComparison";
import { SectionCards } from "./sectionCards";
import MainChart from "./mainChart";
import SpenderLeaderboard from "./spenderLeaderboard";
import EarnerLeaderboard from "./earnerLeaderboard";
import EarnerCategoryLeaderboard from "./earnerCategoryLeaderboard";
import SpenderCategoryLeaderboard from "./spenderCategoryLeaderboard";
import DifferentMonthsComparison from "./differentMonthsComparison";
import FamilyId from "./familyId";
import { useTheme } from "@/components/theme-provider";
import { TransactionsContext } from "@/contexts/TransactionsContext";
import { FamilyContext } from "@/contexts/FamilyContext";
import Navigation from "../navigation/navigation";

const i18n = {
  en: {
    whoops: "Whoops!",
    connectFamily: "Connect Family",
    createFamily: "Create Family",
    none: "None",
    noFamilyMessage:
      "It looks like your account isn't connected to a Family ID. To use this page, connect an existing family or create a new one.",
    lastMonthComparison: "Last Month Comparison",
    thisMonth: "This Month",
    lastMonth: "Last Month",
  },
  uk: {
    whoops: "Йой!",
    connectFamily: "Підключити сім'ю",
    createFamily: "Створити сім'ю",
    none: "Немає",
    noFamilyMessage:
      "Схоже, ваш акаунт не підключений до ID сім'ї. Щоб використовувати цю сторінку, під'єднайте існуючу сім'ю або створіть нову.",
    lastMonthComparison: "Порівняння з Минулим Місяцем",
    thisMonth: "Цей Місяць",
    lastMonth: "Минулий Місяць",
  },
};

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [familyId, setFamilyId] = useState("");
  const { setTransactions, transactions } = useContext(TransactionsContext);
  const [prevMonth, setPrevMonth] = useState<IFetchError | IMonthlySummary>();
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { setFamily } = useContext(FamilyContext);

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  const familyData: IFamilyData = {
    pnl: 0,
    totalSpent: 0,
    totalEarned: 0,
    mostSpentOn: {
      key: t.none,
      value: 0,
    },
    leastSpentOn: {
      key: t.none,
      value: 0,
    },
    mostEarnedFrom: {
      key: t.none,
      value: 0,
    },
    leastEarnedFrom: {
      key: t.none,
      value: 0,
    },
    topEarner: {
      earner: t.none,
      value: 0,
    },
    smallestEarner: {
      earner: t.none,
      value: 0,
    },
    topSpender: {
      spender: t.none,
      value: 0,
    },
    smallestSpender: {
      spender: t.none,
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
          if (data.statusCode == 401) navigate("/login");
        }

        setFamilyId(data.family.id);
        setFamily(data.family);
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
  }, [auth.access, navigate, setFamily, setTransactions]);

  return (
    <div className="flex h-full w-[100vw] flex-col items-center justify-center bg-[url('/main-background-light.jpg')] bg-cover bg-fixed bg-center dark:bg-[url('/main-background.png')]">
      <Navigation exclude="dashboard" />
      {familyId == "" || !familyId ? (
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="mb-5 text-2xl font-bold">{t.whoops}</h1>
          <p className="mb-3 w-100 text-center lg:w-150">{t.noFamilyMessage}</p>
          <div>
            <Button
              onClick={() => navigate("/connect_family")}
              className="ease transition duration-200 hover:border-3 hover:border-[rgba(255,255,255,0.35)]"
            >
              {t.connectFamily}
            </Button>
            <Button
              onClick={() => navigate("/create_family")}
              className="ease ml-3 transition duration-200 hover:border-3 hover:border-[rgba(255,255,255,0.35)]"
            >
              {t.createFamily}
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full w-[100vw] flex-col items-center justify-center gap-3">
          <div className="mb-10 flex h-full w-[100vw] flex-col items-center justify-center gap-3 lg:mb-0 lg:flex-row">
            <div className="-mt-15 flex h-screen w-screen flex-col px-4 lg:mt-0 lg:w-125 lg:px-0">
              <MonthComparison
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
                caption={t.lastMonthComparison}
                monthOneName={t.thisMonth}
                monthTwoName={t.lastMonth}
              />
              <DifferentMonthsComparison familyId={familyId} captionText="" />
              <FamilyId
                familyId={familyId}
                className="order-first lg:order-last"
              />
            </div>
            <div className="order-first flex h-[100vh] w-[90%] flex-col items-center justify-center gap-3 lg:order-last lg:w-[72vw]">
              <SectionCards
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
              <MainChart
                data={transactions as ITransactionWithDate[]}
                className="order-first lg:order-last"
              />
            </div>
          </div>
          <div className="mb-5 flex w-screen flex-col items-center justify-center gap-5 overflow-x-scroll lg:flex-row lg:items-start">
            <SpenderLeaderboard topSpenders={topSpenders} />
            <EarnerLeaderboard topEarners={topEarners} />
            <EarnerCategoryLeaderboard topEarnerCategories={topEarnedFrom} />
            <SpenderCategoryLeaderboard topSpenderCategories={topSpentOn} />
          </div>
        </div>
      )}
    </div>
  );
}
