import React, { useEffect, useState } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

function App() {
  const BACKEND =
    import.meta.env.VITE_BACKEND_URL ||
    "https://quick-newsgpt-backend.onrender.com";

  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Lowercase helper
  const lower = (t) => (t || "").toLowerCase();

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.items || data.samples || [];
        setAllNews(items);
        setLastUpdated(new Date().toLocaleString());
      } catch (e) {
        console.error("Error:", e);
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const auto = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(auto);
  }, [BACKEND]);

  // Instead of hard filtering → choose FIRST matching news
  const pick = (keywords) => {
    for (let n of allNews) {
      const text = lower(n.title + " " + (n.summary || "") + " " + (n.description || ""));
      if (keywords.some((k) => text.includes(k))) return [n];
    }
    return []; // If not found
  };

  const international = pick([
    "international",
    "world",
    "pakistan",
    "china",
    "russia",
    "us ",
    "america",
    "global",
  ]);

  const india = pick([
    "india",
    "delhi",
    "mumbai",
    "kolkata",
    "bengaluru",
    "bharat",
    "indian",
    "modi",
  ]);

  const state = pick([
    "rajasthan",
    "jaipur",
    "bihar",
    "uttar pradesh",
    "up ",
    "gujarat",
    "jharkhand",
    "mp",
  ]);

  return (
    <div>
      {/* HEADER */}
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
          {/* HEADLINES */}
          <section className="card">
            <h2 style={{ marginTop: 0 }}>
              Latest Headlines{" "}
              <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>
                {lastUpdated ? `(Updated: ${lastUpdated})` : ""}
              </span>
            </h2>

            {/* International */}
            <h4 style={{ marginBottom: 6 }}>🌍 International</h4>
            {loading ? (
              <p>Loading...</p>
            ) : international.length ? (
              <NewsList items={international} />
            ) : (
              <p>No news available.</p>
            )}

            {/* India */}
            <h4 style={{ marginTop: 16, marginBottom: 6 }}>🇮🇳 India</h4>
            {loading ? (
              <p>Loading...</p>
            ) : india.length ? (
              <NewsList items={india} />
            ) : (
              <p>No news available.</p>
            )}

            {/* Rajasthan / State */}
            <h4 style={{ marginTop: 16, marginBottom: 6 }}>🏜️ Rajasthan / State</h4>
            {loading ? (
              <p>Loading...</p>
            ) : state.length ? (
              <NewsList items={state} />
            ) : (
              <p>No news available.</p>
            )}
          </section>

          <div className="card ad">Advertisement Space</div>

          {/* ASK SECTION */}
          <section className="card">
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer">
            © 2025 Quick NewsGPT — Built by Kailash Gautam 🇮🇳
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
