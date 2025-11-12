import React, { useEffect, useState } from "react";
import AskNews from "./components/AskNews";
import Sidebar from "./components/Sidebar";
import "./index.css";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/news`);
        const data = await res.json();
        if (data?.news) setNews(data.news);
        else if (data?.samples) setNews(data.samples);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="app-container">
      <div className="main-section">
        <h1 className="headline">🗞️ Latest Headlines</h1>

        {loading ? (
          <p>Loading news...</p>
        ) : (
          <div className="news-list">
            {news.map((item, i) => (
              <div key={i} className="news-card">
                <h3>{item.title}</h3>
                <p>{item.summary || item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="read-link"
                  >
                    Read Full Story →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="ad-box">
          <strong>Advertisement Space</strong>
        </div>

        <div className="ask-section">
          <AskNews />
        </div>
      </div>

      <Sidebar />
    </div>
  );
}

export default App;
