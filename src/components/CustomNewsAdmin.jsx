import React, { useState } from "react";

const ADMIN_PIN = "1336";

function CustomNewsAdmin({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <span style={{ marginLeft: 6 }}>
      <button
        style={{
          fontSize: 10,
          background: "transparent",
          border: "none",
          color: "transparent"
        }}
        onClick={() => setShowLogin(true)}
      >
        .
      </button>

      {showLogin && (
        <>
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button
            onClick={() => {
              if (pin === ADMIN_PIN) {
                onLogin(true);
                setShowLogin(false);
              } else {
                alert("गलत PIN");
              }
            }}
          >
            OK
          </button>
        </>
      )}
    </span>
  );
}

export default CustomNewsAdmin;
