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
      const items = data?.news || [];
      
      // Group by categories
const grouped = {
  International: items.filter(it => /world|international|us|china|russia/i.test(it.title)).slice(0,2),
  India: items.filter(it => /india|bharat|delhi|mumbai/i.test(it.title)).slice(0,2),
  Rajasthan: items.filter(it => /rajasthan|jaipur|jodhpur|udaipur/i.test(it.title)).slice(0,2),
  Business: items.filter(it => /business|company|startup|market/i.test(it.title)).slice(0,2),
  Sports: items.filter(it => /sports|cricket|football|match/i.test(it.title)).slice(0,2),
  Entertainment: items.filter(it => /film|movie|bollywood|song/i.test(it.title)).slice(0,2),
};

// fallback logic सुधारें
for (const cat of Object.keys(grouped)) {
  if (!grouped[cat] || grouped[cat].length === 0) {
    // हर category को अलग slice दें
    grouped[cat] = items.slice((Object.keys(grouped).indexOf(cat)*2), (Object.keys(grouped).indexOf(cat)*2)+2);
  }
}

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
                      <div className="fixed-cat">{cat}</div>
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
                <ul style={{ marginTop: 8 }}>
                  <li>India wins crucial cricket match</li>
                  <li>New AI policy announced by govt</li>
                  <li>Bollywood movie breaks box office records</li>
                  <li>Global markets show recovery signs</li>
                  <li>Major tech launch excites youth</li>
                </ul>
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
                <h3>देश-दुनिया की अन्य खबरें</h3>
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
