// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Trending from "./components/Trending";
import LiveTV from "./components/LiveTV";
import WikipediaSearch from "./components/WikipediaSearch";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
const toLower = (s) => (s || "").toLowerCase();

const KEYWORDS = {
  international: ["world","international","foreign","us","usa","america","china","russia","pakistan","global","europe","uk","brazil","mexico"],
  india: ["india","bharat","delhi","mumbai","bangalore","bengaluru","chennai","kolkata","भारत","दिल्ली","मुंबई"],
  rajasthan: ["rajasthan","जयपुर","jaipur","jodhpur","उदयपुर","udaipur","ajmer","बीकानेर","bikaner","jaisalmer","alwar","सीकर","sikar"]
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
  const [customNews, setCustomNews] = useState([]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      const items = data?.news || data?.items || [];
      setAllNews(Array.isArray(items) ? items : []);
      setLastUpdated(new Date());

      const resCustom = await fetch(`${BACKEND}/custom`);
      const dataCustom = await resCustom.json();
      setCustomNews(dataCustom.news || []);
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
      {window.location.pathname === "/privacy" ? (
        <PrivacyPolicy />
      ) : (
        <>
          {/* HEADER */}
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="title">Quick NewsGPT</div>
              <div className="tagline">Your Quick Gateway to Quick News</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleRefresh} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6 }}>⟳ Refresh</button>
            </div>
          </div>

          {/* MAIN */}
          <div className="container">
            <main className="main-column">
              {/* Latest Headlines */}
              <section className="card">
                <h2>Latest Headlines</h2>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {timeString ? `Updated ${timeString}` : ""}
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="fixed-cat">🌍 International</div>
                  {loading ? <div>Loading...</div> : <NewsList items={slots[0] ? [slots[0]] : []} hideBadge={true} />}
                  <div className="fixed-cat">🇮🇳 India</div>
                  {loading ? <div>Loading...</div> : <NewsList items={slots[1] ? [slots[1]] : []} hideBadge={true} />}
                  <div className="fixed-cat">🏜️ Rajasthan / State</div>
                  {loading ? <div>Loading...</div> : <NewsList items={slots[2] ? [slots[2]] : []} hideBadge={true} />}
                </div>
              </section>

              {/* Advertisement */}
              <div className="card ad" style={{ marginTop: 12 }}>Advertisement Space</div>

              {/* Ask Section */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>क्विक न्यूज़ GPT से पूछें</h3>
                <AskNews />
              </section>

              {/* User Uploaded News */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>User Uploaded News</h3>
                <NewsList items={customNews} />
              </section>

              {/* Trending */}
              <Trending />

              {/* Wikipedia Search */}
              <WikipediaSearch />

              {/* Live TV */}
              <LiveTV />

              {/* Footer */}
              <div className="footer" style={{ marginTop: 12, color: "#6b7280" }}>
                © 2026 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
                <br />
                <a href="/privacy" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  Privacy Policy
                </a>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="sidebar">
              <Sidebar topItems={slots} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
