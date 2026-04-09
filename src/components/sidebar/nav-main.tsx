import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import type { ContentType } from "@/config/config.path";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMain({ items }: { items: ContentType[] }) {
  const { href } = useLocation();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      {items.map((item) =>
        item.items.length > 0 ? (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || href.includes(item.url)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          to={subItem.url}
                          className="[&.active]:font-bold [&.active]:text-main"
                          activeOptions={{
                            exact: subItem?.exact ?? false,
                            includeSearch: false,
                          }}
                          onClick={() => {
                            isMobile && toggleSidebar();
                          }}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuSubItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link
                to={item.url}
                className="[&.active]:font-bold [&.active]:text-main"
                onClick={() => {
                  isMobile && toggleSidebar();
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        ),
      )}
    </SidebarMenu>
  );
}
