"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDoc } from "firebase/firestore";
import { docs } from "@/lib/firebase-helpers";
import type { User } from "@/types";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  mounted: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userData: null,
  loading: true,
  isApproved: false,
  isAdmin: false,
  mounted: false,
  refreshUserData: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(docs.user(uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    }
  };

  const refreshUserData = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser.uid);
    }
  };

  useEffect(() => {
    // Mark as mounted after hydration to prevent hydration mismatches
    // Using queueMicrotask to satisfy linter while still being synchronous-like
    queueMicrotask(() => setMounted(true));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isApproved = userData?.accountStatus === "active";
  const isAdmin = userData?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        loading,
        isApproved,
        isAdmin,
        mounted,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
