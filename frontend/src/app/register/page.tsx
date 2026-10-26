"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/services/authService";



export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  
  const router = useRouter();
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try{
      await registerUser(name, email, password)
          router.push("/login");
          setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    } catch(err){
        setError(err instanceof Error ? err.message : "Something went wrong");
        
        console.log('there is an error ', err)
    }  finally {
      setLoading(false);
    }

  };

  return (
    <main className="flex mt-25 items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-orange-500">TM</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Create your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                suppressHydrationWarning
                placeholder="Your name"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                suppressHydrationWarning
                placeholder="you@example.com"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Toggle password"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm Password
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Your Password"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-orange-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}