// This will contain notification body and title texts by the keys described in NotificationKeyEnum

export const notificationResource = {
  YOURE_KICKED: {
    title: ({ familyName }: { familyName: string }) => ({
      en: `You've been kicked out of ${familyName}`,
      uk: `Вас видалили з сім'ї ${familyName}`,
    }),
    body: () => ({
      en: "You no longer have access to this family.",
      uk: "Ви більше не маєте доступу до цієї сім'ї.",
    }),
  },

  USER_KICKED: {
    title: ({ username }: { username: string }) => ({
      en: `Say bye-bye to ${username}`,
      uk: `Попрощайся з ${username}`,
    }),
    body: ({ username }: { username: string }) => ({
      en: `${username} has been kicked out of the family`,
      uk: `${username} був(ла) видалений(а) з сім'ї`,
    }),
  },

  JOIN_REQUEST: {
    title: () => ({
      en: `User tries to join your family`,
      uk: `Користувач хоче приєднатися до сім'ї`,
    }),
    body: ({ username }: { username: string }) => ({
      en: `${username} sent a request to join your family. Open the family page to review it.`,
      uk: `${username} надіслав(ла) запит на приєднання до сім'ї. Перевірте сторінку сім'ї.`,
    }),
  },

  JOIN_ACCEPTED: {
    title: ({ familyName }: { familyName: string }) => ({
      en: `Welcome to ${familyName}!`,
      uk: `Ласкаво просимо до ${familyName}!`,
    }),
    body: ({ familyOwnerUsername }: { familyOwnerUsername: string }) => ({
      en: `The family owner ${familyOwnerUsername} accepted your request.`,
      uk: `Власник сім'ї ${familyOwnerUsername} прийняв ваш запит.`,
    }),
  },

  JOIN_REJECTED: {
    title: () => ({
      en: `You didn’t get in`,
      uk: `Вас не прийняли`,
    }),
    body: () => ({
      en: `The owner decided not to accept your request.`,
      uk: `Власник вирішив не приймати ваш запит.`,
    }),
  },

  USER_JOINED: {
    title: () => ({
      en: `Say hello to your new family member!`,
      uk: `Познайомтесь з новим членом сім'ї!`,
    }),
    body: ({ username }: { username: string }) => ({
      en: `${username} has joined the family.`,
      uk: `${username} приєднався(лася) до сім'ї.`,
    }),
  },

  LOGIN_REQUEST: {
    title: ({ telegramUsername }: { telegramUsername: string }) => ({
      en: `New login request by @${telegramUsername}`,
      uk: `Новий запит на вхід від @${telegramUsername}`,
    }),
    body: ({ telegramUsername }: { telegramUsername: string }) => ({
      en: `@${telegramUsername} sent a login request via bot.`,
      uk: `@${telegramUsername} надіслав запит на вхід через бота.`,
    }),
  },
};

type Lang = "en" | "uk";

export function getNotificationText(
  key: keyof typeof notificationResource,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any = {},
  lang: Lang = "en"
) {
  const resource = notificationResource[key];

  if (!resource) {
    return {
      title: "",
      body: "",
    };
  }

  const title = resource.title(meta)[lang];
  const body = resource.body(meta)[lang];

  return { title, body };
}
