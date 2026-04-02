import React, { useState } from "react";

const ADMIN_PIN = "1336"; // अपना PIN यहां रखें

function CustomNewsAdmin({ onAdd, onEdit, onDelete }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [headline, setHeadline] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setShowLogin(false);
    } else {
      alert("गलत PIN!");
    }
  };

  return (
    <span style={{ marginLeft: 6 }}>
      {!authenticated ? (
        <>
          <button
            style={{
              fontSize: 12,
              padding: "2px 4px",
              background: "#ddd",
              borderRadius: 4,
            }}
            onClick={() => setShowLogin(true)}
          >
            ▢
          </button>
          {showLogin && (
            <span style={{ marginLeft: 6 }}>
              <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
            </span>
          )}
        </>
      ) : (
        <span style={{ marginLeft: 6 }}>
          <input
            type="text"
            placeholder="Headline (max 100 chars)"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={100}
            style={{ width: "200px", marginRight: 6 }}
          />
          <button onClick={() => onAdd(headline)}>➕ Add</button>
          {selectedId && (
            <>
              <button onClick={() => onEdit(selectedId, headline)}>✏️ Edit</button>
              <button onClick={() => onDelete(selectedId)}>🗑️ Delete</button>
            </>
          )}
        </span>
      )}
    </span>
  );
}

export default CustomNewsAdmin;
