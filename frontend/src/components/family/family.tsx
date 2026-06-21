import { AuthContext } from "@/contexts/AuthContext";
import type { IFamily } from "@/types/Family.interface";
import { RolesEnum } from "@/enums/RolesEnum";
import { useContext, useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Crown,
  Users,
  Shield,
  Sparkles,
  UserPlus,
  Check,
  X,
  Pencil,
  Camera,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FamilyContext } from "@/contexts/FamilyContext";
import Navigation from "../navigation/navigation";

type AccessTokenPayload = {
  id: string;
  roles: RolesEnum[];
};

const i18n = {
  en: {
    uploading: "Uploading...",
    editBanner: "Edit Banner",
    privateFamily: "Private Family",
    active: "Active",
    familyDescription:
      "Built on loyalty, chaos, shared memes, and random arguments that somehow end after food arrives.",
    familyOwner: "Family Owner",
    members: "Members",
    status: "Status",
    protected: "Protected",

    membersTitle: "Members",
    membersDescription:
      "The people responsible for your character development.",
    total: "Total",
    familyMember: "Family Member",
    online: "Online",
    userId: "User ID",

    joinRequests: "Join Requests",
    joinRequestsDescription: "People waiting outside the gates.",
    wantsToJoin: "Wants to join",
    accept: "Accept",
    reject: "Reject",
    noRequests: "No requests yet",
    noRequestsDescription: "The gates are quiet today.",

    familyInfo: "Family Info",
    familyId: "Family ID",
    requests: "Requests",
    owner: "Owner",
    leader: "Leader",
  },

  uk: {
    uploading: "Завантаження...",
    editBanner: "Редагувати банер",
    privateFamily: "Приватна сім'я",
    active: "Активна",
    familyDescription:
      "Побудована на довірі, хаосі, спільних мемах і випадкових суперечках, які дивним чином закінчуються після того, як приносять їжу.",
    familyOwner: "Власник сім'ї",
    members: "Учасники",
    status: "Статус",
    protected: "Захищена",

    membersTitle: "Учасники",
    membersDescription:
      "Люди, які відповідають за формування вашого характеру.",
    total: "Усього",
    familyMember: "Член сім'ї",
    online: "Онлайн",
    userId: "ID користувача",

    joinRequests: "Запити на приєднання",
    joinRequestsDescription: "Люди, які чекають біля воріт.",
    wantsToJoin: "Хоче приєднатися",
    accept: "Прийняти",
    reject: "Відхилити",
    noRequests: "Поки немає запитів",
    noRequestsDescription: "Сьогодні біля воріт тихо.",

    familyInfo: "Інформація про сім'ю",
    familyId: "ID сім'ї",
    requests: "Запити",
    owner: "Власник",
    leader: "Лідер",
  },
};

function parseJwt<T>(token: string): T | null {
  try {
    const payload = token.split(".")[1];

    return JSON.parse(atob(payload)) as T;
  } catch {
    return null;
  }
}

