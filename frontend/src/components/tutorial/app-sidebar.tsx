import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { LayoutBottomIcon } from "@hugeicons/core-free-icons";
import { getTutorialSection } from "../resources/TutorialResource";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isLangEn = localStorage.getItem("lang") == "en";

  const data = {
    navMain: [
      {
        title: isLangEn ? "Getting Started" : "Початок роботи",
        url: "#",
      },
      {
        // title: "Open the Telegram Bot",
        title: getTutorialSection(0, isLangEn).title,
        url: "#open-bot",
      },
      {
        title: getTutorialSection(1, isLangEn).title,
        url: "#family-id",
      },
      {
        title: getTutorialSection(2, isLangEn).title,
        url: "#user-id",
      },
      {
        title: getTutorialSection(3, isLangEn).title,
        url: "#renew-otp",
      },
      {
        title: getTutorialSection(4, isLangEn).title,
        url: "#auth-requests",
      },
      {
        title: getTutorialSection(5, isLangEn).title,
        url: "#make-transaction",
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon
                    icon={LayoutBottomIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{isLangEn ? "Tutorial" : "Посібник"}</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
