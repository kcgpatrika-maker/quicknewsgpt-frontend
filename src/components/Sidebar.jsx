import React, { useEffect, useState } from "react";

const Sidebar = ({ topItems = [] }) => {
  const [englishHeads, setEnglishHeads] = useState([]);

  // Simple inline translator using free browser API (no keys needed)
  const translateText = async (text) => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=hi|en`
      );
      const data = await res.json();
      return data?.responseData?.translatedText || text;
    } catch {
      return text;
    }
  };

  // Translate the incoming 3 headlines
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
    <aside>
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
                cursor: "default",
                fontSize: 14,
              }}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* ==== ABOUT Section ==== */}
      <div className="card about" style={{ marginTop: 12 }}>
        <div className="side-title" style={{ fontWeight: 700 }}>About</div>
        <p style={{ marginTop: 8 }}>
          QuickNewsGPT delivers instant AI-summaries of latest headlines in Hindi & English.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
