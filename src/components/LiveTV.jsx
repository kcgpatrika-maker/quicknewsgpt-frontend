// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  const channels = [
    [
      { name: "DD News (Live)", link: "https://www.youtube.com/@DDNews/live" },
      { name: "Aaj Tak (Live)", link: "https://www.youtube.com/@aajtak/live" },
    ],
    [
      { name: "ABP News (Live)", link: "https://www.youtube.com/@abpnews/live" },
      { name: "News18 Rajasthan (Live)", link: "https://hindi.news18.com/livetv/rajasthan" },
    ],
    [
      { name: "Zee News (Live)", link: "https://www.youtube.com/@ZeeNews/live" },
      { name: "Zee Rajasthan (Live)", link: "https://zeenews.india.com/hindi/rajasthan" },
    ],
  ];

  return (
    <section id="live" className="livetv-card">
      <h3>📺 Live TV</h3>
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
