import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

  const handleAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error("Ask error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQ("");
    setResults([]);
  };

  return (
    <div style={{ padding: 16, background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input placeholder="क्विक न्यूज़ GPT से पूछें..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
        <button onClick={handleAsk} disabled={loading} style={{ backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
          {loading ? "Loading..." : "Ask"}
        </button>
        <button onClick={handleReset} style={{ backgroundColor: "#9ca3af", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
          Reset
        </button>
      </div>

      {results.length === 0 && !loading && <div style={{ color: "#6b7280" }}>कोई विषय टाइप करें और क्विक जवाब पाएं।</div>}
      {results.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {results.map((r, i) => (
            <div key={r.url || i} style={{ padding: 10, borderRadius: 10, background: "#fff", border: "1px solid #eef2ff" }}>
              <div style={{ fontWeight: 600 }}>{r.title}</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{r.summary || ""}</div>
              {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontSize: 13 }}>Read full story</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
