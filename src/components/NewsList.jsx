import React, { useEffect, useState } from "react";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Accepts various backend response shapes and return array
  const normalize = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.news && Array.isArray(data.news)) return data.news;
    if (data.samples && Array.isArray(data.samples)) return data.samples;
    if (data.items && Array.isArray(data.items)) return data.items;
    // fallback: try to find first array property
    for (const k of Object.keys(data)) {
      if (Array.isArray(data[k])) return data[k];
    }
    return [];
  };

  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/news`);
      const data = await res.json();
      const arr = normalize(data);
      setNews(arr.slice(0, 3)); // show top 3 as before
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("News fetch error:", err);
      setNews([]); // fallback to empty; backend may have sample endpoint
    } finally {
      setLoading(false);
      // keep spin visible briefly
      setTimeout(() => setIsRefreshing(false), 350);
    }
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60000); // every 60s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="news-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title" style={{ margin: 0 }}>Latest Headlines</h2>
        <div className="refresh-info">
          {lastUpdated && <div style={{ fontSize: 13, color: "#475569" }}>Updated {lastUpdated}</div>}
          <button onClick={fetchNews} title="Refresh now" className="refresh-btn" style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            <span className={isRefreshing ? "refresh-spin refresh-icon" : "refresh-idle refresh-icon"}>🔄</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="news-item card">Loading latest news...</div>
      ) : news.length === 0 ? (
        <div className="news-item card">No news available.</div>
      ) : (
        news.map((item, idx) => (
          <div key={item.id || item.link || idx} className="news-item card">
            <div className="news-title" style={{ fontSize: 18, marginBottom: 6 }}>
              {item.title || item.heading || "No title"}
            </div>
            <div style={{ color: "#374151", fontSize: 14 }}>
              {item.summary || item.description || item.content || "No summary available."}
            </div>
            <div style={{ marginTop: 8 }}>
              {item.link ? (
                <a className="read-more" href={item.link} target="_blank" rel="noreferrer">Read Full Story</a>
              ) : (
                <span className="read-more">Read Full Story</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsList;
