// src/App.jsx
import "./App.css";
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Trending from "./components/Trending";
import LiveTV from "./components/LiveTV";
import WikipediaSearch from "./components/WikipediaSearch";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

export default function App() {
  const [allNews, setAllNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [customNews, setCustomNews] = useState([]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      const grouped = data?.news || {};

      setAllNews(grouped);
      setLastUpdated(new Date());

      const resCustom = await fetch(`${BACKEND}/custom`);
      const dataCustom = await resCustom.json();
      setCustomNews(dataCustom.news || []);
    } catch (err) {
      console.error("fetchNews error:", err);
      setError("Failed to load news.");
      setAllNews({});
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchNews]);

  const handleRefresh = async () => {
    await fetchNews();
  };

  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      {window.location.pathname === "/privacy" ? (
        <PrivacyPolicy />
      ) : (
        <>
          {/* HEADER */}
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="title">Quick NewsGPT</div>
              <div className="tagline">Your Quick Gateway to Quick News</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Share Button */}
              <button
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: "Quick NewsGPT", text: "Latest news from Quick NewsGPT", url });
                    } catch (err) {
                      console.error("Share failed:", err);
                    }
                  } else {
                    await navigator.clipboard.writeText(url);
                    alert("Link copied!");
                  }
                }}
                style={{ border: "none", background: "#059669", color: "white", padding: "6px 10px", borderRadius: 6 }}
              >
                📤 Share
              </button>
              {/* Copy Link */}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}
                style={{ border: "1px solid #d1d5db", background: "white", color: "#374151", padding: "6px 10px", borderRadius: 6 }}
              >
                🔗
              </button>
            </div>
          </div>

          {/* MAIN */}
          <div className="container">
            <main className="main-column">
              {/* Latest Headlines */}
              <section className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ margin: 0 }}>Latest Headlines</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>
                      {timeString ? `Updated ${timeString}` : ""}
                    </div>
                    <button onClick={handleRefresh} style={{ background: "#2563eb", color: "white", border: "none", padding: "6px 10px", borderRadius: 6 }}>
                      ⟳ Refresh
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div>Loading...</div>
                ) : (
                  Object.keys(allNews).map(cat => (
                    <div key={cat} style={{ marginTop: 12 }}>
                      <div className={`fixed-cat ${cat}`}>
                        {cat === "Rajasthan" ? "Rajasthan / States" : cat}
                      </div>
                      <NewsList items={allNews[cat]} hideBadge={true} />
                    </div>
                  ))
                )}
              </section>

              {/* User Uploaded News */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>✍️ गौतम की कलम से</h3>
                <NewsList items={customNews} />
              </section>

              {/* Trending */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>🔥 Top 5 Trending</h3>
                <Trending />
              </section>

              {/* Wikipedia Search */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>📚 Explore Knowledge on Wikipedia</h3>
                <WikipediaSearch />
              </section>

              {/* Live TV */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>📺 Live TV</h3>
                <LiveTV />
              </section>

              {/* Ask Section */}
              <section className="card" style={{ marginTop: 12 }}>
                <h3>🌐 देश-दुनिया की अन्य खबरें</h3>
                <AskNews />
              </section>

              {/* Footer */}
              <div className="footer" style={{ marginTop: 12, color: "#6b7280" }}>
                © 2026 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
                <br />
                <a href="/privacy" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  Privacy Policy
                </a>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="sidebar">
              <Sidebar topItems={allNews["India"]?.slice(0, 3) || []} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
