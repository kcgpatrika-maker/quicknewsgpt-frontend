// src/components/NewsList.jsx
import React from "react";

export default function NewsList({ items = [], hideBadge = false }) {
  if (!items || items.length === 0) {
    return <div style={{ color: "#6b7280" }}>No news available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: "6px" }}>
      {items.map((r, i) => (
        <div
          key={r.link || r.id || i}
          className="news-card news-item"
          style={{
            padding: "8px",              // पहले 10px था → अब छोटा
            borderRadius: "6px",         // पहले 10px था → अब compact
            background: "#fff",
            border: "1px solid #e5e7eb", // हल्का border
          }}
        >
          {/* Title */}
          <div className="news-title" style={{ fontSize: "15px", fontWeight: 500 }}>
            {r.title}
          </div>

          {/* Read full story link */}
          {r.link && (
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="read-more"
              style={{ fontSize: "13px", color: "#2563eb" }}
            >
              Read full story
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
