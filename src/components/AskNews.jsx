import React, { useState } from "react";

export default function AskNews() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!query.trim()) {
      setError("कृपया कुछ लिखें।");
      return;
    }
    setLoading(true);
    setError("");
    setArticles([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/ask?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      // normalize (data.news / data.samples / data)
      const arr = data?.news || data?.samples || (Array.isArray(data) ? data : []);
      if (arr && arr.length > 0) {
        setArticles(arr);
      } else {
        setError("No related news found.");
      }
    } catch (err) {
      console.error("Ask error:", err);
      setError("Error fetching news. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ask-box" style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="e.g. AI, monsoon, startup..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, width: "100%" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleAsk} disabled={loading}>{loading ? "Asking..." : "Ask"}</button>
        <button onClick={() => { setQuery(""); setArticles([]); setError(""); }}>Reset</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {error && <div style={{ color: "#dc2626" }}>{error}</div>}
        {articles.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {articles.map((a, i) => (
              <div key={a.id || i} className="card" style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, color: "#1e3a8a" }}>{a.title}</div>
                <div style={{ color: "#374151", marginTop: 6 }}>{a.summary || a.description || a.content}</div>
                {a.link && (
                  <div style={{ marginTop: 8 }}>
                    <a href={a.link} target="_blank" rel="noreferrer" className="read-more">Read Full Story</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
