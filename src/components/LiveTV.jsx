// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  return (
    <section id="live" className="card" style={{ marginTop: 12 }}>
      <h3>📺 Live TV</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: 6 }}>
          <a
            href="https://www.youtube.com/@DoordarshanNational/live"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            DD National (Live)
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a
            href="https://www.youtube.com/@DDNewsLive/live"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            DD News (Live)
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a
            href="https://www.youtube.com/@ZeeNews/live"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            Zee News (Live)
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a
            href="https://www.youtube.com/@aajtak/live"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            Aaj Tak (Live)
          </a>
        </li>
      </ul>
    </section>
  );
}

export default LiveTV;
