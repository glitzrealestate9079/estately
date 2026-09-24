"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";

const SiteContext = createContext(null);

const LS_KEYS = {
  saved: "estately_site_saved",
  compare: "estately_site_compare",
  recent: "estately_site_recent_searches",
  auth: "estately_site_auth",
  savedSearches: "estately_site_saved_searches",
  myListings: "estately_site_my_listings",
};

function readLS(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota/availability errors */
  }
}

const MAX_COMPARE = 4;
const MAX_RECENT = 6;

// Standard SSR-safe "has this component hydrated on the client yet" idiom —
// the client snapshot flips to `true` only after React has hydrated, so it
// never disagrees with the server-rendered markup (no effect required).
function noopSubscribe() {
  return () => {};
}
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function SiteProvider({ children }) {
  const mounted = useHasMounted();
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  // Every piece of persisted state is re-read from localStorage whenever
  // `version` is bumped (after a write) or `mounted` flips true. `version`
  // is intentionally not referenced inside these callbacks — it exists only
  // to invalidate the memo, which is why exhaustive-deps is suppressed here.
  /* eslint-disable react-hooks/exhaustive-deps */
  const savedIds = useMemo(() => (mounted ? readLS(LS_KEYS.saved, []) : []), [mounted, version]);
  const compareIds = useMemo(() => (mounted ? readLS(LS_KEYS.compare, []) : []), [mounted, version]);
  const recentSearches = useMemo(() => (mounted ? readLS(LS_KEYS.recent, []) : []), [mounted, version]);
  const savedSearches = useMemo(() => (mounted ? readLS(LS_KEYS.savedSearches, []) : []), [mounted, version]);
  const myListings = useMemo(() => (mounted ? readLS(LS_KEYS.myListings, []) : []), [mounted, version]);
  const auth = useMemo(() => {
    if (!mounted) return { isAuthenticated: false, user: null };
    const saved = readLS(LS_KEYS.auth, null);
    return saved?.user ? { isAuthenticated: true, user: saved.user } : { isAuthenticated: false, user: null };
  }, [mounted, version]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const [authModal, setAuthModal] = useState({ open: false, pending: null, title: null, description: null });

  const toggleSave = useCallback(
    (id) => {
      const current = readLS(LS_KEYS.saved, []);
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      writeLS(LS_KEYS.saved, next);
      bump();
    },
    [bump]
  );

  const toggleCompare = useCallback(
    (id) => {
      const current = readLS(LS_KEYS.compare, []);
      if (current.includes(id)) {
        writeLS(LS_KEYS.compare, current.filter((x) => x !== id));
        bump();
        return { didAdd: false, atLimit: false };
      }
      if (current.length >= MAX_COMPARE) return { didAdd: false, atLimit: true };
      writeLS(LS_KEYS.compare, [...current, id]);
      bump();
      return { didAdd: true, atLimit: false };
    },
    [bump]
  );

  const clearCompare = useCallback(() => {
    writeLS(LS_KEYS.compare, []);
    bump();
  }, [bump]);

  const addRecentSearch = useCallback(
    (entry) => {
      const current = readLS(LS_KEYS.recent, []);
      const filtered = current.filter((r) => r.label.toLowerCase() !== entry.label.toLowerCase());
      writeLS(LS_KEYS.recent, [entry, ...filtered].slice(0, MAX_RECENT));
      bump();
    },
    [bump]
  );

  const clearRecentSearches = useCallback(() => {
    writeLS(LS_KEYS.recent, []);
    bump();
  }, [bump]);

  const addSavedSearch = useCallback(
    (entry) => {
      const current = readLS(LS_KEYS.savedSearches, []);
      const record = { id: `ss-${Date.now()}`, alertFrequency: "daily", createdAt: new Date().toISOString(), ...entry };
      writeLS(LS_KEYS.savedSearches, [record, ...current]);
      bump();
    },
    [bump]
  );

  const removeSavedSearch = useCallback(
    (id) => {
      const current = readLS(LS_KEYS.savedSearches, []);
      writeLS(LS_KEYS.savedSearches, current.filter((s) => s.id !== id));
      bump();
    },
    [bump]
  );

  const updateSavedSearchAlert = useCallback(
    (id, alertFrequency) => {
      const current = readLS(LS_KEYS.savedSearches, []);
      writeLS(LS_KEYS.savedSearches, current.map((s) => (s.id === id ? { ...s, alertFrequency } : s)));
      bump();
    },
    [bump]
  );

  const addListing = useCallback(
    (listing) => {
      const current = readLS(LS_KEYS.myListings, []);
      const created = {
        id: `MY-${Date.now()}`,
        status: "Active",
        views: 0,
        enquiries: 0,
        saves: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        ...listing,
      };
      writeLS(LS_KEYS.myListings, [created, ...current]);
      bump();
      return created;
    },
    [bump]
  );

  const updateListingStatus = useCallback(
    (id, status) => {
      const current = readLS(LS_KEYS.myListings, []);
      writeLS(LS_KEYS.myListings, current.map((l) => (l.id === id ? { ...l, status } : l)));
      bump();
    },
    [bump]
  );

  const removeListing = useCallback(
    (id) => {
      const current = readLS(LS_KEYS.myListings, []);
      writeLS(LS_KEYS.myListings, current.filter((l) => l.id !== id));
      bump();
    },
    [bump]
  );

  const openAuthGate = useCallback((pending, meta = {}) => {
    setAuthModal({ open: true, pending: pending ?? null, title: meta.title ?? null, description: meta.description ?? null });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal({ open: false, pending: null, title: null, description: null });
  }, []);

  const login = useCallback(
    (user) => {
      writeLS(LS_KEYS.auth, { user });
      bump();
      setAuthModal((prev) => {
        prev.pending?.(user);
        return { open: false, pending: null, title: null, description: null };
      });
    },
    [bump]
  );

  const logout = useCallback(() => {
    writeLS(LS_KEYS.auth, null);
    bump();
  }, [bump]);

  // Runs `action` immediately when signed in, otherwise opens the OTP gate
  // and re-invokes `action` once login succeeds — so the original intent
  // (save search, contact, post property…) is never lost.
  const requireAuth = useCallback(
    (action, meta) => {
      if (auth.isAuthenticated) {
        action(auth.user);
        return;
      }
      openAuthGate(action, meta);
    },
    [auth, openAuthGate]
  );

  const value = useMemo(
    () => ({
      mounted,
      savedIds,
      isSaved: (id) => savedIds.includes(id),
      toggleSave,
      compareIds,
      isComparing: (id) => compareIds.includes(id),
      toggleCompare,
      clearCompare,
      maxCompare: MAX_COMPARE,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      savedSearches,
      addSavedSearch,
      removeSavedSearch,
      updateSavedSearchAlert,
      myListings,
      addListing,
      updateListingStatus,
      removeListing,
      auth,
      login,
      logout,
      requireAuth,
      authModal,
      openAuthGate,
      closeAuthModal,
    }),
    [
      mounted,
      savedIds,
      toggleSave,
      compareIds,
      toggleCompare,
      clearCompare,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      savedSearches,
      addSavedSearch,
      removeSavedSearch,
      updateSavedSearchAlert,
      myListings,
      addListing,
      updateListingStatus,
      removeListing,
      auth,
      login,
      logout,
      requireAuth,
      authModal,
      openAuthGate,
      closeAuthModal,
    ]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}
