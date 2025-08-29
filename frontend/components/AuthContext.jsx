"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const cart = await response.json();
        if (cart && cart.products) {
          const totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
          localStorage.setItem("cartCount", totalItems.toString());
        }
      }
    } catch (error) {
      console.error("Failed to load cart count:", error);
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
    // Load cart count from localStorage if available
    const count = localStorage.getItem("cartCount");
    if (count) setCartCount(parseInt(count));
  }, []);

  useEffect(() => {
    if (token) {
      loadCartCount();
    }
  }, [token]);

  const login = ({ token, user }) => {
    setToken(token); setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };
  const logout = () => {
    setToken(null); setUser(null);
    setCartCount(0);
    localStorage.removeItem("token"); localStorage.removeItem("user");
    localStorage.removeItem("cartCount");
  };

  const updateCartCount = (count) => {
    const validCount = Math.max(0, count);
    setCartCount(validCount);
    localStorage.setItem("cartCount", validCount.toString());
  };

  const incrementCartCount = (quantity = 1) => {
    const newCount = Math.max(0, cartCount + quantity);
    setCartCount(newCount);
    localStorage.setItem("cartCount", newCount.toString());
  };

  return <AuthCtx.Provider value={{ token, user, login, logout, cartCount, updateCartCount, incrementCartCount, loadCartCount }}>{children}</AuthCtx.Provider>
}
