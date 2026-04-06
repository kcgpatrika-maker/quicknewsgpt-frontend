import React, { useState } from "react";

const ADMIN_PIN = "1336";

function CustomNewsAdmin({ onAdd, setAuthenticated }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [authenticated, setLocalAuthenticated] = useState(false);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setLocalAuthenticated(true);
      setShowLogin(false);
      if (setAuthenticated) setAuthenticated(true); // 🔹 App.jsx को भी बताएं कि एडमिन लॉगिन हो गया
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
        </>
      ) : (
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
