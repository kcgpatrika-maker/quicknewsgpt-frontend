import React, { useState } from "react";

const ADMIN_PIN = "1336";

function CustomNewsAdmin({ onAdd }) {
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
      {!authenticated ? (
        <>
          {/* Hidden button */}
          <button
            style={{
              fontSize: 10,
              padding: "2px 4px",
              background: "transparent",
              border: "none",
              color: "transparent",
              cursor: "default"
            }}
            onClick={() => setShowLogin(true)}
          >
            .
          </button>

          {showLogin && (
            <span style={{ marginLeft: 6 }}>
              <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button onClick={handleLogin}>OK</button>
            </span>
          )}
        </>
      ) : (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="हेडलाइन"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={100}
            style={{ width: "100%", marginBottom: 6 }}
          />

          <textarea
            placeholder="पूरी खबर (100 शब्द)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ width: "100%", height: 80 }}
          />

          <br />

          <button
            onClick={() => {
              if (!headline || !summary) {
                alert("पूरा भरें");
                return;
              }
              onAdd(headline, summary);
              setHeadline("");
              setSummary("");
            }}
          >
            Save
          </button>
        </div>
      )}
    </span>
  );
}

export default CustomNewsAdmin;
