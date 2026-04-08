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
        <div key={r.id} style={{ marginBottom: 10 }}>
          {editId === r.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
              />
              <button
                onClick={() => {
                  onEdit(r.id, editTitle, editSummary);
                  setEditId(null);
                }}
              >
                💾 Save
              </button>
              <button onClick={() => setEditId(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: "bold" }}>{r.title}</div>
              <span
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setOpenId(openId === r.id ? null : r.id)}
              >
                पूरा पढ़े
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
              {openId === r.id && <div style={{ marginTop: 5 }}>{r.summary}</div>}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
