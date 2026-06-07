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

export function SectionCards_en({ data }: Props) {
  function shortenIfNeeded(data: string, characters = 16) {
    if (data.length > characters) return data.slice(0, characters) + "...";
    return data;
  }

  return (
    <div className="flex w-full flex-row gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:flex-row @5xl/main:flex-row dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>PnL</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.pnl}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Profit and Loss
          </div>
          <div className="text-muted-foreground">
            Comparing the month's start and now
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>Biggest Spender</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.biggestSpender)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Smallest Spender
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.smallestSpender)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>Biggest Earner</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.biggestEarner)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Smallest Earner
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.smallestEarner)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card h-full w-full">
        <CardHeader>
          <CardDescription>Most Spent On</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {shortenIfNeeded(data.mostSpentOn, 15)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Least Spent On
          </div>
          <div className="text-muted-foreground">
            {shortenIfNeeded(data.leastSpentOn, 30)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
