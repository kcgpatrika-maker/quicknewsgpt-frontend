// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  const channels = [
    [
      { name: "DD News (Live)", link: "https://www.youtube.com/@DDNews/live", color: "#0b3d91" }, // Navy Blue
      { name: "Aaj Tak (Live)", link: "https://www.youtube.com/@aajtak/live", color: "#d32f2f" }, // Red
    ],
    [
      { name: "ABP News (Live)", link: "https://www.youtube.com/@abpnews/live", color: "#e53935" }, // Red
      { name: "News18 Rajasthan (Live)", link: "https://hindi.news18.com/livetv/rajasthan", color: "#1a73e8" }, // Blue
    ],
    [
      { name: "Zee News (Live)", link: "https://www.youtube.com/@ZeeNews/live", color: "#1565c0" }, // Blue
      { name: "Zee Rajasthan (Live)", link: "https://zeenews.india.com/hindi/rajasthan", color: "#1565c0" }, // Blue
    ],
  ];

  return (
    <section id="live" className="livetv-card">
      <div className="channel-grid">
        {channels.map((pair, i) => (
          <div key={i} className="channel-row">
            {pair.map((ch, j) => (
              <a
                key={j}
                href={ch.link}
                target="_blank"
                rel="noreferrer"
                className="channel-link"
                style={{ color: ch.color }}
              >
                {ch.name}
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveTV;
