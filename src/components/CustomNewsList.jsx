import React, { useState } from "react";

export default function CustomNewsList({ items = [] }) {
  const [openId, setOpenId] = useState(null);
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  if (!items || items.length === 0) {
    return <div>कोई खबर नहीं</div>;
  }

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
    } else {
      alert("गलत PIN!");
    }
  };

  return (
    <div>
      {!authenticated ? (
        <>
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      ) : null}

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
