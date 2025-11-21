import React from "react";

function NewsList({ items = [], hideBadge = false }) {
  if (!items || !items.length) {
    return <div className="news-item card" style={{ padding: 10, background: "#fff", borderRadius: 8 }}>No news available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((item, idx) => (
        <div key={item.url || idx} style={{ padding: 12, background: "#fff", borderRadius: 8, border: "1px solid #eef2ff" }}>
          {!hideBadge && item.category && (
            <div style={{ display: "inline-block", marginBottom: 6, padding: "4px 8px", borderRadius: 6, fontSize: 13, background: "#e0f2fe", color: "#0369a1", fontWeight: 600 }}>
              {item.category}
            </div>
          )}
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.title || "No title"}</div>
          <div style={{ fontSize: 14, color: "#374151" }}>{item.summary || "No summary available."}</div>
          {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontSize: 13 }}>Read full story</a>}
        </div>
      ))}
    </div>
  );
}

export default NewsList;
