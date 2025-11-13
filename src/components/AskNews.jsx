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

  // ✅ Reset function
  const handleReset = () => {
    setQ("");
    setResults(null);
  };

  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "16px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <input
          className="ask-input"
          placeholder="क्विक न्यूज़ GPT से पूछें..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />
        <button
          className="ask-btn"
          onClick={handleAsk}
          disabled={loading}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Ask"}
        </button>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div>
        {results === null && (
          <div style={{ color: "#6b7280" }}>
            कोई विषय टाइप करें (जैसे दिल्ली, बिहार, AI...) — और क्विक जवाब पाएं।
          </div>
        )}
        {results && results.length === 0 && (
          <div style={{ color: "#6b7280" }}>No related news found.</div>
        )}
        {results && results.length > 0 && (
          <div style={{ display: "grid", gap: "8px" }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
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
