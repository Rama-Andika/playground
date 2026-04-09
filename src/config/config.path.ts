import { RxDashboard } from "react-icons/rx";
import type { IconType } from "react-icons";
import { IoPersonAddOutline } from "react-icons/io5";
import type { FileRouteTypes } from "@tanstack/react-router";
import { TbFileInvoice } from "react-icons/tb";
import { HiOutlineDocumentReport } from "react-icons/hi";

export type AppRoutePath = FileRouteTypes["fullPaths"];

type ItemType = {
  title: string;
  url: AppRoutePath;
  exact?: boolean;
};

export type ContentType = {
  title: string;
  url?: AppRoutePath;
  icon: IconType;
  isActive: boolean;
  items: ItemType[];
};

export const content = {
  content: [
    {
      title: "Monitoring",
      url: "/monitoring",
      icon: RxDashboard,
      isActive: false,
      items: [],
    },
    {
      title: "Registrations",
      url: "/registration",
      icon: IoPersonAddOutline,
      isActive: false,
      items: [
        {
          title: "New Registration",
          url: "/registration/new",
        },
        {
          title: "Records",
          url: "/registration/records",
        },
      ],
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: TbFileInvoice,
      isActive: false,
      items: [
        {
          title: "New Invoice",
          url: "/invoices/new",
          exact: true,
        },
        {
          title: "Records",
          url: "/invoices",
          exact: true,
        },
      ],
    },
    // {
    //   title: "Promotion",
    //   url: "/promotions",
    //   icon: MdOutlineDiscount,
    //   isActive: false,
    //   items: [],
    // },
    {
      title: "Reports",
      url: "/reports",
      icon: HiOutlineDocumentReport,
      isActive: false,
      items: [],
    },
  ] as ContentType[],
};
