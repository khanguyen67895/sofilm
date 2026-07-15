"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Film, GalleryHorizontal, LayoutDashboard, UploadCloud, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { href: ROUTES.admin, label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: ROUTES.adminMovies, label: "Danh sách phim", icon: Film, matchEditChild: true },
  { href: ROUTES.adminMovieNew, label: "Đăng phim mới", icon: UploadCloud, exact: true },
  { href: ROUTES.adminBanners, label: "Hero trang chủ", icon: GalleryHorizontal, matchEditChild: true },
] as const;

function isNavItemActive(
  pathname: string,
  item: (typeof NAV_ITEMS)[number]
): boolean {
  if (pathname === item.href) return true;
  if ("exact" in item && item.exact) return false;
  if ("matchEditChild" in item && item.matchEditChild) {
    return pathname.startsWith(`${item.href}/`) && pathname.endsWith("/edit");
  }
  return false;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-black transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-3">
          {!collapsed && (
            <span className="font-heading truncate text-sm font-semibold tracking-wide text-white uppercase">
              SO<span className="text-brand">FILM</span>
            </span>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white md:flex"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Đóng menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-brand/15 text-brand" : "text-white/70 hover:bg-white/5 hover:text-white",
                  collapsed && "justify-center"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
