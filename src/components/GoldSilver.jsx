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

  // Helper function: split rate into number + unit
  const formatRate = (rate) => {
    if (!rate) return "N/A";
    const parts = rate.split(" ");
    const number = parts[0]; // ₹154,080
    const unit = parts.slice(1).join(" "); // per 10gm / per kg
    return (
      <>
        <strong>{number}</strong> {unit}
      </>
    );
  };

  return (
    <div className="goldsilver-card">
      <h3>💰 Gold & Silver Rates (Jaipur)</h3>
      <p>
        <span className="label">🏅 Gold (24K):</span>{" "}
        <span className="value">{formatRate(rates.gold?.["24K"])}</span>
      </p>
      <p>
        <span className="label">🥈 Silver (1kg):</span>{" "}
        <span className="value">{formatRate(rates.silver?.["1kg"])}</span>
      </p>
      <small className="source">Source: {rates.source}</small>
    </div>
  );
}
