import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only once the client has hydrated. Replaces the `useState` +
 * `useEffect(() => setMounted(true), [])` mount-flag pattern — that pattern
 * calls setState synchronously inside an effect (flagged by
 * react-hooks/set-state-in-effect) and forces an extra render. Server and
 * first client render both return `false` (via getServerSnapshot), so no
 * hydration mismatch; React flips it to `true` right after hydrating.
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
