// src/components/GoldSilver.jsx
import React, { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

export default function GoldSilver() {
  const [rates, setRates] = useState({ gold: {}, silver: {} });

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch(`${BACKEND}/goldsilver`);
        const data = await res.json();
        setRates({
          gold: data.gold || {},
          silver: data.silver || {}
        });
      } catch (err) {
        console.error("GoldSilver error:", err);
      }
    }
    loadRates();
  }, []);

  return (
    <div className="goldsilver-grid">
      <div>
        <h4 className="gold-rate">Gold Rates -</h4>
        <ul style={{ marginTop: 4, paddingLeft: 16 }}>
          {Object.entries(rates.gold).map(([key, value], i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <span className="gold-rate">{key}:</span> {value}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="silver-rate">Silver Rates -</h4>
        <ul style={{ marginTop: 4, paddingLeft: 16 }}>
          {Object.entries(rates.silver).map(([key, value], i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <span className="silver-rate">{key}:</span> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
