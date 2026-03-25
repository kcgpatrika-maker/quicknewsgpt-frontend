// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  const channels = [
    {
      name: "DD National (Live)",
      link: "https://www.youtube.com/@DoordarshanNational/live",
    },
    {
      name: "DD News (Live)",
      link: "https://www.youtube.com/@DDNews/live", // सही official चैनल
    },
    {
      name: "Zee News (Live)",
      link: "https://www.youtube.com/@ZeeNews/live",
    },
    {
      name: "Aaj Tak (Live)",
      link: "https://www.youtube.com/@aajtak/live",
    },
    {
      name: "ABP News (Live)",
      link: "https://www.youtube.com/@abpnews/live",
    },
  ];

  return (
    <section id="live" className="card" style={{ marginTop: 12 }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {channels.map((ch, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <a
              href={ch.link}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb", fontWeight: 500 }}
            >
              {ch.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LiveTV;
