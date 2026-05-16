import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  data: {
    biggestSpender: string;
    smallestSpender: string;
    biggestEarner: string;
    smallestEarner: string;
    mostSpentOn: string;
    leastSpentOn: string;
    mostEarnedFrom: string;
    leastEarnedFrom: string;
    pnl: number;
  };
};

export function SectionCards_uk({ data }: Props) {
  function shortenIfNeeded(data: string, characters = 16) {
    if (data.length > characters) return data.slice(0, characters) + "...";
    return data;
  }

  return (
    <div className="flex w-full flex-row gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:flex-row @5xl/main:flex-row dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>ПіЗ</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.pnl}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Profit and Loss
          </div>
          <div className="text-muted-foreground">
            Порівняння початок місяця і зараз
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>Найбільший Витратник</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.biggestSpender)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Найменший Витратник
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.smallestSpender)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>Найбільший Заробник</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.biggestEarner)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Найменший Заробник
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.smallestEarner)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>Найбільш Витрачено На</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.mostSpentOn)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Наймеш Витрачено На
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.leastSpentOn, 35)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
