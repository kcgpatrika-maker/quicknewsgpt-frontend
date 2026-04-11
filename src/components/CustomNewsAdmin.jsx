import React, { useState } from "react";

const ADMIN_PIN = "1336";

function CustomNewsAdmin({ onAdd, setAuthenticated }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [authenticatedLocal, setAuthenticatedLocal] = useState(false);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticatedLocal(true);
      setShowLogin(false);
      setAuthenticated(true);   // App.jsx में isAdmin को true कर देगा
    } else {
      alert("गलत PIN!");
    }
  };

  const handleAdd = () => {
    if (!headline.trim() || !summary.trim()) {
      alert("कृपया हेडलाइन और खबर दोनों लिखें");
      return;
    }
    onAdd(headline.trim(), summary.trim());
    setHeadline("");
    setSummary("");
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
            placeholder="पूरी खबर (100 शब्द सीमा)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={600} // लगभग 100 शब्दों के बराबर
          />
          <button onClick={handleAdd}>➕ Add</button>
        </span>
      )}
    </span>
  );
}

export default CustomNewsAdmin;
