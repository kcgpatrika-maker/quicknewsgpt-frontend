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

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.items || [];
        setAllNews(items);
        setLastUpdated(new Date().toLocaleString());
      } catch (e) {
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [BACKEND]);

  // --- FIXED CATEGORY LOGIC ---
  const international = allNews[0] ? [allNews[0]] : [];
  const india = allNews[1] ? [allNews[1]] : [];
  const state = allNews[2] ? [allNews[2]] : [];

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Connected to:</div>
          <div style={{ fontSize: 13 }}>{BACKEND}</div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">

          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            <div style={{ marginBottom: 10, fontSize: 12, color: "#6b7280" }}>
              {lastUpdated ? `Updated: ${lastUpdated}` : ""}
            </div>

            <h4>🌍 International</h4>
            {loading ? (
              <p>Loading...</p>
            ) : international.length ? (
              <NewsList items={international} />
            ) : (
              <p>No news available.</p>
            )}

            <h4>🇮🇳 India</h4>
            {loading ? (
              <p>Loading...</p>
            ) : india.length ? (
              <NewsList items={india} />
            ) : (
              <p>No news available.</p>
            )}

            <h4>🏜️ Rajasthan / State</h4>
            {loading ? (
              <p>Loading...</p>
            ) : state.length ? (
              <NewsList items={state} />
            ) : (
              <p>No news available.</p>
            )}
          </section>

          <div className="card ad">Advertisement Space</div>

          <section className="card">
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
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
