import React from "react";

export default function NewsList({ items = [], hideBadge = false }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div style={{ padding: 10, background: "#fff", borderRadius: 8 }}>No news available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((item, idx) => (
        <div key={item.url || idx} style={{ padding: 12, background: "#fff", borderRadius: 8, border: "1px solid #eef2ff" }}>
          {!hideBadge && item._detected && (
            <div style={{ display: "inline-block", marginBottom: 6, padding: "4px 8px", borderRadius: 6, fontSize: 13, background: "#e0f2fe", color: "#0369a1", fontWeight: 600 }}>
              {item._detected}
            </div>
          )}
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{item.title || "No title"}</div>
          <div style={{ color: "#374151", fontSize: 14 }}>{item.summary || item.description || "No summary available."}</div>
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontSize: 13 }}>Read full story</a>
          )}
        </div>
      ))}
    </div>
  );
}
