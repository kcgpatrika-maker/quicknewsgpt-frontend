import React, { useEffect, useState } from "react";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Normalize backend response to an array of items
  const parseResponseToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // known shapes:
    if (data.news && Array.isArray(data.news)) return data.news;
    if (data.samples && Array.isArray(data.samples)) return data.samples;
    // sometimes backend returns {date,...} with news key nested differently
    if (data.items && Array.isArray(data.items)) return data.items;
    // fallback: maybe object with keys -> convert to array of values
    return [];
  };

  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/news`);
      const data = await res.json();
      const arr = parseResponseToArray(data);
      setNews(arr);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching news:", err);
      setNews([]);
    } finally {
      setLoading(false);
      // small delay so refresh icon visible
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchNews(); // first load
    const id = setInterval(fetchNews, 60000); // every 60s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="news-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title">Latest Headlines</h2>
        <div style={{ fontSize: 13, color: "#475569", display: "flex", gap: 10, alignItems: "center" }}>
          {lastUpdated && <div>Last: {lastUpdated}</div>}
          <button
            onClick={fetchNews}
            className="refresh-btn"
            title="Refresh now"
            aria-label="Refresh headlines"
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <span className={isRefreshing ? "refresh-spin" : "refresh-idle"}>⟳</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="news-card">Loading headlines...</div>
      ) : news.length === 0 ? (
        <div className="news-card">No news available.</div>
      ) : (
        news.map((item, idx) => (
          <div key={item.id || idx} className="news-card">
            <h3>{item.title || item.heading || "No title"}</h3>
            <p>{item.summary || item.description || item.content || "No summary available."}</p>
            {item.link ? (
              <a href={item.link} target="_blank" rel="noreferrer" className="read-btn">
                Read Full Story
              </a>
            ) : (
              <span className="read-btn disabled">Read Full Story</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NewsList;
