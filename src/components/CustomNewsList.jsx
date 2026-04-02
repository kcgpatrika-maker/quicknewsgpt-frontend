// src/components/CustomNewsList.jsx
import React from "react";

export default function CustomNewsList({ items = [], onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <div style={{ color: "#6b7280" }}>No custom news available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: "6px" }}>
      {items.map((r, i) => (
        <div
          key={r.id || i}
          className="news-card news-item"
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: "#fff",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Title */}
          <div className="news-title" style={{ fontSize: "15px", fontWeight: 500 }}>
            {r.title}
          </div>

          {/* Summary */}
          {r.summary && (
            <div style={{ fontSize: "13px", color: "#374151", marginTop: 4 }}>
              {r.summary}
            </div>
          )}

          {/* Link */}
          {r.link && (
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "13px", color: "#2563eb", marginTop: 4 }}
            >
              Read full story
            </a>
          )}

          {/* Admin actions */}
          {onEdit && onDelete && (
            <div style={{ marginTop: 6 }}>
              <button
                style={{ fontSize: 12, marginRight: 6 }}
                onClick={() => {
                  const newHeadline = prompt("नया headline लिखें:", r.title);
                  if (newHeadline) onEdit(r.id, newHeadline);
                }}
              >
                ✏️ Edit
              </button>
              <button
                style={{ fontSize: 12 }}
                onClick={() => onDelete(r.id)}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
