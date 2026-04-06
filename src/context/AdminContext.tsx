"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("isAdminLoggedIn");
    if (saved === "true") {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("isAdminLoggedIn", "true");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isAdminLoggedIn");
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
