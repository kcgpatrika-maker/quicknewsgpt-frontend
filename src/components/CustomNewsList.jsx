import React, { useState } from "react";

export default function CustomNewsList({ items = [] }) {
  const [openId, setOpenId] = useState(null);

  if (!items || items.length === 0) {
    return <div>कोई खबर नहीं</div>;
  }

  return (
    <div>
      {items.map((r) => (
        <div key={r.id} style={{ marginBottom: 10 }}>
          {/* Headline */}
          <div style={{ fontWeight: "bold" }}>
            {r.title}
          </div>

          {/* Button */}
          <button onClick={() => setOpenId(openId === r.id ? null : r.id)}>
            पूरा पढ़े
          </button>

          {/* Full News */}
          {openId === r.id && (
            <div style={{ marginTop: 5 }}>
              {r.summary}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
