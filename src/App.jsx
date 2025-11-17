import React, { useEffect, useState } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

function App() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const lower = (t) => (t || "").toLowerCase();

  // Fetch /news
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.items || data.samples || [];
        if (mounted) {
          setAllNews(Array.isArray(items) ? items : []);
          setLastUpdated(new Date().toLocaleString());
        }
      } catch (e) {
        console.error("fetch /news error:", e);
        if (mounted) setError("Failed to load news.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [BACKEND]);

  const categoryFilter = {
    international: ["international", "world", "us", "u.s.", "china", "pakistan", "global", "russia", "america", "uk"],
    india: ["india", "delhi", "mumbai", "bengaluru", "bangalore", "kolkata", "bharat", "modi", "new delhi"],
    state: ["rajasthan", "jaipur", "udaipur", "jodhpur", "bikaner", "bihar", "up", "uttar pradesh", "gujarat", "maharashtra"]
  };

  const findNews = (keywords) => {
    // return items that match any keyword (case-insensitive)
    return allNews.filter((n) => {
      const t = (n.title || "") + " " + (n.summary || n.description || "");
      const lowerT = t.toLowerCase();
      return keywords.some((k) => lowerT.includes(k));
    });
  };

  // pick first matching item per slot (keeps order deterministic)
  const intlNews = findNews(categoryFilter.international).slice(0, 1);
  const indiaNews = findNews(categoryFilter.india).slice(0, 1);
  const stateNews = findNews(categoryFilter.state).slice(0, 1);

  // For any missing slots, try to fill from allNews (avoid duplicates)
  const usedLinks = new Set();
  const pickUnique = (arr) => arr.filter(it => {
    const key = (it.link || it.title || "") ;
    if (!key) return false;
    if (usedLinks.has(key)) return false;
    usedLinks.add(key);
    return true;
  });

  const slot1 = pickUnique(intlNews);
  const slot2 = pickUnique(indiaNews);
  const slot3 = pickUnique(stateNews);

  // If some slots empty, fill from remaining allNews
  const remaining = allNews.filter(it => {
    const key = (it.link || it.title || "");
    return key && !usedLinks.has(key);
  });

  const finalIntl = slot1.length ? slot1 : (slot2.length ? [] : []) ; // keep as-is
  // We'll render by sections (each section shows its own NewsList with that section's array)
  // Note: NewsList will show content for whatever items passed. We pass a single-item array when found.

  return (
    <div>
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="title" style={{ fontSize: 20, fontWeight: 700 }}>Quick NewsGPT</div>
          <div className="tagline" style={{ color: "#6b7280" }}>Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>
          <div style={{ marginBottom: 4 }}>Connected to:</div>
          <div style={{ color: "#0f172a", fontSize: 13 }}>{BACKEND}</div>
        </div>
      </div>

      <div className="container" style={{ display: "flex", gap: 20, marginTop: 16 }}>
        <main className="main-column" style={{ flex: 1 }}>
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>
              {lastUpdated && (
                <div style={{ fontSize: 12, color: "#6b7280", marginLeft: 12 }}>
                  Last Updated: {lastUpdated}
                </div>
              )}
            </div>

            {/* Section 1: International */}
            <div style={{ marginTop: 8, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🌍 International</div>
            </div>
            {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (intlNews.length ? <NewsList items={intlNews} hideBadge={true} /> : <p style={{ color: "#6b7280" }}>No news available.</p>)}

            {/* Section 2: India */}
            <div style={{ marginTop: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🇮🇳 India</div>
            </div>
            {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (indiaNews.length ? <NewsList items={indiaNews} hideBadge={true} /> : <p style={{ color: "#6b7280" }}>No news available.</p>)}

            {/* Section 3: Rajasthan / State */}
            <div style={{ marginTop: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🏜️ Rajasthan / State</div>
            </div>
            {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (stateNews.length ? <NewsList items={stateNews} hideBadge={true} /> : <p style={{ color: "#6b7280" }}>No news available.</p>)}
          </section>

          <div className="card ad" style={{ marginTop: 12 }}>Advertisement Space</div>

          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer" style={{ marginTop: 12 }}>© 2025 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳</div>
        </main>

        <aside className="sidebar" style={{ width: 320 }}>
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}

export default App;
