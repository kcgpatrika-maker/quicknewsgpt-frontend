import React, { useState } from "react";

const ADMIN_PIN = "1336";

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

          {/* Button */}
          <button onClick={() => setOpenId(openId === r.id ? null : r.id)}>
            पूरा पढ़े
          </button>

          {/* एडमिन मोड में एडिट/डिलीट */}
          {authenticated && (
            <>
              <button onClick={() => alert("यहां एडिट API कॉल करें")}>
                ✏️ Edit
              </button>
              <button onClick={() => alert("यहां डिलीट API कॉल करें")}>
                🗑️ Delete
              </button>
            </>
          )}

          {/* Full News */}
          {openId === r.id && <div style={{ marginTop: 5 }}>{r.summary}</div>}
        </div>
      ))}
    </div>
  );
}
