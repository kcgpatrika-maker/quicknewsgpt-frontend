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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      // अगर सर्वर से सही JSON नहीं आता
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      if (data.answer) {
        setAnswer(data.answer);
      } else if (data.output) {
        // fallback (कुछ बैकएंड 'output' key में जवाब भेजते हैं)
        setAnswer(data.output);
      } else {
        setAnswer("No related news found.");
      }
    } catch (err) {
      console.error("Error asking news:", err);
      setError("Server is responding slowly. Please try again in a few seconds.");
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
        placeholder="क्विक न्यूज़ GPT से कुछ भी पूछें..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && askNews()}
        style={{
          width: "80%",
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          marginRight: "8px",
        }}
      />
      <button
        onClick={askNews}
        disabled={loading}
        style={{
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 14px",
        }}
      >
        {loading ? "Loading..." : "Ask"}
      </button>
      <button
        onClick={resetForm}
        style={{
          marginLeft: "6px",
          backgroundColor: "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 14px",
        }}
      >
        Reset
      </button>

      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
      {answer && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        >
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
}
