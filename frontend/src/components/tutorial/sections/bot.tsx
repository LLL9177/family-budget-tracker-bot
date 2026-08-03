import { Menu, Send } from "lucide-react";
import SectionLayout from "./section-layout";

export function OpenBotSection() {
  return (
    <SectionLayout
      data={{
        id: "open-bot",
        title: "Open the Telegram bot",
        description:
          "You can open the bot directly from the website in just two clicks. This only needs to be done once unless you remove the chat from Telegram.",
        blocks: [
          {
            title: "Open the navigation menu",
            description:
              "Click the menu button in the top-left corner of the website to reveal the navigation panel.",
            icon: Menu,
          },
          {
            title: 'Click "Open Bot"',
            description:
              "Selecting this option opens your Telegram bot conversation automatically.",
            icon: Send,
          },
        ],
        tip:
          "Keep the chat pinned in Telegram if you use the bot frequently. It saves you from searching for it every time.",
        count: 1,
      }}
    />
  );
}
