// src/components/NewsList.jsx
import React, { useState } from "react";

export default function NewsList({ items = [], hideBadge = false }) {
  const [visibleItems, setVisibleItems] = useState(() => shuffleAndPick(items));

  function shuffleAndPick(list) {
    if (!list || list.length === 0) return [];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12); // हर बार 12 खबरें दिखाएँ
  }

  const handleRefresh = () => {
    setVisibleItems(shuffleAndPick(items));
  };

  if (!items || items.length === 0) {
    return <div style={{ color: "#6b7280" }}>No news available.</div>;
  }

  return (
    <div>
      {/* Refresh Button */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <button
          onClick={handleRefresh}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Refresh News
        </button>
      </div>

      {/* News Grid */}
      <div style={{ display: "grid", gap: "6px" }}>
        {visibleItems.map((r, i) => (
          <div
            key={r.link || r.id || i}
            className="news-card news-item"
            style={{
              padding: "8px",
              borderRadius: "6px",
              background: "#fff",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Title */}
            <div
              className="news-title"
              style={{ fontSize: "15px", fontWeight: 500 }}
            >
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
    </div>
  );
}
