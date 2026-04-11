import React, { useEffect, useState } from "react";

const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

export default function GoldSilver() {
  const [rates, setRates] = useState(null);

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch(`${BACKEND}/goldsilver`);
        const data = await res.json();
        setRates(data);
      } catch (err) {
        console.error("GoldSilver error:", err);
      }
    }
    loadRates();
  }, []);

  if (!rates) return <p>Loading Gold & Silver rates...</p>;

  return (
    <div className="goldsilver-grid">
      <h3>💰 Gold & Silver Rates</h3>

      <div className="gold-card">
        <h4>🥇 Gold Rates</h4>
        <ul>
          <li>24K: {rates.gold["24K"]}</li>
          <li>22K: {rates.gold["22K"]}</li>
        </ul>
      </div>

      <div className="silver-card">
        <h4>🥈 Silver Rates</h4>
        <ul>
          <li>1 gm: {rates.silver["1gm"]}</li>
          <li>10 gm: {rates.silver["10gm"]}</li>
          <li>1 kg: {rates.silver["1kg"]}</li>
        </ul>
      </div>

      <p style={{ fontSize: "12px", marginTop: "10px" }}>
        Last updated: {rates.date}
      </p>
    </div>
  );
}
