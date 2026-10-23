import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <p className="text-gray-600">Page not found</p>
      <Link
        href="/"
        className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Go Home
      </Link>
    </main>
  );
}