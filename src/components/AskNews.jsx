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
    const world = list.filter((n) => (n.category || "").toLowerCase() === "world");
    const india = list.filter((n) => (n.category || "").toLowerCase() === "india");
    const rajasthan = list.filter((n) => (n.category || "").toLowerCase() === "rajasthan");
    const state = list.filter((n) => (n.category || "").toLowerCase() === "state");
    const general = list.filter((n) => !n.category || (n.category || "").toLowerCase() === "general");

    const final = [];

    // 1) First: world -> else india
    if (world[0]) final.push(world[0]);
    else if (india[0]) final.push(india[0]);

    // 2) Second: india -> else any state
    if (india[0] && (final[0] !== india[0])) final.push(india[0]);
    else if (state[0] && !final.includes(state[0])) final.push(state[0]);

    // 3) Third: rajasthan -> else any state -> else general
    if (rajasthan[0] && !final.includes(rajasthan[0])) final.push(rajasthan[0]);
    else {
      // pick any state not already used
      const st = state.find(s => !final.includes(s));
      if (st) final.push(st);
      else {
        const g = general.find(g => !final.includes(g));
        if (g) final.push(g);
      }
    }

    // Fill if less than 3 with any remaining items (avoid duplicates)
    const remaining = list.filter(item => !final.includes(item));
    for (const r of remaining) {
      if (final.length >= 3) break;
      final.push(r);
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

      // Normalize items array from different payload shapes
      const items = data?.news || data?.samples || (Array.isArray(data) ? data : []);

      // Add category to each news item
      const processed = items.map((item) => ({
        ...item,
        category: detectCategory(item),
      }));

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
