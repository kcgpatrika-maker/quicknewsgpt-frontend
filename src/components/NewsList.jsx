// src/components/NewsList.jsx
import React from "react";

function NewsList({ items = [], hideBadge = false }) {
  const news = Array.isArray(items) ? items : [];

  if (!news.length) {
    return (
      <div
        className="news-item card"
        style={{ padding: 10, background: "#fff", borderRadius: 8 }}
      >
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
          {/* Category Badge */}
          {!hideBadge && item.category && (
            <div
              style={{
                display: "inline-block",
                marginBottom: 6,
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: 13,
                background: "#e0f2fe",
                color: "#0369a1",
                fontWeight: 600,
              }}
            >
              {item.category}
            </div>
          )}

          {/* Title */}
          <div
            className="news-title"
            style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}
          >
            {item.title || item.heading || "No title"}
          </div>

          {/* Thumbnail Image */}
          {item.image && (
            <img
              src={item.image}
              alt="thumbnail"
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 8,
                maxHeight: 200,
                objectFit: "cover",
              }}
            />
          )}

          {/* Summary */}
          <div style={{ color: "#374151", fontSize: 14 }}>
            {item.summary ||
              item.description ||
              item.content ||
              "No summary available."}
          </div>

          {/* Source + Date */}
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 6,
            }}
          >
            {item.source ? `Source: ${item.source}` : ""}
            {item.pubDate
              ? ` | ${new Date(item.pubDate).toLocaleDateString()}`
              : ""}
          </div>

          {/* Link */}
          <div style={{ marginTop: 8 }}>
            {item.link ? (
              <a
                className="read-more"
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb" }}
              >
                Read Full Story
              </a>
            ) : (
              <span className="read-more" style={{ color: "#6b7280" }}>
                Read Full Story
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewsList;
