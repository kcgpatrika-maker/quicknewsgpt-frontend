import React, { useEffect, useState } from "react";
import NewsList from "./components/NewsList";
import AskNews from "./components/AskNews";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

function App() {
  const [allNews, setAllNews] = useState({ international: [], india: [], rajasthan: [] });
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [intl, ind, raj] = await Promise.all([
        fetch(`${BACKEND}/headline/international`).then(r => r.json()),
        fetch(`${BACKEND}/headline/india`).then(r => r.json()),
        fetch(`${BACKEND}/headline/rajasthan`).then(r => r.json())
      ]);
      setAllNews({
        international: intl.map(n => ({ ...n, _detected: "International" })),
        india: ind.map(n => ({ ...n, _detected: "India" })),
        rajasthan: raj.map(n => ({ ...n, _detected: "Rajasthan" }))
      });
    } catch (err) {
      console.error("fetchNews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>🌍 International</h2>
      {loading ? <div>Loading...</div> : <NewsList items={allNews.international.slice(0, 5)} />}

      <h2>🇮🇳 India</h2>
      {loading ? <div>Loading...</div> : <NewsList items={allNews.india.slice(0, 5)} />}

      <h2>🏜️ Rajasthan / State</h2>
      {loading ? <div>Loading...</div> : <NewsList items={allNews.rajasthan.slice(0, 5)} />}

      <section style={{ marginTop: 20 }}>
        <h3>क्विक न्यूज़ GPT से पूछें</h3>
        <AskNews />
      </section>

      <aside style={{ marginTop: 20 }}>
        <Sidebar topItems={[...allNews.international, ...allNews.india, ...allNews.rajasthan]} />
      </aside>
    </div>
  );
}

export default App;
