import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

  const handleAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      const processed = (data || []).map(it => ({ ...it, _detected: "Ask Result" }));
      setResults(processed.slice(0, 20));
    } catch (err) {
      console.error("Ask error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQ("");
    setResults(null);
  };

  return (
    <div style={{ background: "#f9fafb", padding: 16, borderRadius: 10, border: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          className="ask-input"
          placeholder="क्विक न्यूज़ GPT से पूछें..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
        <button onClick={handleAsk} disabled={loading} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
          {loading ? "Loading..." : "Ask"}
        </button>
        <button onClick={handleReset} style={{ backgroundColor: "#9ca3af", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
          Reset
        </button>
      </div>

      <div>
        {results === null && <div style={{ color: "#6b7280" }}>कोई विषय टाइप करें और क्विक जवाब पाएं।</div>}
        {results && results.length === 0 && <div style={{ color: "#6b7280" }}>No related news found.</div>}
        {results && results.length > 0 && <NewsList items={results} />}
      </div>
    </div>
  );
}
