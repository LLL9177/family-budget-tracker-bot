import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { ITutorialBlockPlain } from "@/types/TutorialBlock.interface";

type Props = {
  data: {
    title: string;
    description?: string;
    blocks: ITutorialBlockPlain[];
    tip?: string;
    count: number;
    id: string;
  };
};

const i18n = {
  en: {
    step: "Step",
    next: "Next",
    tip: "Tip",
  },
  uk: {
    step: "Крок",
    next: "Наступне",
    tip: "Порада",
  },
};

export default function SectionLayout({ data }: Props) {
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  return (
    <Card
      className="w-[90vw] lg:w-[80vw] rounded-3xl border p-8 backdrop-blur-2xl dark:bg-card/80"
      id={data.id}
    >
      <Badge className="bg-transparent text-primary">
        {t.step} {data.count}
      </Badge>
      <CardTitle className="mt-2 text-3xl font-bold">{data.title}</CardTitle>
      {data.description && (
        <CardDescription className="text-[16px]">
          {data.description}
        </CardDescription>
      )}
      <div className="mt-2 grid gap-4 lg:grid-cols-2">
        {data.blocks.map((block) => (
          <Card className="bg-transparent p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <block.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">{block.title}</h3>
            <p className="text-sm text-muted-foreground">{block.description}</p>
          </Card>
        ))}
      </div>

      {data.tip && (
        <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p className="font-medium">💡 {t.tip}</p>

          <p className="mt-2 text-sm text-muted-foreground">{data.tip}</p>
        </Card>
      )}
    </Card>
  );
}
