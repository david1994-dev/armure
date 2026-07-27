"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { hashPassword, isValidUsername } from "@/lib/auth";
import type { User } from "@/lib/types";

const USERS_KEY = "teeworld-users";
const SESSION_KEY = "teeworld-session";

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  hydrated: boolean;
  register: (username: string, password: string) => Promise<AuthResult>;
  login: (username: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): User[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const sessionUsername = window.localStorage.getItem(SESSION_KEY);
      if (sessionUsername) {
        const match = readUsers().find((candidate) => candidate.username === sessionUsername);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (match) setUser(match);
      }
    } catch {
      // Ignore malformed or inaccessible storage.
    }
    setHydrated(true);
  }, []);

  async function register(username: string, password: string): Promise<AuthResult> {
    if (!isValidUsername(username)) {
      return { ok: false, error: "Username must be 3-20 characters: letters, numbers, or underscore." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    const users = readUsers();
    if (users.some((candidate) => candidate.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: "That username is already taken." };
    }

    const newUser: User = {
      username,
      passwordHash: await hashPassword(password),
      joinedAt: new Date().toISOString(),
    };
    writeUsers([...users, newUser]);
    window.localStorage.setItem(SESSION_KEY, newUser.username);
    setUser(newUser);
    return { ok: true };
  }

  async function login(username: string, password: string): Promise<AuthResult> {
    const users = readUsers();
    const match = users.find((candidate) => candidate.username.toLowerCase() === username.toLowerCase());
    if (!match || match.passwordHash !== (await hashPassword(password))) {
      return { ok: false, error: "Incorrect username or password." };
    }
    window.localStorage.setItem(SESSION_KEY, match.username);
    setUser(match);
    return { ok: true };
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, hydrated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
