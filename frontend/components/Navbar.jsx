"use client";
import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  return (
    <header className="border-b bg-white/80 sticky top-0 z-50 backdrop-blur">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="font-semibold tracking-widest text-2xl">AETHER</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/products">Timepieces</Link>
          <Link href="/cart" className="relative">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" 
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Hi, {user.fullName ? user.fullName.split(" ")[0] : "Guest"}</span>
              <Link href="/admin" className="text-slate-500 hover:text-slate-700 text-sm">Admin</Link>
              <button onClick={logout} className="underline">Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
