import React, { useEffect, useState } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [newsData, setNewsData] = useState({
    world: [],
    india: [],
    state: []
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ----------- UNIVERSAL NORMALIZER -----------
  const normalize = (data) => {
    if (!data) return { world: [], india: [], state: [] };

    const getArray = (obj, key) =>
      Array.isArray(obj[key]) ? obj[key] : [];

    return {
      world: getArray(data, "world"),
      india: getArray(data, "india"),
      state: getArray(data, "state"),
    };
  };

  // ----------- FETCH NEWS FUNCTION -----------
  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/news`);
      const data = await res.json();

      const n = normalize(data);

      // add clean category labels (fix for "General")
      const processed = {
        world: n.world.map((item) => ({ ...item, category: "International" })),
        india: n.india.map((item) => ({ ...item, category: "National" })),
        state: n.state.map((item) => ({ ...item, category: "State" })),
      };

      setNewsData(processed);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("News fetch failed:", err);
      setNewsData({ world: [], india: [], state: [] });
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="app-container">
      <Sidebar />

      <div className="content-container">

        {/* ----------------- HEADER + REFRESH BLOCK ----------------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            marginTop: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>Latest Headlines</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {lastUpdated && (
              <div style={{ fontSize: 13, color: "#475569" }}>
                Updated: {lastUpdated}
              </div>
            )}

            <button
              onClick={fetchNews}
              className="refresh-btn"
              style={{
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Refresh now"
            >
              <span
                className={
                  isRefreshing
                    ? "refresh-spin refresh-icon"
                    : "refresh-icon"
                }
              >
                🔄
              </span>
            </button>
          </div>
        </div>

        {/* ----------------- NEWS LISTS ----------------- */}
        <NewsList
          title="🌍 International"
          list={newsData.world}
          loading={loading}
        />

        <NewsList
          title="🇮🇳 National"
          list={newsData.india}
          loading={loading}
        />

        <NewsList
          title="🏛️ State"
          list={newsData.state}
          loading={loading}
        />

        <AskNews />
      </div>
    </div>
  );
}

export default App;
