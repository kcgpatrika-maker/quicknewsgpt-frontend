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
  const [autoRefresh, setAutoRefresh] = useState(true);

  // safe text builder (avoids undefined.includes errors)
  const textOf = (n = {}) =>
    `${n.title || ""} ${n.summary || n.description || ""} ${n.content || ""}`.toLowerCase();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      const items = data?.news || data?.items || data?.samples || [];
      setAllNews(Array.isArray(items) ? items : []);
      setLastUpdated(new Date().toLocaleTimeString()); // store time only
    } catch (err) {
      console.error("Error fetching /news:", err);
      setError("Failed to load news.");
      setAllNews([]);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch + optional interval when autoRefresh true
  useEffect(() => {
    fetchNews();
  }, [BACKEND]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, BACKEND]);

  // category keyword lists (small and focused — extend if needed)
  const INTERNATIONAL = ["world","international","foreign","us","usa","america","china","russia","uk","united kingdom","pakistan","europe","global"];
  const INDIA = ["india","bharat","delhi","mumbai","bangalore","bengaluru","chennai","kolkata","modi","indian","new delhi"];
  const STATES = ["rajasthan","jaipur","udaipur","jodhpur","bikaner","bihar","up","uttar pradesh","gujarat","maharashtra","karnataka","tamil nadu","west bengal","assam","kerala","jharkhand","madhya pradesh"];

  const findNews = (keywords=[]) => {
    if (!Array.isArray(allNews)) return [];
    return allNews.filter(n => {
      const t = textOf(n);
      return keywords.some(k => t.includes(k.toLowerCase()));
    });
  };

  // pick first matching item for each category (avoid duplicates)
  const pickFirstUnique = (list, already=[]) => {
    for (const it of list) {
      const key = (it.link || it.id || it.title || "") + "";
      if (!already.some(a => (a.link || a.id || a.title || "") + "" === key)) return it;
    }
    return null;
  };

  // prepare three slot items
  const prepareSlots = () => {
    // compute lists
    const intlList = findNews(INTERNATIONAL);
    const indiaList = findNews(INDIA);
    const stateList = findNews(STATES);

    const chosen = [];

    // 1) International -> else fallback India
    const first = pickFirstUnique(intlList, chosen) || pickFirstUnique(indiaList, chosen);
    if (first) chosen.push({ ...first, _fixedCategory: "International" });

    // 2) India -> else any state
    const second = pickFirstUnique(indiaList, chosen) || pickFirstUnique(stateList, chosen);
    if (second) chosen.push({ ...second, _fixedCategory: "India" });

    // 3) Rajasthan/State (prefer Rajasthan if present) -> else any remaining -> else general remaining
    // Prefer Rajasthan words
    const rajasthanKeywords = ["rajasthan","jaipur","udaipur","jodhpur","bikaner","jaisalmer","alwar","sikar"];
    const rajasList = allNews.filter(n => {
      const t = textOf(n);
      return rajasthanKeywords.some(k => t.includes(k));
    });

    const third = pickFirstUnique(rajasList, chosen) || pickFirstUnique(stateList, chosen) || (() => {
      // any remaining
      for (const it of allNews) {
        const key = (it.link || it.id || it.title || "") + "";
        if (!chosen.some(a => (a.link || a.id || a.title || "") + "" === key)) return it;
      }
      return null;
    })();

    if (third) chosen.push({ ...third, _fixedCategory: "Rajasthan / State" });

    return chosen.slice(0,3);
  };

  const slots = prepareSlots();

  // Helper: show only time (user wanted date optional)
  const timeDisplay = lastUpdated || "";

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest Headlines</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Connected to:</div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>{BACKEND}</div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Latest Headlines</h2>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{timeDisplay ? `Updated: ${timeDisplay}` : ""}</div>
                <button
                  onClick={() => { setAutoRefresh(v => !v); }}
                  style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", background: autoRefresh ? "#e0f2fe" : "#fff", cursor: "pointer" }}
                  title="Toggle auto refresh"
                >
                  {autoRefresh ? "Auto ON" : "Auto OFF"}
                </button>
                <button
                  onClick={fetchNews}
                  style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* fixed category headers + one item each (NewsList will hide old badges) */}
            <div style={{ marginTop: 12 }}>
              <h4 style={{ marginBottom: 6 }}>🌍 International</h4>
              {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (slots[0] ? <NewsList items={[slots[0]]} hideBadge={true} /> : <p>No news available.</p>)}

              <h4 style={{ marginTop: 12, marginBottom: 6 }}>🇮🇳 India</h4>
              {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (slots[1] ? <NewsList items={[slots[1]]} hideBadge={true} /> : <p>No news available.</p>)}

              <h4 style={{ marginTop: 12, marginBottom: 6 }}>🏜️ Rajasthan / State</h4>
              {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (slots[2] ? <NewsList items={[slots[2]]} hideBadge={true} /> : <p>No news available.</p>)}
            </div>
          </section>

          <div className="card ad">Advertisement Space</div>

          <section className="card">
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer" style={{ marginTop: 18 }}>
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
