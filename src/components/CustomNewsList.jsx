import React, { useState } from "react";

export default function CustomNewsList({ items = [], authenticated, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");

  if (!items || items.length === 0) {
    return <div>कोई खबर नहीं</div>;
  }

  return (
    <div>
      {items.map((r) => (
        <div key={r.id} className="kalam-news-item">
          {editId === r.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={100}
              />
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                maxLength={600}
              />
              <button
                onClick={() => {
                  if (!editTitle.trim() || !editSummary.trim()) {
                    alert("कृपया हेडलाइन और खबर दोनों लिखें");
                    return;
                  }
                  onEdit(r.id, editTitle.trim(), editSummary.trim());
                  setEditId(null);
                }}
              >
                💾 Save
              </button>
              <button onClick={() => setEditId(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <h4>{r.title}</h4>
              <span
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setOpenId(openId === r.id ? null : r.id)}
              >
                पूरा पढ़ें
              </span>
              {authenticated && (
                <>
                  <button
                    onClick={() => {
                      setEditId(r.id);
                      setEditTitle(r.title);
                      setEditSummary(r.summary);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => onDelete(r.id)}>🗑️ Delete</button>
                </>
              )}
              {openId === r.id && <p>{r.summary}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
