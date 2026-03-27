// src/components/NewsList.jsx
import React, { useEffect, useState } from "react";

export default function NewsList() {
  const [items, setItems] = useState([]);
  const BACKEND =
    import.meta.env.VITE_BACKEND_URL ||
    "https://quick-newsgpt-backend.onrender.com";

  const loadNews = async () => {
    try {
      const res = await fetch(`${BACKEND}/news`);
      const data = await res.json();
      setItems(data.slice(0, 12)); // 20 में से 12 headlines दिखाएँ
    } catch (err) {
      console.error("News load error:", err);
      setItems([]);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

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
            padding: "8px",
            borderRadius: "6px",
            background: "#fff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            className="news-title"
            style={{ fontSize: "15px", fontWeight: 500 }}
          >
            {r.title}
          </div>
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
