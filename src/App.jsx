import React, { useEffect, useState } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

function App() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const lower = (t) => (t || "").toLowerCase();

  // ------------------------------------
  // FETCH NEWS FROM BACKEND
  // ------------------------------------
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();

        const items =
          data?.news || data?.samples || data?.items || (Array.isArray(data) ? data : []);

        setAllNews(items);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [BACKEND]);

  // ------------------------------------
  // PICK NEWS BY CATEGORY — FIXED 3 BOX
  // ------------------------------------
  const pickCategory = (keywordList) => {
    return allNews.find((n) => {
      const txt = lower(n.title + " " + (n.summary || n.description || ""));
      return keywordList.some((k) => txt.includes(k));
    });
  };

  const INTERNATIONAL = pickCategory(["world", "pakistan", "china", "russia", "us ", "uk "]);
  const INDIA = pickCategory(["india", "delhi", "mumbai", "modi", "parliament"]);
  const STATE = pickCategory(["rajasthan", "jaipur", "udaipur", "gujarat", "bihar", "up "]);

  const finalHeadlines = [
    INTERNATIONAL || null,
    INDIA || null,
    STATE || null,
  ];

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Connected to:</div>
          <div style={{ fontSize: 13 }}>{BACKEND}</div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">
          {/* Latest headlines */}
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            {/* Last Updated */}
            {lastUpdated && (
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                ⏱ Last updated: {lastUpdated}
              </div>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {/* FIXED 3 CATEGORY BOXES */}
                <div>
                  <div className="fixed-cat">🌍 International</div>
                  <NewsList items={finalHeadlines[0] ? [finalHeadlines[0]] : []} hideBadge />
                </div>

                <div>
                  <div className="fixed-cat">🇮🇳 India</div>
                  <NewsList items={finalHeadlines[1] ? [finalHeadlines[1]] : []} hideBadge />
                </div>

                <div>
                  <div className="fixed-cat">🏜️ State</div>
                  <NewsList items={finalHeadlines[2] ? [finalHeadlines[2]] : []} hideBadge />
                </div>
              </div>
            )}
          </section>

          <div className="card ad">Advertisement Space</div>

          <section className="card">
            <h3>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer">© 2025 Quick NewsGPT — Made in India 🇮🇳</div>
        </main>

        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}

export default App;
