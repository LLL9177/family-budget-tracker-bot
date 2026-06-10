import type { IFamily } from "@/types/Family.interface";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { use, useState } from "react";
import type { IUserData } from "@/types/UserData.interface";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { RolesEnum } from "@/enums/RolesEnum";
import type { ITransaction } from "@/types/Transaction.interface";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import { span } from "framer-motion/client";
import type { IUser } from "@/types/User.interface";

type Props = {
  family: IFamily;
  active: boolean;
  transcations: ITransaction[];
};

export default function Users_en({ family, active, transactions }: Props) {
  const [display, setDisplay] = useState(active);
  const navigate = useNavigate();

  function openUser(u: IUserData) {
    navigate("/en/user?id=" + u.id);
  }

  return (
    <>
      {display && (
        <div
          className="fixed top-0 z-12 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDisplay(false)}
        >
          <AnimatePresence mode="popLayout">
            <motion.div layout>
              <Card
                className="max-h-200 w-150 overflow-y-scroll rounded-3xl p-2 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {family.members.map((user) => (
                  <motion.div
                    key={user.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      transition: {
                        duration: 0.15,
                      },
                    }}
                  >
                    <Card
                      className="flex cursor-pointer flex-row items-center justify-between bg-white/2 p-0 text-xl hover:bg-white/4"
                      onClick={(e) => {
                        e.stopPropagation();
                        openUser(user);
                      }}
                    >
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-10 w-10">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar.url} />
                          ) : (
                            <AvatarFallback>
                              {user.username.slice(0, 2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {user.username}
                        <div className="flex gap-2 pr-2">
                          {JSON.parse(user.roles).map((role: RolesEnum) => (
                            <Badge key={role}>{role}</Badge>
                          ))}
                        </div>
                      </div>
                      <GetUserDelta u={user} transactions={transactions} />
                    </Card>
                  </motion.div>
                ))}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

type GetUserDeltaProps = {
  u: IUserData;
  transactions: ITransaction[];
};

function GetUserDelta({ u, transactions }: GetUserDeltaProps) {
  const userTransactions = transactions
    .map((transaction: ITransaction) => ({
      ...transaction,
      createdAt: new Date(transaction.createdAt),
    }))
    .filter((transaction: ITransactionWithDate) => transaction.user.id == u.id);

  let sum = 0;
  userTransactions.map(
    (transaction: ITransactionWithDate) => (sum += transaction.amount)
  );

  return (
    <span className={"mr-2 " + (sum > 0 ? "text-green-300" : "text-red-300")}>{sum}</span>
  );
}
