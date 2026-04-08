import React, { useState } from "react";

const ADMIN_PIN = "1336";

function CustomNewsAdmin({ onAdd, onEdit, onDelete, setAuthenticated }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [authenticatedLocal, setAuthenticatedLocal] = useState(false);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticatedLocal(true);
      setShowLogin(false);
      setAuthenticated(true);   // ← यह लाइन App.jsx में isAdmin को true कर देगी
    } else {
      alert("गलत PIN!");
    }
  };

  return (
    <span style={{ marginLeft: 6 }}>
      {/* ✍️ इमोजी ही hidden बटन */}
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setShowLogin(true)}
      >
        ✍️
      </span>

      {/* PIN इनपुट */}
      {showLogin && !authenticatedLocal && (
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
      {authenticatedLocal && (
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
