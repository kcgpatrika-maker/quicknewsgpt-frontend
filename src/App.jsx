import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
const SHOW_CONNECTED = false;

export default function App() {
  const [allNews, setAllNews] = useState([]);
  const [slots, setSlots] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Fetch news from backend (backend already gives category)
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const items = data?.news || data?.items || data?.samples || [];

      setAllNews(Array.isArray(items) ? items : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("fetchNews error:", err);
      setError("Failed to load news.");
      setAllNews([]);
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

  // SLOT SELECTION BASED ON BACKEND CATEGORY
  useEffect(() => {
    if (!Array.isArray(allNews)) return;

    const intl = allNews.filter(n => (n.category || "").toLowerCase() === "international");
    const india = allNews.filter(n => (n.category || "").toLowerCase() === "india");
    const raj = allNews.filter(n => {
      const c = (n.category || "").toLowerCase();
      return c === "rajasthan" || c === "state";
    });

    function pickRandom(arr) {
      if (!arr || arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // fallback pool
    const fallback = allNews;

    const slot1 = pickRandom(intl) || pickRandom(fallback);
    const slot2 = pickRandom(india) || pickRandom(fallback);
    const slot3 = pickRandom(raj) || pickRandom(fallback);

    setSlots([slot1, slot2, slot3]);
  }, [allNews]);

  const handleRefresh = async () => {
    await fetchNews(); // will refill slots automatically
  };

  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      {/* ===================== HEADER ===================== */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Your Quick Gateway to Quick News</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
          <button
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) {
                try {
                  await navigator.share({ title: "Quick NewsGPT", text: "Latest news from Quick NewsGPT", url });
                } catch (err) {}
              } else {
                await navigator.clipboard.writeText(url);
                alert("Link copied!");
              }
            }}
            style={{
              border: "none",
              background: "#059669",
              color: "white",
              padding: "4px 8px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            📤 Share
          </button>

          <button
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            style={{
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              padding: "4px 6px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            🔗
          </button>
        </div>
      </div>

      {/* ===================== MAIN ===================== */}
      <div className="container">
        <main className="main-column">
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Latest Headlines</h2>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {timeString ? `Updated ${timeString}` : ""}
                </div>

                <button
                  onClick={handleRefresh}
                  style={{
                    border: "1px solid #2563eb",
                    background: "#2563eb",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  ⟳
                </button>
              </div>
            </div>

            {/* ==== NEWS SLOTS ===== */}
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🌍 International</div>
                {loading ? (
                  <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : slots[0] ? (
                  <NewsList items={[slots[0]]} hideBadge={true} />
                ) : (
                  <div className="news-item card" style={{ padding: 10 }}>No news available.</div>
                )}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🇮🇳 India</div>
                {loading ? (
                  <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : slots[1] ? (
                  <NewsList items={[slots[1]]} hideBadge={true} />
                ) : (
                  <div className="news-item card" style={{ padding: 10 }}>No news available.</div>
                )}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🏜️ Rajasthan / State</div>
                {loading ? (
                  <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : slots[2] ? (
                  <NewsList items={[slots[2]]} hideBadge={true} />
                ) : (
                  <div className="news-item card" style={{ padding: 10 }}>No news available.</div>
                )}
              </div>
            </div>
          </section>

          <div className="card ad" style={{ marginTop: 12 }}>Advertisement Space</div>

          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer" style={{ marginTop: 12, color: "#6b7280" }}>
            © 2025 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
          </div>
        </main>

        <aside className="sidebar">
          <Sidebar topItems={slots} />
        </aside>
      </div>
    </div>
  );
}
