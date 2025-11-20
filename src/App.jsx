import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

// ---------------------------
// Select slots logic
// ---------------------------
function selectSlots(items = []) {
  const list = Array.isArray(items) ? items.slice() : [];

  // categorize
  const international = [];
  const india = [];
  const rajasthan = [];

  list.forEach(item => {
    const txt = `${item.title || ""} ${item.summary || item.description || ""}`.toLowerCase();
    if (/rajasthan|जयपुर|jaipur/i.test(txt)) rajasthan.push(item);
    else if (/india|bharat|delhi|मुंबई|दिल्ली/i.test(txt)) india.push(item);
    else if (/world|international|global|us|china|russia|pakistan/i.test(txt)) international.push(item);
    else {} // ignore for now
  });

  // fill each slot, fallback to any available if empty
  const slot0 = international[0] || india[0] || rajasthan[0] || list[0] || null;
  const slot1 = india[0] || international[1] || rajasthan[1] || list[1] || null;
  const slot2 = rajasthan[0] || india[1] || international[2] || list[2] || null;

  return [slot0, slot1, slot2];
}

export default function App() {
  const [allNews, setAllNews] = useState([]);
  const [slots, setSlots] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.news || [];
      setAllNews(items);
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
    const interval = setInterval(fetchNews, 10 * 60 * 1000); // 10 mins
    return () => clearInterval(interval);
  }, [fetchNews]);

  useEffect(() => {
    setSlots(selectSlots(allNews));
  }, [allNews]);

  const handleRefresh = async () => {
    await fetchNews();
  };

  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      {/* Header + share buttons */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Your Quick Gateway to Quick News</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
          <button
            onClick={async () => { const url = window.location.href; navigator.share ? await navigator.share({ title: "Quick NewsGPT", text: "Latest news from Quick NewsGPT", url }) : (await navigator.clipboard.writeText(url), alert("Link copied!")); }}
            title="Share"
            style={{ border: "none", background: "#059669", color: "white", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
          >📤 Share</button>

          <button
            onClick={async () => { await navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}
            title="Copy Link"
            style={{ border: "1px solid #d1d5db", background: "white", color: "#374151", padding: "4px 6px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
          >🔗</button>
        </div>
      </div>

      {/* Main */}
      <div className="container">
        <main className="main-column">
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Latest Headlines</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{timeString ? `Updated ${timeString}` : ""}</div>
                <button onClick={handleRefresh} title="Refresh News" style={{ border: "1px solid #2563eb", background: "#2563eb", color: "white", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>⟳</button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🌍 International</div>
                {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> : <NewsList items={[slots[0]]} hideBadge={true} />}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🇮🇳 India</div>
                {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> : <NewsList items={[slots[1]]} hideBadge={true} />}
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="fixed-cat">🏜️ Rajasthan / State</div>
                {loading ? <div style={{ color: "#6b7280" }}>Loading...</div> : <NewsList items={[slots[2]]} hideBadge={true} />}
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
