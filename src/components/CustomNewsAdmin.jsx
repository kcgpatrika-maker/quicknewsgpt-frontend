import React, { useState } from "react";

const ADMIN_PIN = "1336"; // अपना PIN यहां रखें

function CustomNewsAdmin({ onAdd, onEdit, onDelete }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [headline, setHeadline] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setShowLogin(false);
    } else {
      alert("गलत PIN!");
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      {!authenticated ? (
        <>
          <button
            style={{ fontSize: 12, padding: "4px 6px", background: "#ddd", borderRadius: 4 }}
            onClick={() => setShowLogin(true)}
          >
            🔒
          </button>
          {showLogin && (
            <div style={{ marginTop: 6 }}>
              <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
        </>
      ) : (
        <div style={{ marginTop: 6 }}>
          <h4>✍️ Add/Edit News</h4>
          <input
            type="text"
            placeholder="Headline (max 100 chars)"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={100}
            style={{ width: "100%", marginBottom: 6 }}
          />
          <button onClick={() => onAdd(headline)}>➕ Add</button>
          <button onClick={() => onEdit(headline)}>✏️ Edit</button>
          <button onClick={onDelete}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
}

export default CustomNewsAdmin;
