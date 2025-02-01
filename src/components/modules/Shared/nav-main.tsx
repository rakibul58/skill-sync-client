/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon, LayoutDashboardIcon, Tags } from "lucide-react";
import Link from "next/link";

// Define route types for each role
interface RouteItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const adminRoutes: RouteItem[] = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  {
    href: "/admin/categories",
    icon: Tags,
    label: "Categories",
  },
];

const teacherRoutes: RouteItem[] = [
  {
    href: "/teacher/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
];

const learnerRoutes: RouteItem[] = [
  {
    href: "/learner/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
];

export function NavMain({
  role,
  user,
}: {
  role: "ADMIN" | "TEACHER" | "LEARNER";
  user: any;
}) {
  // Select routes based on role
  const routes = (() => {
    switch (role) {
      case "ADMIN":
        return adminRoutes;
      case "TEACHER":
        return teacherRoutes;
      case "LEARNER":
        return learnerRoutes;
      default:
        return [];
    }
  })();

  return (
    <SidebarGroup className="mt-6 space-y-2">
      {routes.map((route: RouteItem) => (
        <SidebarMenuButton key={route.href}>
          <Link
            href={route.href}
            className="flex items-center gap-2 font-bold w-full"
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm w-full">
              <route.icon className="size-5" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <h1 className="text-sm truncate">{route.label}</h1>
              </div>
            </div>
          </Link>
        </SidebarMenuButton>
      ))}
    </SidebarGroup>
  );
}

export default NavMain;
