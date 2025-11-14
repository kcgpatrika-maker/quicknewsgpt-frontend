import React from "react";

export default function NewsList({ items = [] }) {

  // fallback safety
  const news = Array.isArray(items) ? items : [];

  if (!news.length) {
    return <div className="news-item card">No news available.</div>;
  }

  return (
    <div className="news-section">

      {news.map((item, idx) => (
        <div key={item.id || item.link || idx} className="news-item card">

          {/* Category Badge */}
          {item.category && (
            <div
              style={{
                display: "inline-block",
                marginBottom: 6,
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: 12,
                background: "#e0f2fe",
                color: "#0369a1",
                fontWeight: 600,
              }}
            >
              {item.category}
            </div>
          )}

          {/* Title */}
          <div className="news-title" style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            {item.title || item.heading || "No title"}
          </div>

          {/* Summary */}
          <div style={{ color: "#374151", fontSize: 14 }}>
            {item.summary || item.description || item.content || "No summary available."}
          </div>

          {/* Link */}
          <div style={{ marginTop: 8 }}>
            {item.link ? (
              <a className="read-more" href={item.link} target="_blank" rel="noreferrer">
                Read Full Story
              </a>
            ) : (
              <span className="read-more">Read Full Story</span>
            )}
          </div>
        </div>
      ))}

    </div>
  );
}
