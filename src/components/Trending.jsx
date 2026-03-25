// src/components/Trending.jsx
import React from "react";

function Trending() {
  return (
    <section id="trending" className="card" style={{ marginTop: 12 }}>
      <h3>Top 5 Trending</h3>
      <p style={{ color: "#374151", fontSize: 14 }}>
        (YouTube Trending + Google Trends integration will be added here.)
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: 6 }}>
          <a href="https://www.youtube.com/feed/trending" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            YouTube Trending Videos
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a href="https://trends.google.com/trends/trendingsearches/daily?geo=IN" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            Google Trends India
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Trending;
