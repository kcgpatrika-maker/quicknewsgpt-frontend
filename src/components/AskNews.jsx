import React, { useState } from "react";

export default function AskNews() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const askNews = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch(`${BACKEND}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer("No related news found.");
      }
    } catch (err) {
      console.error("Error asking news:", err);
      setError("Error fetching response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuery("");
    setAnswer("");
    setError("");
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
