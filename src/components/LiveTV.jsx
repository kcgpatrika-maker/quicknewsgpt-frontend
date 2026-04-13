// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  const channels = [
    [
      { name: "DD News", link: "https://www.youtube.com/@DDNews/live" },
      { name: "Aaj Tak", link: "https://www.youtube.com/@aajtak/live" },
    ],
    [
      { name: "ABP News", link: "https://www.youtube.com/@abpnews/live" },
      { name: "News18 Rajasthan", link: "https://hindi.news18.com/livetv/news18-rajasthan/?utm_source=copilot.com" },
    ],
    [
      { name: "Zee News", link: "https://www.youtube.com/@ZeeNews/live" },
      { name: "Zee Rajasthan", link: "https://zeenews.india.com/hindi/india/rajasthan/live-tv/embed?autoplay=1&mute=0&utm_source=copilot.com" },
    ],
  ];

  const rowColors = ["btn-row1", "btn-row2", "btn-row3"];

  return (
    <section id="live" className="livetv-card">
      <div className="channel-grid">
        {channels.map((pair, i) => (
          <div key={i} className={`channel-row ${rowColors[i]}`}>
            {pair.map((ch, j) => (
              <a
                key={j}
                href={ch.link}
                target="_blank"
                rel="noreferrer"
                className="channel-btn"
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
