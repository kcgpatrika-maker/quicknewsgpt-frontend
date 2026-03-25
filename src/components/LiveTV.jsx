// src/components/LiveTV.jsx
import React from "react";

function LiveTV() {
  return (
    <section id="live" className="card" style={{ marginTop: 12 }}>
      <h3>Live TV</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: 6 }}>
          <a href="https://www.youtube.com/@DoordarshanNational" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            DD National
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a href="https://www.youtube.com/@DDNewsLive" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            DD News
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a href="https://www.youtube.com/@ZeeNews" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            Zee News
          </a>
        </li>
        <li style={{ marginBottom: 6 }}>
          <a href="https://www.youtube.com/@aajtak" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            Aaj Tak
          </a>
        </li>
      </ul>
    </section>
  );
}

export default LiveTV;
