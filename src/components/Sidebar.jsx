// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";

const Sidebar = ({ topItems = [] }) => {
  const [englishHeads, setEnglishHeads] = useState([]);

  // Simple inline translator using free browser API
  const translateText = async (text) => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=hi|en`
      );
      const data = await res.json();
      return data?.responseData?.translatedText || text;
    } catch {
      return text;
    }
  };

  // Translate the incoming headlines
  useEffect(() => {
    const run = async () => {
      const translated = [];
      for (let it of topItems) {
        if (it?.title) {
          translated.push(await translateText(it.title));
        }
      }
      setEnglishHeads(translated);
    };
    run();
  }, [topItems]);

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      {/* ==== Top English Headlines Section ==== */}
      <div className="card">
        <div className="side-title" style={{ fontWeight: 700 }}>
          Top English Headlines
        </div>
        <ul style={{ marginTop: 8 }}>
          {englishHeads.map((text, idx) => (
            <li
              key={idx}
              style={{
                padding: "4px 0",
                borderBottom: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* ==== ABOUT Section ==== */}
      <div className="card about">
        <div className="side-title" style={{ fontWeight: 700 }}>About</div>
        <p style={{ marginTop: 8 }}>
          QuickNewsGPT delivers instant AI-summaries of latest headlines in Hindi & English.
        </p>
      </div>

      {/* ==== Trending Section ==== */}
      <div className="card">
        <div className="side-title" style={{ fontWeight: 700 }}>Trending</div>
        <ul style={{ marginTop: 8 }}>
          <li>
            <a href="https://www.youtube.com/feed/trending" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
              YouTube Trending
            </a>
          </li>
          <li>
            <a href="https://trends.google.com/trends/trendingsearches/daily?geo=IN" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
              Google Trends India
            </a>
          </li>
        </ul>
      </div>

      {/* ==== Legal Section ==== */}
      <div className="card">
        <div className="side-title" style={{ fontWeight: 700 }}>Legal</div>
        <ul style={{ marginTop: 8 }}>
          <li>
            <a href="/privacy" style={{ color: "#2563eb" }}>Privacy Policy</a>
          </li>
          <li>
            <a href="/terms" style={{ color: "#2563eb" }}>Terms of Service</a>
          </li>
          <li>
            <a href="/contact" style={{ color: "#2563eb" }}>Contact</a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
