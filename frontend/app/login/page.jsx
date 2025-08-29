"use client";
import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api("/api/auth/login", { method: "POST", body: { email, password } });
      login(res);
      router.push("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-white flex flex-col">
      
      {/* Main Content - Sign In Form */}
      <main className="flex-1 flex items-center justify-center px-4 ">
        <div className="w-full max-w-md">
          {/* Sign In Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <h1 className="text-2xl font-serif text-center text-gray-900 mb-8">
              Sign In
            </h1>
            
            <form onSubmit={submit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
                  PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-md font-medium uppercase tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                SIGN IN
              </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Aether?{" "}
                <Link 
                  href="/register" 
                  className="text-blue-600 underline hover:text-blue-700 font-medium"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
