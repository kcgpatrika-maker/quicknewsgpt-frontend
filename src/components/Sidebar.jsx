import React, { useState } from "react";

const Sidebar = ({ allNews }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [translatedHeads, setTranslatedHeads] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [translatedSummary, setTranslatedSummary] = useState("");

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

  const handleCategoryClick = async (category) => {
    if (openCategory === category) {
      setOpenCategory(null);
      setTranslatedHeads([]);
      return;
    }
    setOpenCategory(category);
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
{[
  { cat: "International", emoji: "🌍", text: "International News" },
  { cat: "India", emoji: "🇮🇳", text: "National News" },
  { cat: "Rajasthan", emoji: "🏛️", text: "Rajasthan News" },
  { cat: "Sports", emoji: "🏏", text: "Sports News" },
  { cat: "Business", emoji: "💼", text: "Business News" },
  { cat: "Entertainment", emoji: "🎬", text: "Entertainment News" },
].map((btn) => (
  <div key={btn.cat} style={{ marginBottom: "8px" }}>
    <button
      className="category-btn"
      onClick={() => handleCategoryClick(btn.cat)}
    >
      {btn.emoji} {btn.text}
    </button>

    {openCategory === btn.cat && (
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
    )}
  </div>
))}
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

      <div className="card">
        <h2 className="side-title">Legal</h2>
        <h3>Privacy Policy</h3>
        <p>
          This website uses Google AdSense advertising services. Google may use cookies to serve personalized ads.  
          We do not collect personal data directly. For queries, contact:  
          <a href="mailto:quicknewsgpt@gmail.com">quicknewsgpt@gmail.com</a>
        </p>

        <h3>Terms of Service</h3>
        <p>
          These are placeholder terms. A detailed Terms of Service page will be added soon.
        </p>

        <h3>Contact</h3>
        <p>
          For general queries, feedback, or support, please email us at:  
          <a href="mailto:quicknewsgpt@gmail.com">quicknewsgpt@gmail.com</a>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
