// src/components/NewsList.jsx
import React from "react";

export default function NewsList({ items = [], hideBadge = false }) {
  if (!items || items.length === 0) {
    return <div style={{ color: "#6b7280" }}>No news available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: "8px" }}>
      {items.map((r, i) => (
        <div
          key={r.link || r.id || i}
          className="news-card news-item"
          style={{
            padding: "10px",
            borderRadius: "10px",
            background: "#fff",
            border: "1px solid #eef2ff",
          }}
        >
          {/* Title */}
          <div className="news-title">{r.title}</div>

          {/* Summary → सिर्फ़ desktop पर दिखे */}
          {r.summary && (
            <div className="news-summary">
              {r.summary || r.description || ""}
            </div>
          )}

          {/* Read full story link */}
          {r.link && (
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="read-more"
            >
              Read full story
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
