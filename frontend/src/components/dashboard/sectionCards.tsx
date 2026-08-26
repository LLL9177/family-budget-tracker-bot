import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ICategory } from "@/types/Category.interface";

type Props = {
  data: {
    biggestSpender: string;
    smallestSpender: string;
    biggestEarner: string;
    smallestEarner: string;
    mostSpentOn: ICategory | string;
    leastSpentOn: ICategory | string;
    mostEarnedFrom: ICategory | string;
    leastEarnedFrom: ICategory | string;
    pnl: number;
  };
};

const i18n = {
  en: {
    pnl: "PnL",
    profitAndLoss: "Profit and Loss",
    pnlDescription: "Comparing the month's start and now",

    biggestSpender: "Biggest Spender",
    smallestSpender: "Smallest Spender",

    biggestEarner: "Biggest Earner",
    smallestEarner: "Smallest Earner",

    mostSpentOn: "Most Spent On",
    leastSpentOn: "Least Spent On",

    mostEarnedFrom: "Most Earned From",
    leastEarnedFrom: "Least Earned From",
  },

  uk: {
    pnl: "Прибуток/збиток",
    profitAndLoss: "Прибуток і збитки",
    pnlDescription: "Початок vs зараз",

    biggestSpender: "Найбільший витратник",
    smallestSpender: "Найменший витратник",

    biggestEarner: "Найбільший заробітчанин",
    smallestEarner: "Найменший заробітчанин",

    mostSpentOn: "Найбільші витрати на",
    leastSpentOn: "Найменші витрати на",

    mostEarnedFrom: "Найбільший дохід з",
    leastEarnedFrom: "Найменший дохід з",
  },
};

export function SectionCards({ data }: Props) {
  function shortenIfNeeded(data: string, characters = 16) {
    if (data.length > characters) return data.slice(0, characters) + "...";
    return data;
  }

  const lang = localStorage.getItem("lang") == "en" ? "en" : "uk";
  const t = i18n[lang];

  function getCategoryName(category: ICategory | string) {
    if (typeof category == "string") return category;
    if (!category) return "None";

    return lang === "en" ? category.eng : category.ukr;
  }

  return (
    <div className="flex w-screen flex-row gap-4 overflow-x-auto px-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:w-full lg:px-0 @xl/main:flex-row @5xl/main:flex-row dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card h-full w-[89.5vw] shrink-0 lg:w-full lg:shrink">
        <CardHeader>
          <CardDescription>{t.pnl}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.pnl}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.profitAndLoss}
          </div>
          <div className="text-muted-foreground">{t.pnlDescription}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-[89.5vw] shrink-0 lg:w-full lg:shrink">
        <CardHeader>
          <CardDescription>{t.biggestSpender}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.biggestSpender)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.smallestSpender}
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.smallestSpender)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-[89.5vw] shrink-0 lg:w-full lg:shrink">
        <CardHeader>
          <CardDescription>{t.biggestEarner}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.biggestEarner)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.smallestEarner}
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.smallestEarner)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-[89.5vw] shrink-0 lg:w-full lg:shrink">
        <CardHeader>
          <CardDescription>{t.mostSpentOn}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(getCategoryName(data.mostSpentOn), 15)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {t.leastSpentOn}
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(getCategoryName(data.leastSpentOn), 30)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
