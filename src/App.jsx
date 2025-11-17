// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
// Set to true if you want to display the "Connected to" link next to header
const SHOW_CONNECTED = false;

const toLower = (s) => (s || "").toLowerCase();

// bilingual keywords (english + hindi short tokens)
const KEYWORDS = {
  international: [
    "world","international","foreign","us","u.s.","usa","america","united states","china","russia","pakistan","bangladesh","global","europe","uk","britain"
  ],
  india: [
    "india","bharat","delhi","mumbai","bangalore","bengaluru","chennai","kolkata","modi","parliament","संसद","भारत","दिल्ली","मुंबई","बंगाल"
  ],
  rajasthan: [
    "rajasthan","जयपुर","jaipur","jodhpur","उदयपुर","udaipur","ajmer","बिकानेर","bikaner","jaisalmer","alwar","सिकर","sikar"
  ]
};

function textHasAny(text = "", arr = []) {
  const t = toLower(text);
  return arr.some(k => t.includes(k));
}

function detectCategoryForItem(item) {
  const text = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`;
  // Priority: Rajasthan -> International -> India -> fallback general/state
  if (textHasAny(text, KEYWORDS.rajasthan)) return "rajasthan";
  if (textHasAny(text, KEYWORDS.international)) return "international";
  if (textHasAny(text, KEYWORDS.india)) return "india";
  // fallback: if source contains something like "feeds.bbci" we don't assume category; let selection handle it
  return "general";
}

// choose one item for each slot with fallbacks and ensure total 3 items
function selectThree(allItems = []) {
  const items = Array.isArray(allItems) ? allItems.slice() : [];
  // attach detected
  const proc = items.map((it, i) => ({ ...it, __cat: detectCategoryForItem(it), __i: i }));
  const picked = [];

  const pickFirstMatch = (cat) => {
    const found = proc.find(p => p.__cat === cat && !picked.includes(p));
    if (found) picked.push(found);
    return found;
  };

  // 1: International (else India)
  pickFirstMatch("international");
  if (picked.length === 0) pickFirstMatch("india");

  // 2: India (else any general/state)
  pickFirstMatch("india");
  if (picked.length < 2) {
    const fallback = proc.find(p => !picked.includes(p) && p.__cat !== "international");
    if (fallback) picked.push(fallback);
  }

  // 3: Rajasthan -> else any remaining
  pickFirstMatch("rajasthan");
  if (picked.length < 3) {
    const fallback = proc.find(p => !picked.includes(p));
    if (fallback) picked.push(fallback);
  }

  // ensure 3 by filling any remaining
  for (const p of proc) {
    if (picked.length >= 3) break;
    if (!picked.includes(p)) picked.push(p);
  }

  // map back to items, include a clean category label for UI (fixed labels shown in header)
  return picked.slice(0, 3).map(p => {
    const { __cat, __i, ...rest } = p;
    return { ...rest, _detected: __cat };
  });
}

export default function App() {
  const [allNews, setAllNews] = useState([]);
  const [headlines, setHeadlines] = useState([]); // will hold up to 3 chosen items
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      const items = data?.news || data?.items || data?.samples || [];
      setAllNews(items);
      setLastUpdated(new Date()); // store Date object
    } catch (err) {
      console.error("fetch /news error", err);
      setError("Failed to fetch news.");
      setAllNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const id = setInterval(() => fetchNews(), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchNews]);

  // recompute headlines when allNews changes
  useEffect(() => {
    const chosen = selectThree(allNews);
    setHeadlines(chosen);
  }, [allNews]);

  const handleRefresh = async () => {
    await fetchNews();
  };

  // time string (only time) - show like "10:28:55"
  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="title" style={{ fontSize: 20, fontWeight: 700 }}>Quick NewsGPT</div>
          <div className="tagline" style={{ color: "#6b7280" }}>Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
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
            {SHOW_CONNECTED && (
              <div style={{ fontSize: 12, color: "#0f172a" }}>{BACKEND}</div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ display: "flex", gap: 20, marginTop: 16 }}>
        <main className="main-column" style={{ flex: 1 }}>
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            {/* fixed one-line category labels */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>🌍 International</div>
              <div style={{ fontWeight: 700 }}>🇮🇳 India</div>
              <div style={{ fontWeight: 700 }}>🏜️ Rajasthan / State</div>
            </div>

            {/* three slots: pass single-item arrays to NewsList with hideBadge=true so old badges do not render */}
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> :
                  (headlines[0] ? <NewsList items={[headlines[0]]} hideBadge={true} /> : <div className="news-item card" style={{ padding: 10 }}>No news available.</div>)
                }
              </div>

              <div>
                {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> :
                  (headlines[1] ? <NewsList items={[headlines[1]]} hideBadge={true} /> : <div className="news-item card" style={{ padding: 10 }}>No news available.</div>)
                }
              </div>

              <div>
                {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> :
                  (headlines[2] ? <NewsList items={[headlines[2]]} hideBadge={true} /> : <div className="news-item card" style={{ padding: 10 }}>No news available.</div>)
                }
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

        <aside className="sidebar" style={{ width: 280 }}>
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
