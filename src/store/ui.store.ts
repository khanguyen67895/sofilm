import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  toggleMobileNav: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  isSearchOpen: false,
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
