import React, { useEffect, useState } from "react";
import NewsList from "./components/NewsList";
import AskNews from "./components/AskNews";
import Sidebar from "./components/Sidebar";

export default function App() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
  const [allNews, setAllNews] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper to lowercase safely
  const lower = (txt) => (txt || "").toLowerCase();

  // Fetch from backend /news and store raw items
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        // backend may return data.news or data.samples or data.news
        const items = data.news || data.samples || data.items || [];
        if (mounted) {
          setAllNews(items);
        }
      } catch (err) {
        console.error("Error fetching /news:", err);
        if (mounted) setError("Failed to load news.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNews();
    // refresh every 10 minutes
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [BACKEND]);

  // Categorize and produce top-3 style headlines: World, India, State
  useEffect(() => {
    const items = Array.isArray(allNews) ? allNews : [];

    if (!items.length) {
      setHeadlines([]);
      return;
    }

    // find helpers by keywords (extend keywords as needed)
    const findByKeywords = (keywords) =>
      items.find((n) =>
        keywords.some((k) => lower(n.title).includes(k) || lower(n.summary || n.description || "").includes(k))
      );

    const world = findByKeywords([
      "world",
      "international",
      "foreign",
      "us ",
      "u.s.",
      "united states",
      "china",
      "russia",
      "uk ",
      "pakistan",
      "america",
      "europe",
      "global",
    ]);

    const india = findByKeywords([
      "india",
      "delhi",
      "mumbai",
      "bangalore",
      "bengaluru",
      "chennai",
      "kolkata",
      "modi",
      "bharat",
      "indian",
      "new delhi",
    ]);

    // state detection: look for common state names (Rajasthan priority)
    const state = findByKeywords([
      "rajasthan",
      "jaipur",
      "udaipur",
      "jodhpur",
      "bikaner",
      // other states (fallback pool)
      "gujarat",
      "maharashtra",
      "uttar pradesh",
      "up ",
      "punjab",
      "kerala",
      "karnataka",
      "tamil nadu",
      "west bengal",
      "assam",
      "bihar",
      "jharkhand",
      "madhya pradesh",
    ]);

    // Remove duplicates and preserve order
    const uniques = [];
    const addIfUnique = (item, category) => {
      if (!item) return;
      const already = uniques.some((u) => (u.link && item.link && u.link === item.link) || (u.title === item.title));
      if (!already) {
        uniques.push({ ...item, category });
      }
    };

    addIfUnique(world, "🌍 World");
    addIfUnique(india, "🇮🇳 India");
    addIfUnique(state, "🏜️ Rajasthan / State");

    // Fill remaining from items (skip already chosen)
    for (const it of items) {
      if (uniques.length >= 3) break;
      const already = uniques.some((u) => (u.link && it.link && u.link === it.link) || u.title === it.title);
      if (!already) {
        uniques.push({ ...it, category: "🔹 General" });
      }
    }

    setHeadlines(uniques.slice(0, 3));
  }, [allNews]);

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Connected to:</div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>{BACKEND}</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container">
        <main className="main-column">
          {/* Headlines section */}
          <section className="card">
            <h2 style={{ marginTop: 0 }}>Latest Headlines</h2>

            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading latest news...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : headlines.length > 0 ? (
              // Pass categorized headlines to NewsList
              <NewsList items={headlines} />
            ) : (
              <p style={{ color: "#6b7280" }}>No news available.</p>
            )}
          </section>

          {/* Advertisement */}
          <div className="card ad">Advertisement Space</div>

          {/* Ask */}
          <section className="card">
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          {/* Footer */}
          <div className="footer">
            © 2025 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
