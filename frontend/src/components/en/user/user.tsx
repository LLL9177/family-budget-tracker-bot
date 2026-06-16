import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/contexts/AuthContext";
import type { ITransaction } from "@/types/Transaction.interface";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import type { IUserData } from "@/types/UserData.interface";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation_en from "../navigation/navigation";

export default function User_en() {
  const auth = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<IUserData>();
  const [transactions, setTransactions] = useState<ITransactionWithDate[]>();
  const navigate = useNavigate();

  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/user?id=" + userId,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json());

        setUser({ ...data, roles: JSON.parse(data.roles) });
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [userId, auth.access]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            credentials: "include",
            headers: {
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );

        const profile = await res.json();

        setIsOwnProfile(profile.id === userId);
      } catch (err) {
        console.error(err);
      }
    }

    if (auth.access && userId) {
      fetchProfile();
    }
  }, [auth.access, userId]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            "/transaction/get_by_user?id=" +
            userId,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );
        console.log(res);
        const data = await res.json();

        data.forEach(
          (transaction: ITransaction) =>
            (transaction.createdAt = new Date(transaction.createdAt))
        );
        console.log(data);

        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [auth.access, userId]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", file);

      await fetch(import.meta.env.VITE_BACKEND_URL + "/user/upload-avatar", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: auth.access ? `Bearer ${auth.access}` : "",
        },
        body: formData,
      });

      const updatedUser = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/auth/profile",
        {
          credentials: "include",
          headers: {
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        }
      ).then((res) => res.json());

      setUser((prev) =>
        prev
          ? {
              ...prev,
              avatar: updatedUser.avatar,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function copyUserId() {
    if (!userId) return;
    await navigator.clipboard.writeText(userId);
  }

  return (
    <div className="min-h-screen">
      <Navigation_en exclude="Profile Page" />
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />
        <>
      {user?.family.banner?.url && (
          <img
            src={user.family.banner.url}
            alt=""
            className="pointer-events-none fixed inset-0 h-full w-full scale-110 object-cover opacity-20 blur-sm"
          />

        )}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-black/70" />
        </>
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40" />

            {/* Profile */}
            <div className="px-8 pb-8">
              <div className="relative w-fit">
                {user?.avatar ? (
                  <img
                    src={user.avatar.url}
                    alt=""
                    className="-mt-16 h-32 w-32 rounded-full border-4 border-zinc-900 object-cover shadow-xl"
                  />
                ) : (
                  <Avatar className="-mt-16 h-32 w-32 border-4 border-zinc-900 shadow-xl">
                    <AvatarFallback className="text-3xl font-bold">
                      {user?.username.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {isOwnProfile && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute right-0 bottom-0 cursor-pointer rounded-full border border-white/20 bg-zinc-900/90 px-3 py-1 text-xs hover:bg-zinc-800"
                  >
                    {uploadingAvatar ? "..." : "Edit"}
                  </label>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between">
                <h1 className="text-3xl font-bold">{user?.username}</h1>

                {user?.familyOwned && (
                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300">
                    👑 Family Owner
                  </span>
                )}
                <div className="flex flex-col justify-between">
                  <div className="flex gap-1">
                    {user?.roles.map((role) => (
                      <Badge>{role}</Badge>
                    ))}
                  </div>
                  <code
                    className="text-black block cursor-pointer rounded-xl bg-muted p-2 text-xs select-none dark:text-white"
                    onClick={() => copyUserId()}
                  >
                    {user?.id}
                  </code>
                </div>
              </div>
              <p className="mt-2 text-zinc-400">
                Member of {user?.family?.name ?? "No Family"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-sm text-zinc-400">Email</h2>
              <p>{user?.email}</p>
            </div>

            <div
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
              onClick={() => navigate(`/en/family?id=${user?.family.id}`)}
            >
              <h2 className="mb-2 text-sm text-zinc-400">Family</h2>
              <p>{user?.family?.name ?? "None"}</p>
            </div>
          </div>
        </div>
        {transactions && (
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="mb-6 text-xl font-semibold">Transactions</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-white/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{transaction.category}</span>

                    <span
                      className={`font-semibold ${
                        transaction.amount >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : ""}
                      {transaction.amount}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-400">
                    {transaction.createdAt.toLocaleDateString()}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    {transaction.createdAt.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
