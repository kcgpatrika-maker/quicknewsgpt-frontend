// src/components/Trending.jsx
import React, { useEffect, useState } from "react";

export default function Trending() {
  const [trends, setTrends] = useState([]);

useEffect(() => {
  async function loadTrending() {
    try {
      const res = await fetch(`${BACKEND}/trending`);
      const data = await res.json();
      setTrends(data.news || []);
    } catch (err) {
      console.error("Trending error:", err);
    }
  }
  loadTrending();
}, []);

  return (
    <div>
      <ul style={{ marginTop: 8, paddingLeft: 16 }}>
        {trends.map((t, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <a
              href={t.link}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb", fontWeight: 500 }}
            >
              {t.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
