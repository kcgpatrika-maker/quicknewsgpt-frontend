// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";
const SHOW_CONNECTED = false;

const toLower = (s) => (s || "").toLowerCase();

// bilingual keywords
const KEYWORDS = {
  international: [
    "world","international","foreign","us","u.s.","usa","america","united states","china","russia","pakistan","global","europe","uk","britain"
  ],
  india: [
    "india","bharat","delhi","mumbai","bangalore","kolkata","chennai","modi","parliament","भारत","दिल्ली","मुंबई"
  ],
  rajasthan: [
    "rajasthan","जयपुर","jaipur","jodhpur","उदयपुर","udaipur","ajmer","bikaner","jaisalmer","alwar","sikar","सीकर"
  ]
};

function textHasAny(text = "", list = []) {
  const t = toLower(text);
  return list.some(k => t.includes(k));
}

function detectCategory(item) {
  const txt = `${item.title || ""} ${item.summary || ""} ${item.description || ""}`;
  if (textHasAny(txt, KEYWORDS.rajasthan)) return "rajasthan";
  if (textHasAny(txt, KEYWORDS.international)) return "international";
  if (textHasAny(txt, KEYWORDS.india)) return "india";
  return "general";
}

function App() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      const items = data?.news || data?.items || [];
      setAllNews(items);
    } catch (err) {
      console.error(err);
      setAllNews([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);

  // filter three blocks
  const intl = allNews.filter(n => detectCategory(n) === "international").slice(0, 1);
  const india = allNews.filter(n => detectCategory(n) === "india").slice(0, 1);
  const raj = allNews.filter(n => detectCategory(n) === "rajasthan").slice(0, 1);

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India News — हिंदी + English</div>
        </div>
        <button onClick={fetchNews}>↻</button>
      </div>

      <div className="container">
        <main className="main-column">

          <section className="card">
            <h2 style={{ margin: 0 }}>Latest Headlines</h2>

            {/* FIXED category blocks */}
            <div className="category-block">
              <div className="cat-title">🌍 International</div>
              <NewsList items={intl} hideBadge={true} />
            </div>

            <div className="category-block">
              <div className="cat-title">🇮🇳 India</div>
              <NewsList items={india} hideBadge={true} />
            </div>

            <div className="category-block">
              <div className="cat-title">🏜 Rajasthan / State</div>
              <NewsList items={raj} hideBadge={true} />
            </div>
          </section>

          <div className="card ad">Advertisement Space</div>

          <section className="card">
            <h3>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

        </main>

        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}

export default App;
