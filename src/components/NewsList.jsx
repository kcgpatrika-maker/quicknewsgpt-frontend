import React, { useEffect, useState } from "react";

export default function NewsList({ fetchNews }) {
  const [items, setItems] = useState([]);

  // पहली बार load पर news लाओ
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await fetchNews(); // backend से 20 खबरें आएँगी
      setItems(data.slice(0, 12));    // उनमें से 12 headlines दिखाएँ
    } catch (err) {
      console.error("News load error:", err);
      setItems([]);
    }
  };

  // मोबाइल पर finger‑pull refresh → loadNews फिर से चलेगा
  const handleRefresh = () => {
    loadNews();
  };

  if (!items || items.length === 0) {
    return <div style={{ color: "#6b7280" }}>No news available.</div>;
  }

  return (
    <div>
      {/* Refresh trigger (mobile पर finger‑pull से भी होगा) */}
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
    </div>
  );
}
