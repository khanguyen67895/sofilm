import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  isAdminSidebarCollapsed: boolean;
  toggleMobileNav: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleAdminSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isMobileNavOpen: false,
      isSearchOpen: false,
      isAdminSidebarCollapsed: false,
      toggleMobileNav: () =>
        set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      toggleAdminSidebar: () =>
        set((state) => ({ isAdminSidebarCollapsed: !state.isAdminSidebarCollapsed })),
    }),
    {
      name: "sofilm-ui",
      partialize: (state) => ({ isAdminSidebarCollapsed: state.isAdminSidebarCollapsed }),
    }
  )
);
