// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
// Toggle to show backend URL in header (you said not needed by default)
const SHOW_CONNECTED = false;

const toLower = (s) => (s || "").toLowerCase();

// bilingual keywords (english + hindi short tokens) — extend as needed
const KEYWORDS = {
  international: [
    "world","international","foreign","us","u.s.","usa","america","united states",
    "china","russia","pakistan","bangladesh","global","europe","uk","britain","ब्राज़ील","ब्रज़ील","brazil","mexico","tanzania"
  ],
  india: [
    "india","bharat","delhi","mumbai","bangalore","bengaluru","chennai","kolkata","modi",
    "parliament","संसद","भारत","दिल्ली","मुंबई","बेंगलुरु","बंगलोर","कोलकाता"
  ],
  rajasthan: [
    "rajasthan","जयपुर","jaipur","jodhpur","उदयपुर","udaipur","ajmer",
    "बिकानेर","bikaner","jaisalmer","alwar","सिकर","sikar"
  ]
};

function textHasAny(text = "", arr = []) {
  const t = toLower(text);
  return arr.some(k => {
    if (!k) return false;
    return t.includes(k.toLowerCase());
  });
}

function detectCategoryForItem(item = {}) {
  const txt = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`.trim();
  // Priority: Rajasthan -> International -> India -> fallback general
  if (textHasAny(txt, KEYWORDS.rajasthan)) return "rajasthan";
  if (textHasAny(txt, KEYWORDS.international)) return "international";
  if (textHasAny(txt, KEYWORDS.india)) return "india";
  return "general";
}

// Select exactly three slots (one per fixed category) with sensible fallbacks:
//  slotA: international -> fallback india -> fallback any
//  slotB: india -> fallback any(not chosen)
//  slotC: rajasthan -> fallback any(not chosen)
function selectSlots(items = []) {
  const list = Array.isArray(items) ? items.slice() : [];
  const processed = list.map((it, idx) => ({ ...it, __cat: detectCategoryForItem(it), __i: idx }));

  // for debugging: show what was detected
  // eslint-disable-next-line no-console
  console.log("[selectSlots] detected categories:", processed.map(p => ({ title: p.title, cat: p.__cat })));

  const chosen = [];
  const usedIdx = new Set();

  const pick = (predicate) => {
    for (const p of processed) {
      if (usedIdx.has(p.__i)) continue;
      if (predicate(p)) {
        usedIdx.add(p.__i);
        chosen.push(p);
        return p;
      }
    }
    return null;
  };

  // slot 1: international -> india -> any
  pick(p => p.__cat === "international");
  if (chosen.length === 0) pick(p => p.__cat === "india");
  if (chosen.length === 0) pick(p => true);

  // slot 2: india -> any(not used)
  pick(p => p.__cat === "india");
  if (chosen.length < 2) pick(p => true);

  // slot 3: rajasthan -> any(not used)
  pick(p => p.__cat === "rajasthan");
  if (chosen.length < 3) pick(p => true);

  // Ensure we always return 3 slots (fill with placeholders as nulls)
  while (chosen.length < 3) chosen.push(null);

  // Map to clean items: keep original fields, and include detected category in _detected
  return chosen.map((p) => {
    if (!p) return null;
    const { __cat, __i, ...rest } = p;
    return { ...rest, _detected: __cat };
  });
}

export default function App() {
  const [allNews, setAllNews] = useState([]);
  const [slots, setSlots] = useState([null, null, null]); // slot0 -> International, slot1 -> India, slot2 -> Rajasthan/State
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = data?.news || data?.items || data?.samples || [];
      // ensure items is array
      setAllNews(Array.isArray(items) ? items : []);
      // set lastUpdated only on success
      setLastUpdated(new Date());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("fetchNews error:", err);
      setError("Failed to load news.");
      setAllNews([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchNews]);

  // recompute slots when allNews updates
  useEffect(() => {
    const chosen = selectSlots(allNews);
    setSlots(chosen);
  }, [allNews]);

  const handleRefresh = async () => {
    await fetchNews();
  };

  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
            {/* Show only time (you asked earlier to hide date) */}
            <div style={{ fontSize: 13, color: "#6b7280" }}>{timeString ? `Updated ${timeString}` : ""}</div>
            <button
              onClick={handleRefresh}
              title="Refresh"
              style={{
                border: "none",
                background: "#0ea5e9",
                color: "white",
                padding: "6px 8px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ↻
            </button>
            {SHOW_CONNECTED && <div style={{ fontSize: 12, color: "#0f172a" }}>{BACKEND}</div>}
          </div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            {/* Fixed vertical categories with their slot content below each */}
            <div style={{ marginTop: 8 }}>
              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🌍 International</div>
                {loading ? (
                  <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : slots[0] ? (
                  <NewsList items={[slots[0]]} hideBadge={true} />
                ) : (
                  <div className="news-item card" style={{ padding: 10 }}>No news available.</div>
                )}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🇮🇳 India</div>
                {loading ? (
                  <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : slots[1] ? (
                  <NewsList items={[slots[1]]} hideBadge={true} />
                ) : (
                  <div className="news-item card" style={{ padding: 10 }}>No news available.</div>
                )}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🏜️ Rajasthan / State</div>
                {loading ? (
                  <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : slots[2] ? (
                  <NewsList items={[slots[2]]} hideBadge={true} />
                ) : (
                  <div className="news-item card" style={{ padding: 10 }}>No news available.</div>
                )}
              </div>
            </div>
          </section>

          <div className="card ad" style={{ marginTop: 12 }}>Advertisement Space</div>

          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer" style={{ marginTop: 12, color: "#6b7280" }}>
            © 2025 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
          </div>
        </main>

        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
