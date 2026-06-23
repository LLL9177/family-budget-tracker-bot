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
  topSpenders: [string, number][] | undefined;
};

const i18n = {
  en: {
    caption: "Top Spenders",
    position: "Position",
    spent: "Spent",
    username: "Username",
    noSpenders: "No spenders",
  },
  uk: {
    caption: "Найбільші витрати",
    position: "Позиція",
    spent: "Витрачено",
    username: "Ім'я користувача",
    noSpenders: "Немає витрат",
  },
};

export default function SpenderLeaderboard({ topSpenders }: Props) {
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  return (
    <div className="overflox-x-auth overflox-x-scroll max-w-120 rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card p-1 pb-2">
      {topSpenders ? (
        <Table>
          <TableCaption>{t.caption}</TableCaption>
          <TableHeader>
            <TableHead>{t.position}</TableHead>
            <TableHead>{t.spent}</TableHead>
            <TableHead>{t.username}</TableHead>
          </TableHeader>
          <TableBody>
            {topSpenders.map((user, i) => {
              return (
                <TableRow>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{-user[1]}</TableCell>
                  <TableCell>{user[0]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <span>{t.noSpenders}</span>
      )}
    </div>
  );
}
