import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export function AuthProvider({ children }) {
  const mountedRef = useRef(false);
  const profileCacheRef = useRef(new Map());
  const inFlightRef = useRef(null);
  const currentUserIdRef = useRef(null);
  const profileRef = useRef(null);
  const applyTokenRef = useRef(0);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const loadProfile = useCallback(async (userId) => {
    if (profileCacheRef.current.has(userId)) {
      return profileCacheRef.current.get(userId);
    }

    if (inFlightRef.current?.userId === userId) {
      return inFlightRef.current.promise;
    }

    const promise = fetchProfile(userId).then((result) => {
      profileCacheRef.current.set(userId, result);
      return result;
    });

    inFlightRef.current = { userId, promise };

    try {
      return await promise;
    } finally {
      if (inFlightRef.current?.userId === userId) {
        inFlightRef.current = null;
      }
    }
  }, []);

  const applySession = useCallback(
    async (nextSession, { forceProfileRefresh = false } = {}) => {
      const applyToken = ++applyTokenRef.current;
      setSession(nextSession);

      if (!nextSession?.user) {
        currentUserIdRef.current = null;
        setProfile(null);
        setLoading(false);
        return;
      }

      const userId = nextSession.user.id;

      if (forceProfileRefresh) {
        profileCacheRef.current.delete(userId);
      }

      const hasSameUser = currentUserIdRef.current === userId;
      const hasProfile = profileCacheRef.current.has(userId) || profileRef.current?.id === userId;

      if (hasSameUser && hasProfile && !forceProfileRefresh) {
        setLoading(false);
        if (profileCacheRef.current.has(userId)) {
          setProfile(profileCacheRef.current.get(userId));
        }
        return;
      }

      setLoading(true);

      try {
        const resolvedProfile = await loadProfile(userId);
        if (!mountedRef.current || applyToken !== applyTokenRef.current) return;

        currentUserIdRef.current = userId;
        setProfile(resolvedProfile);
      } catch {
        if (!mountedRef.current || applyToken !== applyTokenRef.current) return;

        currentUserIdRef.current = userId;
        setProfile(null);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [loadProfile],
  );

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    await applySession(session, { forceProfileRefresh: true });
  }, [applySession, session]);

  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    let cancelled = false;

    const bootstrap = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (cancelled) return;
        await applySession(initialSession);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (cancelled) return;

      if (event === "SIGNED_OUT") {
        applyTokenRef.current += 1;
        profileCacheRef.current.clear();
        currentUserIdRef.current = null;
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const forceRefresh = event === "USER_UPDATED";
      void applySession(nextSession, { forceProfileRefresh: forceRefresh });
    });

    return () => {
      cancelled = true;
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      profile,
      loading,
      isSupabaseConfigured,
      refreshProfile,
    }),
    [session, profile, loading, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