export default function Family() {
  const auth = useContext(AuthContext);

  const familyContext = useContext(FamilyContext);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();
  const familyId = searchParams.get("id");

  const navigate = useNavigate();
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  useEffect(() => {
    async function fetchFamilyData() {
      if (familyContext.family) return;
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/family?id=" + familyId,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        ).then((res) => res.json());

        if (data.id) familyContext.setFamily(data);
        else throw new Error(data.error);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFamilyData();
  }, [auth.access, familyId, familyContext]);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !familyContext.family) return;

    const file = e.target.files[0];

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const updatedFamily = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/family/avatar",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
          body: formData,
        }
      );

      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/family", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.access ? `Bearer ${auth.access}` : "",
        },
      });

      if (!res.ok) throw new Error(res.error);
      familyContext.setFamily(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function uploadBanner(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !familyContext.family) return;

    const file = e.target.files[0];

    try {
      setUploadingBanner(true);

      const formData = new FormData();
      formData.append("banner", file);

      await fetch(import.meta.env.VITE_BACKEND_URL + "/family/banner", {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: auth.access ? `Bearer ${auth.access}` : "",
        },
        body: formData,
      });

      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/family", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.access ? `Bearer ${auth.access}` : "",
        },
      });

      if (!res.ok) throw new Error(res.error);
      familyContext.setFamily(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingBanner(false);
    }
  }

  async function copyFamilyId() {
    if (!familyContext.family) return;
    await navigator.clipboard.writeText(familyContext.family.id);
  }

  if (!familyContext.family) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-72 w-full rounded-[32px]" />

          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-40 rounded-[32px]" />
            <Skeleton className="h-40 rounded-[32px]" />
            <Skeleton className="h-40 rounded-[32px]" />
          </div>

          <Skeleton className="h-[500px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  const tokenData = auth.access
    ? parseJwt<AccessTokenPayload>(auth.access)
    : null;

  const isOwner =
    tokenData?.id === familyContext.family.owner.id &&
    tokenData.roles.includes(RolesEnum.FAMILY_OWNER);

  function acceptJoinRequest(userId: string) {
    if (!isOwner) return;
    async function fetchData(userId: string) {
      if (!familyContext.family) return;
      try {
        await fetch(
          import.meta.env.VITE_BACKEND_URL + "/family/accept_join_request",
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ id: userId }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.access}`,
            },
          }
        );
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/family", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });

        if (!res.ok) throw new Error(res.error);
        familyContext.setFamily(await res.json());
      } catch (err) {
        console.error(err);
      }
    }

    fetchData(userId);
  }

  function rejectJoinRequest(userId: string) {
    if (!isOwner) return;
    async function fetchData(userId: string) {
      try {
        await fetch(
          import.meta.env.VITE_BACKEND_URL + "/family/reject_join_request",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.access}`,
            },
            body: JSON.stringify({ id: userId }),
          }
        );
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/family", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });

        if (!res.ok) throw new Error(res.error);
        familyContext.setFamily(await res.json());
      } catch (err) {
        console.error(err);
      }
    }

    fetchData(userId);
  }

  function kickMember(id: string) {
    async function fetchData() {
      try {
        await fetch(
          import.meta.env.VITE_BACKEND_URL + "/family/remove_member",
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ user_id: id }),
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );

        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/family", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });

        if (!res.ok) throw new Error(res.error);
        familyContext.setFamily(await res.json());
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {familyContext.family.banner?.url && (
        <>
          <img
            src={familyContext.family.banner.url}
            alt=""
            className="pointer-events-none fixed inset-0 h-full w-full scale-110 object-cover opacity-20 blur-sm"
          />

          <div className="pointer-events-none fixed inset-0 -z-10 bg-black/70" />
        </>
      )}

      <Navigation exclude="Family Page" />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* HIDDEN INPUTS */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={uploadAvatar}
        />

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={uploadBanner}
        />

        {/* HERO */}
        <div className="group relative overflow-hidden rounded-[32px] border shadow-2xl">
          {/* Banner */}
          <img
            src={familyContext.family.banner?.url}
            alt="Family Banner"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 transition group-hover:bg-black/70" />

          {/* Glow */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          {/* EDIT BANNER */}
          {isOwner && (
            <Button
              onClick={() => bannerInputRef.current?.click()}
              className="absolute top-6 right-6 z-20 rounded-2xl opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100"
            >
              {uploadingBanner ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.uploading}
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  {t.editBanner}
                </>
              )}
            </Button>
          )}

          <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row lg:items-end lg:justify-between lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
              {/* AVATAR */}
              <div className="group/avatar relative">
                <Avatar className="h-36 w-36 rounded-[28px] border-4 border-white/20 shadow-2xl">
                  {familyContext.family.avatar ? (
                    <AvatarImage
                      src={familyContext.family.avatar.url}
                      className="rounded-[24px] border-none object-cover"
                    />
                  ) : (
                    <AvatarFallback className="rounded-[28px] text-4xl font-black">
                      {familyContext.family.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Avatar Overlay */}
                {isOwner && (
                  <>
                    <div className="absolute inset-0 flex w-36 items-center justify-center rounded-[28px] bg-black/60 opacity-0 transition-all duration-300 group-hover/avatar:opacity-100 lg:w-auto">
                      {uploadingAvatar ? (
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      ) : (
                        <Camera className="h-8 w-8 text-white" />
                      )}
                    </div>

                    <Button
                      size="icon"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute -right-2 -bottom-2 rounded-2xl shadow-xl"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* INFO */}
              <div className="space-y-4 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full border-none bg-white/15 px-4 py-1 text-white backdrop-blur-xl">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.privateFamily}
                  </Badge>

                  <Badge className="rounded-full border-none bg-emerald-500/20 px-4 py-1 text-emerald-300 backdrop-blur-xl">
                    {t.active}
                  </Badge>
                </div>

                <div>
                  <h1 className="text-5xl font-black tracking-tight lg:text-7xl">
                    {familyContext.family.name}
                  </h1>

                  <p className="mt-3 max-w-2xl text-lg text-zinc-300">
                    {t.familyDescription}
                  </p>
                </div>

                {/* OWNER */}
                <div
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl select-none"
                  onClick={() =>
                    navigate("/en/user?id=" + familyContext.family.owner.id)
                  }
                >
                  <Avatar className="h-12 w-12">
                    {familyContext.family.owner.avatar ? (
                      <AvatarImage
                        src={familyContext.family.owner.avatar.url}
                      />
                    ) : (
                      <AvatarFallback>
                        {familyContext.family.owner.username
                          ?.slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <p className="text-sm text-zinc-400">{t.familyOwner}</p>

                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />

                      <p className="font-semibold">
                        {familyContext.family.owner.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-3xl border-white/10 bg-white/10 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-300" />

                    <div>
                      <p className="text-sm text-zinc-300">{t.members}</p>

                      <h2 className="text-3xl font-black">
                        {familyContext.family.members.length}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-white/10 bg-white/10 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-emerald-300" />

                    <div>
                      <p className="text-sm text-zinc-300">{t.status}</p>

                      <h2 className="text-2xl font-black">{t.protected}</h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
          {/* MEMBERS */}
          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-black">
                    {t.membersTitle}
                  </CardTitle>

                  <CardDescription className="mt-2">
                    {t.membersDescription}
                  </CardDescription>
                </div>

                <Badge className="rounded-full px-4 py-2 text-sm">
                  {familyContext.family.members.length} {t.total}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {familyContext.family.members.map((member) => (
                  <Card
                    key={member.id}
                    className="group cursor-pointer rounded-3xl border bg-muted/40 transition-all duration-300 select-none hover:-translate-y-1 hover:shadow-xl"
                    onClick={() => navigate("/en/user?id=" + member.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border-2 border-background">
                            {member.avatar ? (
                              <AvatarImage src={member.avatar.url} />
                            ) : (
                              <AvatarFallback className="font-bold">
                                {member.username?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold">
                                {member.username}
                              </h3>

                              {member.id === familyContext.family.owner.id && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {t.familyMember}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isOwner &&
                            member.id !== familyContext.family.owner.id && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  kickMember(member.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}

                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                            <span className="text-xs text-muted-foreground">
                              {t.online}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {t.userId}
                        </p>

                        <code className="rounded-lg bg-muted px-2 py-1 text-xs">
                          {member.id}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* JOIN REQUESTS */}
            <Card className="rounded-[32px] border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black">
                  <UserPlus className="h-6 w-6" />
                  {t.joinRequests}
                </CardTitle>

                <CardDescription>{t.joinRequestsDescription}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {familyContext.family.joinRequests?.length ? (
                  familyContext.family.joinRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border bg-muted/40 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {request.username?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="font-semibold">{request.username}</p>

                          <p className="text-sm text-muted-foreground">
                            {t.wantsToJoin}
                          </p>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            className="flex-1 rounded-xl"
                            onClick={() => acceptJoinRequest(request.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            {t.accept}
                          </Button>

                          <Button
                            variant="destructive"
                            className="flex-1 rounded-xl"
                            onClick={() => rejectJoinRequest(request.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            {t.reject}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed p-8 text-center">
                    <UserPlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                    <p className="font-medium">{t.noRequests}</p>

                    <p className="text-sm text-muted-foreground">
                      {t.noRequestsDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* INFO */}
            <Card className="rounded-[32px] border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black">
                  {t.familyInfo}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">{t.familyId}</p>

                  <code
                    className="mt-1 block rounded-xl bg-muted p-3 text-xs"
                    onClick={() => copyFamilyId}
                  >
                    {familyContext.family.id}
                  </code>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t.members}</p>

                  <Badge>{familyContext.family.members.length}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t.requests}</p>

                  <Badge variant="secondary">
                    {familyContext.family.joinRequests?.length || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{t.owner}</p>

                  <Badge className="gap-1">
                    <Crown className="h-3 w-3" />
                    {t.leader}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
