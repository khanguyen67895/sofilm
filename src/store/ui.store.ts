import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  isAdminSidebarCollapsed: boolean;
  isLoginPromptOpen: boolean;
  loginPromptMessage: string | null;
  toggleMobileNav: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleAdminSidebar: () => void;
  openLoginPrompt: (message?: string) => void;
  closeLoginPrompt: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isMobileNavOpen: false,
      isSearchOpen: false,
      isAdminSidebarCollapsed: false,
      isLoginPromptOpen: false,
      loginPromptMessage: null,
      toggleMobileNav: () =>
        set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      toggleAdminSidebar: () =>
        set((state) => ({ isAdminSidebarCollapsed: !state.isAdminSidebarCollapsed })),
      openLoginPrompt: (message) =>
        set({ isLoginPromptOpen: true, loginPromptMessage: message ?? null }),
      closeLoginPrompt: () => set({ isLoginPromptOpen: false, loginPromptMessage: null }),
    }),
    {
      name: "sofilm-ui",
      partialize: (state) => ({ isAdminSidebarCollapsed: state.isAdminSidebarCollapsed }),
    }
  )
);
