// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
const SHOW_CONNECTED = false;

const toLower = (s) => (s || "").toLowerCase();

// bilingual keywords
const KEYWORDS = {
  international: [
    "world","international","foreign","us","u.s.","usa","america","united states",
    "china","russia","pakistan","bangladesh","global","europe","uk","britain"
  ],
  india: [
    "india","bharat","delhi","mumbai","bangalore","bengaluru","chennai","kolkata",
    "modi","parliament","संसद","भारत","दिल्ली","मुंबई","बंगाल"
  ],
  rajasthan: [
    "rajasthan","जयपुर","jaipur","jodhpur","उदयपुर","udaipur","ajmer","बिकानेर",
    "bikaner","jaisalmer","alwar","सिकर","sikar"
  ]
};

function textHasAny(text = "", arr = []) {
  const t = toLower(text);
  return arr.some(k => t.includes(k));
}

function detectCategoryForItem(item) {
  const text = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`;

  if (textHasAny(text, KEYWORDS.rajasthan)) return "rajasthan";
  if (textHasAny(text, KEYWORDS.international)) return "international";
  if (textHasAny(text, KEYWORDS.india)) return "india";
  return "general";
}

// pick 3 items (international, india, rajasthan)
function selectThree(allItems = []) {
  const items = Array.isArray(allItems) ? allItems.slice() : [];

  const proc = items.map((it, i) => ({ ...it, __cat: detectCategoryForItem(it), __i: i }));
  const picked = [];

  const pick = (cat) => {
    const f = proc.find(x => x.__cat === cat && !picked.includes(x));
    if (f) picked.push(f);
  };

  pick("international");
  pick("india");
  pick("rajasthan");

  for (const p of proc) {
    if (picked.length >= 3) break;
    if (!picked.includes(p)) picked.push(p);
  }

  return picked.slice(0, 3).map(p => {
    const { __cat, __i, ...rest } = p;
    return { ...rest, _detected: __cat };
  });
}

export default function App() {
  const [allNews, setAllNews] = useState([]);
  const [headlines, setHeadlines] = useState([]);
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
      setLastUpdated(new Date());
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
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchNews]);

  useEffect(() => {
    const chosen = selectThree(allNews);
    setHeadlines(chosen);
  }, [allNews]);

  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {timeString ? `Updated ${timeString}` : ""}
            </div>
            <button onClick={fetchNews}>↻</button>
            {SHOW_CONNECTED && <div style={{ fontSize: 12 }}>{BACKEND}</div>}
          </div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            {/* Each category in separate block */}
            <div style={{ display: "grid", gap: 20 }}>

              {/* International */}
              <div>
                <div className="fixed-cat">🌍 International</div>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <NewsList items={[headlines[0]]} hideBadge={true} />
                )}
              </div>

              {/* India */}
              <div>
                <div className="fixed-cat">🇮🇳 India</div>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <NewsList items={[headlines[1]]} hideBadge={true} />
                )}
              </div>

              {/* Rajasthan */}
              <div>
                <div className="fixed-cat">🏜️ Rajasthan / State</div>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <NewsList items={[headlines[2]]} hideBadge={true} />
                )}
              </div>

            </div>
          </section>

          <div className="card ad">Advertisement Space</div>

          <section className="card">
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer">
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
