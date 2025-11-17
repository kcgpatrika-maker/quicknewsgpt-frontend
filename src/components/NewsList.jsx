import React from "react";

function NewsList({ items = [], hideBadge = false }) {
  const news = Array.isArray(items) ? items : [];

  if (!news.length) {
    return (
      <div className="news-item card" style={{ padding: 10, background: "#fff", borderRadius: 8 }}>
        No news available.
      </div>
    );
  }

  return (
    <div className="news-section" style={{ display: "grid", gap: 10 }}>
      {news.map((item, idx) => (
        <div
          key={item.id || item.link || idx}
          className="news-item card"
          style={{
            padding: 12,
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #eef2ff",
          }}
        >
          {/* NO CATEGORY BADGES ANYMORE */}

          <div className="news-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            {item.title || item.heading || "No title"}
          </div>

          <div style={{ color: "#374151", fontSize: 14 }}>
            {item.summary || item.description || item.content || ""}
          </div>

          <div style={{ marginTop: 8 }}>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb" }}
              >
                Read Full Story
              </a>
            ) : (
              <span style={{ color: "#6b7280" }}>Read Full Story</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewsList;
