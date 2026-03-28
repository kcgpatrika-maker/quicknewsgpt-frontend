import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND =
    import.meta.env.VITE_BACKEND_URL ||
    "https://quick-newsgpt-backend.onrender.com";

  const handleAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(
        `${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`
      );
      const data = await res.json();

      const items = data?.news || [];
      if (items.length === 0) {
        setResults({ message: "कृपया करंट इश्यू या घटनाक्रम से जुड़े नाम लिखें।" });
      } else {
        setResults(items.slice(0, 20));
      }
    } catch (err) {
      console.error("Ask error:", err);
      setResults({ message: "सर्च में समस्या आई। कृपया दोबारा प्रयास करें।" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQ("");
    setResults(null);
  };

  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        marginTop: "16px"
      }}
    >
      
      {/* Input + Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <input
          placeholder="देश/ राज्य/ शहर/ प्रमुख व्यक्ति/ विषय लिखें..."
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

      {/* Results */}
      <div>
        {results === null && (
          <div style={{ color: "#6b7280" }}>
            देश, राज्य, शहर या प्रमुख व्यक्ति का नाम लिखें और ताज़ा खबरें पाएं।
          </div>
        )}

        {results && results.message && (
          <div style={{ color: "red" }}>{results.message}</div>
        )}

        {Array.isArray(results) && results.length > 0 && (
          <div style={{ display: "grid", gap: "8px" }}>
            {results.map((r, i) => (
              <div
                key={r.link || r.id || i}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  background: "#fff",
                  border: "1px solid #eef2ff",
                }}
              >
                <div style={{ fontWeight: 600 }}>{r.title}</div>
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
