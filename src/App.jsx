// src/App.jsx
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch raw news from backend; do NOT mutate here — let NewsList handle selection logic
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.samples || data.items || (Array.isArray(data) ? data : []);
        if (mounted) {
          setAllNews(Array.isArray(items) ? items : []);
          setLastUpdated(new Date().toISOString());
        }
      } catch (err) {
        console.error("Error fetching /news:", err);
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

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Connected to:</div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>{BACKEND}</div>
          <div style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
            {lastUpdated ? `Last: ${new Date(lastUpdated).toLocaleString()}` : ""}
          </div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading latest news...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : allNews.length > 0 ? (
              // pass raw items; NewsList will detect categories and pick top-3
              <NewsList items={allNews} />
            ) : (
              <p style={{ color: "#6b7280" }}>No news available.</p>
            )}
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

export default App;
