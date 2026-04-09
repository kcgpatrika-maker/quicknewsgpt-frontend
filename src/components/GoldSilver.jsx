import React, { useEffect, useState } from "react";

const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000"; // अपने backend URL डालें

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
      {/* Gold Section */}
      <div className="gold-card">
        <h4>🥇 GOLD</h4>
        <p>{rates.gold.price}</p>
        <p>{rates.gold.change} ({rates.gold.percent})</p>
        <small>{rates.gold.unit}</small>
      </div>

      {/* Silver Section */}
      <div className="silver-card">
        <h4>🥈 SILVER</h4>
        <p>{rates.silver.price}</p>
        <p>{rates.silver.change} ({rates.silver.percent})</p>
        <small>{rates.silver.unit}</small>
      </div>
    </div>
  );
}
