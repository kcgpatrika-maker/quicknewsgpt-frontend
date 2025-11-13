import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const handleAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      const list = data.news || data.samples || [];
      setResults(list);
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
    <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>

  // ✅ Reset function (newly added)
  const handleReset = () => {
    setQ("");
    setResults(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 10,
        }}
        className="ask-row"
      >
        <input
          className="ask-input"
          placeholder="Type a topic (e.g. Delhi, AI, monsoon...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="ask-btn"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "Asking..." : "Ask"}
        </button>

        {/* ✅ Reset button */}
        <button
          className="ask-btn"
          onClick={handleReset}
          style={{ backgroundColor: "#9ca3af" }}
        >
          Reset
        </button>
      </div>

      <div>
        {results === null && (
          <div style={{ color: "#6b7280" }}>
            Ask a topic to see related news instantly.
          </div>
        )}
        {results && results.length === 0 && (
          <div style={{ color: "#6b7280" }}>No related news found.</div>
        )}
        {results && results.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid #eef2ff",
                }}
              >
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>
                  {r.summary || r.description || ""}
                </div>
                {r.link && (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb", fontSize: 13 }}
                  >
                    Read full story
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
