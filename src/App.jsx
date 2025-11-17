import React, { useEffect, useState } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

function App() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
  const [allNews, setAllNews] = useState([]);
  const [sections, setSections] = useState({
    international: [],
    india: [],
    state: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const lower = (t) => (t || "").toLowerCase();

  // 🔹 FETCH NEWS
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.samples || data.items || [];
        setAllNews(items);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [BACKEND]);

  // 🔹 CATEGORIZE NEWS INTO 3 FIX SECTIONS
  useEffect(() => {
    if (!allNews.length) return;

    const pickFirstMatch = (keywords) =>
      allNews.find((n) =>
        keywords.some(
          (k) =>
            lower(n.title).includes(k) ||
            lower(n.summary || "").includes(k) ||
            lower(n.description || "").includes(k)
        )
      );

    const international = pickFirstMatch([
      "world",
      "international",
      "us ",
      "america",
      "china",
      "russia",
      "pakistan",
      "global",
      "uk ",
    ]);

    const india = pickFirstMatch([
      "india",
      "indian",
      "bharat",
      "delhi",
      "mumbai",
      "bengaluru",
      "kolkata",
      "modi",
    ]);

    const state = pickFirstMatch([
      "rajasthan",
      "jaipur",
      "udaipur",
      "jodhpur",
      "bikaner",
      "bihar",
      "uttar pradesh",
      "punjab",
      "gujarat",
      "kerala",
      "maharashtra",
      "madhya pradesh",
    ]);

    setSections({
      international: international ? [international] : [],
      india: india ? [india] : [],
      state: state ? [state] : [],
    });
  }, [allNews]);

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Connected to:</div>
          <div style={{ fontSize: 13 }}>{BACKEND}</div>

          {lastUpdated && (
            <div style={{ marginTop: 5, fontSize: 12, color: "#475569" }}>
              Updated at: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <main className="main-column">

          {/* FIXED SECTION — INTERNATIONAL */}
          <section className="card">
            <h2>🌍 International</h2>
            {loading ? (
              <p>Loading…</p>
            ) : sections.international.length ? (
              <NewsList items={sections.international} />
            ) : (
              <p style={{ color: "#6b7280" }}>No news available</p>
            )}
          </section>

          {/* FIXED SECTION — INDIA */}
          <section className="card">
            <h2>🇮🇳 India</h2>
            {loading ? (
              <p>Loading…</p>
            ) : sections.india.length ? (
              <NewsList items={sections.india} />
            ) : (
              <p style={{ color: "#6b7280" }}>No news available</p>
            )}
          </section>

          {/* FIXED SECTION — STATE */}
          <section className="card">
            <h2>🏜 Rajasthan / State</h2>
            {loading ? (
              <p>Loading…</p>
            ) : sections.state.length ? (
              <NewsList items={sections.state} />
            ) : (
              <p style={{ color: "#6b7280" }}>No news available</p>
            )}
          </section>

          {/* ASK SECTION */}
          <section className="card">
            <h3>क्विक न्यूज़ GPT से पूछें</h3>
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
