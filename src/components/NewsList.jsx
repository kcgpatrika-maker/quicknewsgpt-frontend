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
          className="news-card"
          style={{
            padding: "10px",
            borderRadius: "10px",
            background: "#fff",
            border: "1px solid #eef2ff",
          }}
        >
          {/* Title */}
          <div style={{ fontWeight: 600 }}>{r.title}</div>

          {/* Summary → सिर्फ़ desktop पर दिखे */}
          <div className="news-summary">
            {r.summary || r.description || ""}
          </div>

          {/* Read full story link */}
          {r.link && (
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb", fontSize: 13 }}
            >
              Read full story
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
