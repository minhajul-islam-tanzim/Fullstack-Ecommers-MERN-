
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Pencil, Lock, LogOut } from "lucide-react";

import { getMe, logoutUser } from "@/services/authService";

import { updateUserName } from "@/services/userEditServices";

type UserType = {
  id: string;
  name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Get logged-in user
  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data.user);
        setName(data.user.name);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Logout
  const handleLogOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Edit name
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      setMessage("Name is required");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await updateUserName(updatedName);

      setUser((prev) =>
        prev ? { ...prev, name: updatedName } : prev
      );

      setIsEditing(false);
      setMessage("Name updated successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-linear-to-br from-orange-50 via-white to-gray-100 px-4 py-12">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">

        {/* Banner */}
        <div className="relative z-0 h-44 overflow-hidden bg-linear-to-br from-orange-400 via-orange-500 to-rose-500">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/20" />
          <div className="absolute -bottom-14 right-0 h-52 w-52 rounded-full bg-white/10" />
          <div className="absolute right-20 top-8 h-16 w-16 rounded-full bg-white/20" />
        </div>

        <div className="flex flex-col items-center px-6 pb-10 sm:px-10">

          {/* Avatar */}
          <div className="relative z-10 -mt-20 rounded-full bg-white p-2 shadow-xl">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-linear-to-br from-gray-800 to-black text-6xl font-bold uppercase text-white">
              {user.name.charAt(0)}
            </div>
          </div>

          {/* Name / Edit Form */}
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-3"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-lg outline-none focus:border-orange-500"
              />

              <div className="flex justify-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName(user.name);
                    setIsEditing(false);
                    setMessage("");
                  }}
                  className="rounded-full bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-gray-900">
                {user.name}
              </h1>

              <button
                type="button"
                onClick={() => {
                  setName(user.name);
                  setIsEditing(true);
                  setMessage("");
                }}
                className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                <Pencil size={15} />
                Edit name
              </button>
            </>
          )}

          {/* Message */}
          {message && (
            <p className="mt-3 text-center text-sm text-green-600">
              {message}
            </p>
          )}

          {/* Email */}
          <div className="mt-4 flex max-w-full items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm text-gray-600">
            <Mail size={18} className="shrink-0 text-orange-500" />
            <span className="truncate">{user.email}</span>
          </div>

          <div className="my-8 h-px w-full bg-gray-100" />

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">

            <Link
              href="/profile/change-password"
              className="group flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-gray-900 px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-500"
            >
              <Lock size={16} />
              Change password
            </Link>

            <button
              onClick={handleLogOut}
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-red-50 px-6 py-3.5 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-600 hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
