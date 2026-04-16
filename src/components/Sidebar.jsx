import React, { useState } from "react";

const Sidebar = ({ allNews }) => {
  const [translatedHeads, setTranslatedHeads] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [translatedSummary, setTranslatedSummary] = useState("");

  // Translation function
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
    setOpenId(null);
    setTranslatedSummary("");
    const items = allNews[category] || [];
    const translated = [];
    for (let it of items) {
      if (it?.title) {
        translated.push({
          id: it.id,
          title: await translateText(it.title),
          summary: it.summary,
        });
      }
    }
    setTranslatedHeads(translated);
  };

  // Handle "Read Full News" click
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
        <h2 className="side-title">Top English Headlines</h2>

        {/* Category Buttons */}
        <div className="category-buttons">
          {[
            { cat: "International", label: "🌍 International News" },
            { cat: "India", label: "🇮🇳 National News" },
            { cat: "State", label: "🏛️ State News" },
            { cat: "Sports", label: "🏏 Sports News" },
            { cat: "Business", label: "💼 Business News" },
            { cat: "Entertainment", label: "🎬 Entertainment News" },
          ].map((btn) => (
            <button key={btn.cat} onClick={() => handleCategoryClick(btn.cat)}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Translated Headlines */}
        <ul className="translated-list">
          {translatedHeads.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span
                className="read-more"
                onClick={() => handleReadMore(item)}
              >
                Read Full News
              </span>
              {openId === item.id && (
                <p className="translated-summary">{translatedSummary}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
