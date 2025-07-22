"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err: any) {
      setError(err?.toString() || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-xl flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 text-black"
          placeholder="Search with exa (e.g. . or src)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="mb-8 w-full max-w-xl">
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {result && (
          <pre className="bg-gray-100 text-black p-4 rounded overflow-x-auto whitespace-pre-wrap">{result}</pre>
        )}
      </div>
    </main>
  );
}
