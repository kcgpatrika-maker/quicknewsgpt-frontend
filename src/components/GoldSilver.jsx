import React, { useEffect, useState } from "react";

const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

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
        <h4 className="gold-rate">🥇 Gold Rates</h4>
        <ul>
          <li>24K: {rates.gold["24K"]}</li>
          <li>22K: {rates.gold["22K"]}</li>
          <li>18K: {rates.gold["18K"]}</li>
          <li>Jewellery: {rates.gold["jewellery"]}</li>
        </ul>
      </div>

      {/* Silver Section */}
      <div className="silver-card">
        <h4 className="silver-rate">🥈 Silver Rates</h4>
        <ul>
          <li>10 gm: {rates.silver["10gm"]}</li>
          <li>100 gm: {rates.silver["100gm"]}</li>
          <li>1 kg: {rates.silver["1kg"]}</li>
        </ul>
      </div>
    </div>
  );
}
