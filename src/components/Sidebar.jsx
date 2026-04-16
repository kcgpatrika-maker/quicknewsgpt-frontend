import React, { useState } from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import Terms from "./Terms";
import Contact from "./Contact";

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
      // दोबारा दबाने पर headlines बंद
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
          { cat: "International", label: "🌍 International News" },
          { cat: "India", label: "🇮🇳 National News" },
          { cat: "State", label: "🏛️ State News" },
          { cat: "Sports", label: "🏏 Sports News" },
          { cat: "Business", label: "💼 Business News" },
          { cat: "Entertainment", label: "🎬 Entertainment News" },
        ].map((btn) => (
          <div key={btn.cat} style={{ marginBottom: "10px" }}>
            <button
              className="category-btn"
              onClick={() => handleCategoryClick(btn.cat)}
            >
              {btn.label}
            </button>

            {/* Headlines under the same button */}
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

      {/* Other Sidebar Sections */}
      <div className="card">
        <h2 className="side-title">About</h2>
        <p>QuickNewsGPT — AI powered news summaries and live updates.</p>
      </div>

      <div className="card">
        <h2 className="side-title">Trending</h2>
        <p>Latest hot topics and breaking stories.</p>
      </div>

      <div className="card">
        <h2 className="side-title">Legal</h2>
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
