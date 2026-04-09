import React, { useEffect, useState } from "react";

const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000"; // अपने backend URL डालें

export default function GoldSilver() {
  const [rates, setRates] = useState({ gold: "", silver: "" });

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch(`${BACKEND}/goldsilver`);
        const data = await res.json();
        setRates({
          gold: data.gold || "",
          silver: data.silver || ""
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
        <h4 className="gold-rate">🥇 Gold Rates</h4>
        <p style={{ marginTop: 8 }}>{rates.gold}</p>
      </div>

      {/* Silver Section */}
      <div className="silver-card">
        <h4 className="silver-rate">🥈 Silver Rates</h4>
        <p style={{ marginTop: 8 }}>{rates.silver}</p>
      </div>
    </div>
  );
}
