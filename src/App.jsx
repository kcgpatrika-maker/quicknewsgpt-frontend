import React from "react";
import NewsList from "./components/NewsList";
import AskNews from "./components/AskNews";
import Sidebar from "./components/Sidebar";

export default function App() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Connected to:</div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>{BACKEND}</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container">
        <main className="main-column">
          {/* Headlines section (NewsList handles heading & refresh) */}
          <section className="card">
            <NewsList />
          </section>

          {/* Ad section */}
          <div className="card ad">Advertisement Space</div>

          {/* Ask section */}
          <section className="card">
            <h3 style={{ marginTop: 0 }}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          {/* Footer */}
          <div className="footer">
            © 2025 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
