import React, { useState } from "react";

export default function AskNews() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  // -----------------------------------------
  // CATEGORY DETECTION (Strong + Corrected)
  // -----------------------------------------
  function detectCategory(item) {
    const text = (
      `${item.title || ""} ${item.summary || ""} ${item.description || ""}`
    ).toLowerCase();

    // 1) Rajasthan — highest priority
    if (text.includes("rajasthan") || text.includes("jaipur") || text.includes("udaipur")) {
      return "Rajasthan";
    }

    // 2) State (ANY Indian state)
    const states = [
      "bihar","patna","jharkhand","up","uttar pradesh","mp","madhya pradesh",
      "tamil nadu","telangana","andhra","gujarat","punjab","haryana","kerala",
      "karnataka","assam","odisha","chhattisgarh","himachal","uttarakhand",
      "tripura","manipur","mizoram","nagaland","arunachal","goa","sikkim",
      "maharashtra","mumbai","kolkata","west bengal"
    ];

    for (const s of states) {
      if (text.includes(s)) return "State";
    }

    // 3) India (National stories)
    if (
      text.includes("india") ||
      text.includes("delhi") ||
      text.includes("modi") ||
      text.includes("parliament") ||
      text.includes("supreme court")
    ) {
      return "India";
    }

    // 4) International
    const world = ["us ", "usa", "america", "china", "pakistan", "uk ", "russia"];
    for (const w of world) {
      if (text.includes(w)) return "World";
    }

    return "General";
  }

  // -----------------------------------------
  // SELECT TOP-3 HEADLINES IN CORRECT ORDER
  // -----------------------------------------
 const pickTopThree = (list) => {
  if (!list || list.length === 0) return [];

  const world = list.filter(n => (n.category || "").toLowerCase() === "world");
  const india = list.filter(n => (n.category || "").toLowerCase() === "india");
  const rajasthan = list.filter(n => (n.category || "").toLowerCase() === "rajasthan");
  const state = list.filter(n => (n.category || "").toLowerCase() === "state");
  const general = list.filter(n => (n.category || "").toLowerCase() === "general");

  const final = [];

  // 1) First Priority: World -> else India -> else anything
  final.push(
    world[0] || india[0] || list[0]
  );

  // 2) Second Priority: India -> else State -> else General -> else anything remaining
  final.push(
    india.find(i => !final.includes(i)) ||
    state.find(s => !final.includes(s)) ||
    general.find(g => !final.includes(g)) ||
    list.find(x => !final.includes(x))
  );

  // 3) Third Priority: Rajasthan -> else State -> else General -> else anything remaining
  final.push(
    rajasthan.find(r => !final.includes(r)) ||
    state.find(s => !final.includes(s)) ||
    general.find(g => !final.includes(g)) ||
    list.find(x => !final.includes(x))
  );

  // Remove duplicates if any
  const unique = final.filter((v, i, a) => v && a.indexOf(v) === i);

  // If still less than 3, fill with remaining
  while (unique.length < 3) {
    const extra = list.find(x => !unique.includes(x));
    if (!extra) break;
    unique.push(extra);
  }

  return unique.slice(0, 3);
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

      // Normalize items array from different payload shapes
      const items = data?.news || data?.samples || (Array.isArray(data) ? data : []);

      // Add category to each news item
      const processed = items.map((item) => ({
        ...item,
        category: detectCategory(item),
      }));
const processed = items.map((item) => ({
  ...item,
  category: detectCategory(item),
}));

console.log("TOTAL NEWS:", processed.length, processed);

      // Choose top-3 according to rules
      const topThree = pickTopThree(processed);

      setResults(topThree);
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
