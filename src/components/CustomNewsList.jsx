import React, { useState } from "react";

export default function CustomNewsList({ items = [], authenticated, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);

  if (!items || items.length === 0) {
    return <div>कोई खबर नहीं</div>;
  }

  return (
    <div>
      {items.map((r) => (
        <div key={r.id} style={{ marginBottom: 10 }}>
          {/* Headline */}
          <div style={{ fontWeight: "bold" }}>{r.title}</div>

          {/* टेक्स्ट लिंक */}
          <span
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setOpenId(openId === r.id ? null : r.id)}
          >
            पूरा पढ़े
          </span>

          {/* एडमिन मोड में एडिट/डिलीट */}
          {authenticated && (
            <>
              <button onClick={() => onEdit(r.id, r.title, r.summary)}>✏️ Edit</button>
              <button onClick={() => onDelete(r.id)}>🗑️ Delete</button>
            </>
          )}

          {/* Full News */}
          {openId === r.id && <div style={{ marginTop: 5 }}>{r.summary}</div>}
        </div>
      ))}
    </div>
  );
}
