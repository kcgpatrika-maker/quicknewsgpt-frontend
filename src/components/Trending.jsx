// src/components/Trending.jsx
import React, { useEffect, useState } from "react";

export default function Trending() {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    // फिलहाल static headlines + links डाल रहे हैं
    // बाद में backend से dynamic data लाया जा सकता है
    setTrends([
      { title: "India wins crucial cricket match", link: "https://www.espncricinfo.com/" },
      { title: "New AI policy announced by govt", link: "https://www.livemint.com/" },
      { title: "Bollywood movie breaks box office records", link: "https://www.bollywoodhungama.com/" },
      { title: "Global markets show recovery signs", link: "https://economictimes.indiatimes.com/" },
      { title: "Major tech launch excites youth", link: "https://www.gadgets360.com/" },
    ]);
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
