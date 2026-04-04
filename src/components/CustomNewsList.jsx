import React from "react";

export default function CustomNewsList({ items = [], onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <div>कोई खबर नहीं</div>;
  }

  return (
    <div>
      {items.map((r, i) => (
        <div key={r.id || i} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: "bold" }}>{r.title}</div>

          {r.summary && <div>{r.summary}</div>}

          {/* 👇 Delete अब हमेशा दिखेगा */}
          <div style={{ marginTop: 5 }}>
            <button
              onClick={() => {
                const newHeadline = prompt("नया headline:", r.title);
                if (newHeadline) {
                  onEdit(r.id, newHeadline, r.summary);
                }
              }}
            >
              ✏️ Edit
            </button>

            <button onClick={() => onDelete(r.id)}>
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
