import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  topEarners: [string, number][] | undefined;
};

const i18n = {
  en: {
    caption: "Top Earners",
    position: "Position",
    earned: "Earned",
    username: "Username",
    noEarners: "No earners",
  },
  uk: {
    caption: "Найбільші доходи",
    position: "Позиція",
    earned: "Зароблено",
    username: "Ім'я користувача",
    noEarners: "Немає доходів",
  },
};

export default function EarnerLeaderboard({ topEarners }: Props) {
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  return (
    <div className="overflox-x-scroll max-w-120 rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card p-1 pb-2">
      {topEarners ? (
        <Table>
          <TableCaption>{t.caption}</TableCaption>
          <TableHeader>
            <TableHead>{t.position}</TableHead>
            <TableHead>{t.earned}</TableHead>
            <TableHead>{t.username}</TableHead>
          </TableHeader>
          <TableBody>
            {topEarners.map((user, i) => (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user[1]}</TableCell>
                <TableCell>{user[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>{t.noEarners}</span>
      )}
    </div>
  );
}
