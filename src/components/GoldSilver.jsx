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
      <div className="gold-card">
        <h4>🥇 GOLD</h4>
        <p>{rates.gold}</p>
      </div>

      <div className="silver-card">
        <h4>🥈 SILVER</h4>
        <p>{rates.silver}</p>
      </div>
    </div>
  );
}
