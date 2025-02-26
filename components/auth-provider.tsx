"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  loginGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  // signIn: (email: string, password: string) => Promise<void>;
  // signUp: (email: string, password: string) => Promise<void>;
  // signOut: () => Promise<void>;
};

export function getAuthToken(): string | undefined {
  return Cookies.get('firebaseIdToken');
}

export function setAuthToken(token: string): void {
  Cookies.set('firebaseIdToken', token, { secure: true });
}

export function removeAuthToken(): void {
  Cookies.remove('firebaseIdToken');
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        removeAuthToken();
      }
      if (user) {        
        const token = await user.getIdToken();
        const tokenValues = await user.getIdTokenResult();
        setCurrentUser(user);
        setAuthToken(token);
        setIsAdmin(tokenValues.claims.role === "admin");
      }
    });
  }, []);

  function loginGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      signInWithPopup(auth, new GoogleAuthProvider())
        .then((userCredential) => {
          setCurrentUser(userCredential.user);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  function logOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      auth.signOut()
        .then(() => {
          setCurrentUser(null);
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loginGoogle,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};