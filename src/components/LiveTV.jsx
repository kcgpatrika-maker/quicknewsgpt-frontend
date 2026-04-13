// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  const channels = [
    [
      { name: "DD News (Live)", link: "https://www.youtube.com/@DDNews/live", className: "ddnews" },
      { name: "Aaj Tak (Live)", link: "https://www.youtube.com/@aajtak/live", className: "aajtak" },
    ],
    [
      { name: "ABP News (Live)", link: "https://www.youtube.com/@abpnews/live", className: "abpnews" },
      { name: "News18 Rajasthan (Live)", link: "https://hindi.news18.com/livetv/news18-rajasthan/?utm_source=copilot.com", className: "news18" },
    ],
    [
      { name: "Zee News (Live)", link: "https://www.youtube.com/@ZeeNews/live", className: "zeenews" },
      { name: "Zee Rajasthan (Live)", link: "https://zeenews.india.com/hindi/india/rajasthan/live-tv/embed?autoplay=1&mute=0&utm_source=copilot.com", className: "zeerajasthan" },
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
                className={`channel-link ${ch.className}`}
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
