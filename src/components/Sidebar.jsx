import React, { useState } from "react";

const Sidebar = ({ allNews }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [translatedHeads, setTranslatedHeads] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [translatedSummary, setTranslatedSummary] = useState("");

  // Translation function (headline/summary)
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

  // Handle category button click
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setOpenId(null);
    setTranslatedSummary("");
    const items = allNews[category] || [];
    const translated = [];
    for (let it of items) {
      if (it?.title) {
        translated.push({ id: it.id, title: await translateText(it.title), summary: it.summary });
      }
    }
    setTranslatedHeads(translated);
  };

  // Handle "पूरा पढ़ें" click
  const handleReadMore = async (item) => {
    if (openId === item.id) {
      setOpenId(null);
      setTranslatedSummary("");
    } else {
      setOpenId(item.id);
      setTranslatedSummary(await translateText(item.summary));
    }
  };

  return (
    <aside>
      <div className="card">
        <div className="side-title">Top English Headlines</div>

        {/* Category Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
          {["International","India","State","Sports","Business","Entertainment"].map((cat) => (
            <button key={cat} onClick={() => handleCategoryClick(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Translated Headlines */}
        <ul style={{ marginTop: 12 }}>
          {translatedHeads.map((item) => (
            <li key={item.id} style={{ marginBottom: 8 }}>
              <strong>{item.title}</strong>
              <span
                style={{ color: "blue", cursor: "pointer", marginLeft: 8 }}
                onClick={() => handleReadMore(item)}
              >
                पूरा पढ़ें
              </span>
              {openId === item.id && (
                <p style={{ marginTop: 6 }}>{translatedSummary}</p>
              )}
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
