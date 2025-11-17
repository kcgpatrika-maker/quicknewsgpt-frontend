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

  // -------------------------------
  // FETCH NEWS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      const items = data.news || data.samples || data.items || [];
      setAllNews(items);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // CATEGORY BASED FILTERING
  // -------------------------------

  const isInternational = (t) =>
    /(world|international|pakistan|china|bangladesh|europe|russia|us |uk )/i.test(
      t
    );

  const isIndia = (t) =>
    /(india|delhi|modi|supreme court|parliament|mumbai|kolkata|bengaluru)/i.test(
      t
    );

  const isState = (t) =>
    /(rajasthan|jaipur|udaipur|jodhpur|bihar|patna|up |uttar pradesh|mp|madhya pradesh|gujarat|punjab|kerala|karnataka|tamil nadu|west bengal)/i.test(
      t
    );

  const categorize = () => {
    const list = Array.isArray(allNews) ? allNews : [];

    return {
      international: list.filter((n) =>
        isInternational(
          (n.title || "") + " " + (n.summary || "") + " " + (n.description || "")
        )
      ),
      india: list.filter((n) =>
        isIndia(
          (n.title || "") + " " + (n.summary || "") + " " + (n.description || "")
        )
      ),
      state: list.filter((n) =>
        isState(
          (n.title || "") + " " + (n.summary || "") + " " + (n.description || "")
        )
      ),
    };
  };

  const { international, india, state } = categorize();

  const formatTime = (d) => {
    if (!d) return "";
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        {/* REFRESH + TIME */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={fetchNews}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginBottom: 4,
            }}
          >
            🔄 Refresh
          </button>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Updated: {formatTime(lastUpdated)}
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="container">
        <main className="main-column">
          {/* TOP FIXED CATEGORY HEADLINES */}
          <section className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <h2 style={{ margin: 0 }}>Latest Headlines</h2>
            </div>

            {/* FIXED CATEGORIES SHOW */}
            <div className="fixed-cats" style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 700, marginRight: 20 }}>
                🌍 International
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, marginRight: 20 }}>
                🇮🇳 India
              </span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                🏜️ Rajasthan / State
              </span>
            </div>

            {/* NEWS OUTPUT */}
            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <div style={{ display: "grid", gap: 20 }}>
                <NewsList items={international.slice(0, 1)} hideBadge={true} />
                <NewsList items={india.slice(0, 1)} hideBadge={true} />
                <NewsList items={state.slice(0, 1)} hideBadge={true} />
              </div>
            )}
          </section>

          <div className="card ad">Advertisement Space</div>

          {/* ASK SECTION */}
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
