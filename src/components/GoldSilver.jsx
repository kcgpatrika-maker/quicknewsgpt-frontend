// src/components/GoldSilver.jsx
import React, { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

export default function GoldSilver() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch(`${BACKEND}/goldsilver`);
        const data = await res.json();
        setRates(data.rates || []);
      } catch (err) {
        console.error("GoldSilver error:", err);
      }
    }
    loadRates();
  }, []);

  return (
    <div>
      <ul style={{ marginTop: 8, paddingLeft: 16 }}>
        {rates.map((r, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className={
                r.title.toLowerCase().includes("silver") || r.title.includes("चांदी")
                  ? "silver-rate"
                  : "gold-rate"
              }
            >
              {r.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
