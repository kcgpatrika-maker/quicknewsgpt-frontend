import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  // -----------------------------------------
  // CATEGORY DETECTION (Strong + Corrected)
  // -----------------------------------------
  const detectCategory = (text = "") => {
    const t = text.toLowerCase();

    // Rajasthan
    if (/rajasthan|jaipur|udaipur|jodhpur/.test(t)) {
      return "Rajasthan";
    }

    // All Indian States
    const stateList = [
      "bihar","up","uttar pradesh","mp","madhya pradesh","tamil nadu",
      "kerala","karnataka","punjab","haryana","assam","gujarat",
      "telangana","andhra","odisha","jharkhand","chhattisgarh",
      "maharashtra","west bengal","uttarakhand","himachal",
      "goa","tripura","manipur","mizoram","nagaland","sikkim"
    ];

    if (stateList.some((st) => t.includes(st))) {
      return "State";
    }

    // India (national level)
    if (/india|delhi|mumbai|kolkata|national|modi|government/.test(t)) {
      return "India";
    }

    // World
    if (/usa|america|china|russia|pakistan|uk|europe|france|japan|united nations/.test(t)) {
      return "World";
    }

    return "General";
  };

  // -----------------------------------------
  // SELECT TOP-3 HEADLINES IN CORRECT ORDER
  // -----------------------------------------
  const pickTopThree = (list) => {
    const world = list.filter((n) => n.category === "World");
    const india = list.filter((n) => n.category === "India");
    const rajasthan = list.filter((n) => n.category === "Rajasthan");
    const state = list.filter((n) => n.category === "State");
    const general = list.filter((n) => n.category === "General");

    const final = [];

    if (world[0]) final.push(world[0]);
    if (india[0]) final.push(india[0]);
    if (rajasthan[0]) final.push(rajasthan[0]);
    if (!rajasthan[0] && state[0]) final.push(state[0]);

    // If still less than 3, fill with state, then general
    const pool = [...state.slice(1), ...general];

    while (final.length < 3 && pool.length > 0) {
      final.push(pool.shift());
    }

    return final.slice(0, 3);
  };

  // -----------------------------------------
  // FETCH + PROCESS NEWS
  // -----------------------------------------
  const handleAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${BACKEND}/ask?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      const list = data.news || data.samples || [];

      // Add category to each news item
      const processed = list.map((item) => {
        const txt = `${item.title} ${item.summary} ${item.description}`;
        return {
          ...item,
          category: detectCategory(txt),
        };
      });

      // Select top 3
      const topThree = pickTopThree(processed);
      setResults(topThree);
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
                <div
                  style={{
                    display: "inline-block",
                    background: "#e0f2fe",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: 12,
                    color: "#0369a1",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  {r.category}
                </div>

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
