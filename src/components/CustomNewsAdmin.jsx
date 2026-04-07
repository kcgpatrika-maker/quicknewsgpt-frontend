import React, { useState } from "react";

const ADMIN_PIN = "1336";

function CustomNewsAdmin({ onAdd, onEdit, onDelete }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");

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
      {/* ✍️ इमोजी ही hidden बटन है */}
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setShowLogin(true)}
      >
        ✍️
      </span>

      {/* PIN इनपुट */}
      {showLogin && !authenticated && (
        <>
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}

      {/* एडमिन मोड */}
      {authenticated && (
        <span>
          <input
            type="text"
            placeholder="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={100}
          />
          <textarea
            placeholder="पूरी खबर"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <button onClick={() => onAdd(headline, summary)}>➕ Add</button>
        </span>
      )}
    </span>
  );
}

export default CustomNewsAdmin;
