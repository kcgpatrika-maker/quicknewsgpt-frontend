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

  const lower = (t) => (t || "").toLowerCase();

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.items || data.samples || [];

        if (mounted) {
          setAllNews(items);
          setLastUpdated(new Date().toLocaleString());
        }
      } catch (err) {
        if (mounted) setError("Failed to load news.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [BACKEND]);

  // ---- NEWS CATEGORY FILTERS ----
  const getInternational = (items) =>
    items.filter((n) =>
      [
        "world",
        "international",
        "global",
        "pakistan",
        "china",
        "us ",
        "america",
        "russia",
      ].some((k) => lower(n.title).includes(k))
    );

  const getIndia = (items) =>
    items.filter((n) =>
      [
        "india",
        "indian",
        "new delhi",
        "delhi",
        "mumbai",
        "kolkata",
        "modi",
        "bharat",
      ].some((k) => lower(n.title).includes(k))
    );

  const getState = (items) =>
    items.filter((n) =>
      [
        "rajasthan",
        "jaipur",
        "udaipur",
        "bikaner",
        "gujarat",
        "up ",
        "uttar pradesh",
        "bihar",
        "jharkhand",
        "madhya pradesh",
      ].some((k) => lower(n.title).includes(k))
    );

  // Prepare fixed categories
  const categories = [
    { label: "🌍 International", data: getInternational(allNews) },
    { label: "🇮🇳 India", data: getIndia(allNews) },
    { label: "🏜️ Rajasthan / State", data: getState(allNews) },
  ];

  // fallback: अगर किसी कैटेगरी में न्यूज़ न हो, तो allNews से भरें
  const getTopNews = (arr) =>
    arr.length > 0 ? arr[0] : allNews[0] || null;

  const headlines = categories
    .map((c) => ({
      ...getTopNews(c.data),
      category: c.label,
    }))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Connected to:</div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>{BACKEND}</div>

          {lastUpdated && (
            <div style={{ marginTop: 4, fontSize: 11, color: "#475569" }}>
              Last Updated: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <main className="main-column">
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

            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading latest news...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <div>
                {categories.map((cat, idx) => (
                  <div key={idx} style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 6,
                        color: "#0f172a",
                      }}
                    >
                      {cat.label}
                    </div>

                    <NewsList items={cat.data.slice(0, 1)} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="card ad">Advertisement Space</div>

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
