// src/components/AskNews.jsx
import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

  // Basic bilingual detection kept for internal sorting if needed
  function detectCategory(item) {
    const text = `${item.title || ""} ${item.summary || item.description || ""}`.toLowerCase();
    if (!text) return "General";
    if (text.includes("rajasthan") || text.includes("à¤œà¤¯à¤ªà¥�à¤°") || text.includes("jaipur")) return "Rajasthan";
    if (["india","bharat","delhi","à¤®à¥�à¤‚à¤¬à¤ˆ","à¤¦à¤¿à¤²à¥�à¤²à¥€"].some(k => text.includes(k))) return "India";
    if (["us","usa","china","russia","pakistan","tanzania","brazil","mexico"].some(k => text.includes(k))) return "World";
    for (const s of ["bihar","uttar","maharashtra","karnataka","punjab","kerala","west bengal"]) {
      if (text.includes(s)) return "State";
    }
    return "General";
  }

  // Ask: show full results (restore previous behavior) â€” but do not show category badge in UI
  const handleAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      const items = data?.news || data?.samples || (Array.isArray(data) ? data : []);
      const processed = (items || []).map(it => ({ ...it, _internalCategory: detectCategory(it) }));
      // restore previous behavior: return full list (up to 20)
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
    <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
        <input className="ask-input" placeholder="à¤•à¥�à¤µà¤¿à¤• à¤¨à¥�à¤¯à¥‚à¤œà¤¼ GPT à¤¸à¥‡ à¤ªà¥‚à¤›à¥‡à¤‚..." value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }} />
        <button className="ask-btn" onClick={handleAsk} disabled={loading} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", cursor: "pointer" }}>
          {loading ? "Loading..." : "Ask"}
        </button>
        <button onClick={handleReset} style={{ backgroundColor: "#9ca3af", color: "white", border: "none", borderRadius: "6px", padding: "8px 14px", cursor: "pointer" }}>
          Reset
        </button>
      </div>

      <div>
        {results === null && <div style={{ color: "#6b7280" }}>à¤•à¥‹à¤ˆ à¤µà¤¿à¤·à¤¯ à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚ (à¤œà¥ˆà¤¸à¥‡ à¤¦à¤¿à¤²à¥�à¤²à¥€, à¤¬à¤¿à¤¹à¤¾à¤°, AI...) â€” à¤”à¤° à¤•à¥�à¤µà¤¿à¤• à¤œà¤µà¤¾à¤¬ à¤ªà¤¾à¤�à¤‚à¥¤</div>}
        {results && results.length === 0 && <div style={{ color: "#6b7280" }}>No related news found.</div>}
        {results && results.length > 0 && (
          <div style={{ display: "grid", gap: "8px" }}>
            {results.map((r, i) => (
              <div key={r.link || r.id || i} style={{ padding: "10px", borderRadius: "10px", background: "#fff", border: "1px solid #eef2ff" }}>
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>{r.summary || r.description || ""}</div>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontSize: 13 }}>Read full story</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
