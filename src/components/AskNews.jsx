import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      const list = data.news || data.samples || [];
      setResults(list);
    } catch(err){
      console.error("Ask error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

    
  return (
    <div>
      <input
        type="text"
        placeholder="Ask anything about news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "80%",
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          marginRight: "8px",
        }}
      />
      <button onClick={askNews} disabled={loading}>
        {loading ? "Loading..." : "Ask"}
      </button>
      <button
        onClick={resetForm}
        style={{
          marginLeft: "6px",
          backgroundColor: "#9ca3af",
        }}
      >
        Reset
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {answer && (
        <div style={{ marginTop: "10px", color: "#111827" }}>
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
}
