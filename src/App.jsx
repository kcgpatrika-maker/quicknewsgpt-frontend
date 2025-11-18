// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
const SHOW_CONNECTED = false;

const toLower = (s) => (s || "").toLowerCase();

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
  return arr.some(k => t.includes(k.toLowerCase()));
}

function detectCategoryForItem(item = {}) {
  const txt = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`.trim();
  if (textHasAny(txt, KEYWORDS.rajasthan)) return "rajasthan";
  if (textHasAny(txt, KEYWORDS.international)) return "international";
  if (textHasAny(txt, KEYWORDS.india)) return "india";
  return "general";
}

function selectSlots(items = []) {
  const list = Array.isArray(items) ? items.slice() : [];
  const processed = list.map((it, idx) => ({ ...it, __cat: detectCategoryForItem(it), __i: idx }));

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

  pick(p => p.__cat === "international");
  if (chosen.length === 0) pick(p => p.__cat === "india");
  if (chosen.length === 0) pick(p => true);

  pick(p => p.__cat === "india");
  if (chosen.length < 2) pick(p => true);

  pick(p => p.__cat === "rajasthan");
  if (chosen.length < 3) pick(p => true);

  while (chosen.length < 3) chosen.push(null);

  return chosen.map((p) => {
    if (!p) return null;
    const { __cat, __i, ...rest } = p;
    return { ...rest, _detected: __cat };
  });
}

export default function App() {
  const [allNews, setAllNews] = useState([]);
  const [slots, setSlots] = useState([null, null, null]);
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
      setAllNews(Array.isArray(items) ? items : []);
      setLastUpdated(new Date());
    } catch (err) {
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
      {/* ===================== HEADER ===================== */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        {/* === NEW — Share-link placeholder will be replaced later === */}
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
            
            {/* SHARE BUTTON PLACEHOLDER — replace later */}
            <button
              title="Share"
              style={{
                border: "1px solid #d1d5db",
                background: "white",
                padding: "5px 8px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14
              }}
            >
              🔗
            </button>

            {/* Updated Time + Refresh (moved to front) */}
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {timeString ? `Updated ${timeString}` : ""}
            </div>

            <button
              onClick={handleRefresh}
              title="Refresh"
              style={{
                border: "none",
                background: "#2563eb",
                color: "white",
                padding: "6px 8px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14
              }}
            >
              ↻
            </button>

          </div>
        </div>
      </div>

      {/* ===================== MAIN ===================== */}
      <div className="container">
        <main className="main-column">
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

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
