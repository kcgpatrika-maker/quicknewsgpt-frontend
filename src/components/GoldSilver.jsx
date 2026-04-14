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
      <h3>💰 Gold & Silver Rates (Jaipur)</h3>
      <p>
        <span className="label">🏅 Gold (24K):</span>{" "}
        <span className="value">{rates.gold?.["24K"] || "N/A"}</span>
      </p>
      <p>
        <span className="label">🥈 Silver (1kg):</span>{" "}
        <span className="value">{rates.silver?.["1kg"] || "N/A"}</span>
      </p>
    </div>
  );
}
