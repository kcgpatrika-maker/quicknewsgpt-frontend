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
                      <p className="translated-summary">
                        {translatedSummary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* ===== ABOUT ===== */}

      <div className="card about">
        <div className="side-title" style={{ fontWeight: 700 }}>
          About Quick NewsGPT
        </div>

        <p style={{ marginTop: 10 }}>
          Quick NewsGPT is an independent news platform that provides readers
          with the latest national, international, business, sports and
          entertainment news collected from trusted public news sources.
        </p>

        <p>
          The website also publishes original articles under
          <strong> "गौतम की कलम से"</strong>, offering useful information,
          opinions and editorial content prepared especially for Quick NewsGPT.
        </p>

        <p>
          Our goal is to present reliable information in a simple,
          reader-friendly and easy-to-understand format.
        </p>
      </div>

      {/* ===== Trending ===== */}

      <div className="card">
        <div className="side-title" style={{ fontWeight: 700 }}>
          Trending
        </div>

        <ul style={{ marginTop: 8 }}>
          <li>
            <a
              href="https://www.youtube.com/feed/trending"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb" }}
            >
              YouTube Trending
            </a>
          </li>

          <li>
            <a
              href="https://trends.google.com/trends/trendingsearches/daily?geo=IN"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb" }}
            >
              Google Trends India
            </a>
          </li>

        </ul>
      </div>
            {/* ===== Legal ===== */}

      <div className="card">
        <div className="side-title" style={{ fontWeight: 700 }}>
          Legal Information
        </div>

        <h3>Privacy Policy</h3>

        <p>
          Quick NewsGPT uses third-party services including Google AdSense
          and Google Analytics. These services may use cookies to improve
          user experience and display relevant advertisements.
        </p>

        <p>
          We do not collect personally identifiable information directly
          from our visitors.
        </p>

        <h3>Terms of Service</h3>

        <p>
          By using Quick NewsGPT, you agree to use this website only for
          lawful purposes.
        </p>

        <p>
          News collected from external public sources belongs to their
          respective publishers.
        </p>

        <p>
          Original articles published under
          <strong> "गौतम की कलम से"</strong> are the editorial content of
          Quick NewsGPT.
        </p>

        <h3>Contact Us</h3>

        <p>
          We welcome corrections, feedback and suggestions from our readers.
        </p>

        <p>
          Email:
          {" "}
          <a href="mailto:quicknewsgpt@gmail.com">
            quicknewsgpt@gmail.com
          </a>
        </p>

      </div>

    </aside>
  );
};

export default Sidebar;
