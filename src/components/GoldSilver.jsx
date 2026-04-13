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
    <div className="goldsilver-card">
      <h3>💰 Gold & Silver Rates</h3>
      <p>🏅 Gold (24K): {rates.gold?.["24K"] || "N/A"}</p>
      <p>🥈 Silver (1kg): {rates.silver?.["1kg"] || "N/A"}</p>
    </div>
  );
}
