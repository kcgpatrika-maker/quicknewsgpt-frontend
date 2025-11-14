import React, { useEffect, useState } from "react";

/**
 * NewsList.jsx
 * - Fetches /news from backend (or uses fallback)
 * - Categorizes items (foreign / india / state)
 * - Shows exactly top 3 headlines: 1 foreign, 1 india, 1 state (fills from top items if missing)
 * - Displays a small blue category tag above each headline
 */

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Normalize backend response to array
  const normalize = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.news && Array.isArray(data.news)) return data.news;
    if (data.samples && Array.isArray(data.samples)) return data.samples;
    if (data.items && Array.isArray(data.items)) return data.items;
    for (const k of Object.keys(data)) {
      if (Array.isArray(data[k])) return data[k];
    }
    return [];
  };

  // Lightweight category detection
  const detectCategory = (title = "", desc = "") => {
    const text = `${title} ${desc}`.toLowerCase();

    // state keywords (focused on Rajasthan but can extend)
    const stateKeywords = [
      "rajasthan", "jaipur", "udaipur", "jodhpur", "kota", "bikaner", "ajmer",
    ];

    // india keywords
    const indiaKeywords = [
      "india", "indian", "delhi", "mumbai", "kolkata", "bengaluru", "bangalore",
      "chennai", "pune", "hyderabad",
    ];

    // foreign keywords
    const foreignKeywords = [
      "us", "usa", "america", "uk", "china", "russia", "pakistan", "canada",
      "japan", "france", "germany", "sri lanka", "bangladesh",
    ];

    if (stateKeywords.some(k => text.includes(k))) return "state";
    if (indiaKeywords.some(k => text.includes(k))) return "india";
    if (foreignKeywords.some(k => text.includes(k))) return "foreign";

    // fallback heuristic: if contains country names other than India → foreign
    const countryHints = ["u.s.", "united states", "britain", "australia", "brazil"];
    if (countryHints.some(k => text.includes(k))) return "foreign";

    // default to india if mentions common India markers
    if (text.includes("pm ") || text.includes("govt") || text.includes("cabinet")) return "india";

    // final fallback → foreign (so we show variety)
    return "foreign";
  };

  // Map category to display label (blue tag)
  const categoryLabel = (cat) => {
    if (!cat) return "";
    if (cat === "foreign") return "🌍 Foreign News";
    if (cat === "india") return "🇮🇳 India News";
    if (cat === "state") return "📍 Rajasthan / State News";
    return cat;
  };

  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/news`);
      const data = await res.json();
      const arr = normalize(data);

      // Tag each item with detected category
      const tagged = arr.map((item) => ({
        ...item,
        _cat: detectCategory(item.title || "", item.summary || item.description || ""),
      }));

      // pick 1 from each category
      const foreign = tagged.find((t) => t._cat === "foreign");
      const india = tagged.find((t) => t._cat === "india");
      const state = tagged.find((t) => t._cat === "state");

      let final = [foreign, india, state].filter(Boolean);

      // Fill up to 3 if any missing using top tagged items (avoid duplicates)
      if (final.length < 3) {
        const used = new Set(final.map((f) => f && (f.link || f.title)));
        for (const t of tagged) {
          const key = t && (t.link || t.title);
          if (!key) continue;
          if (!used.has(key)) {
            final.push(t);
            used.add(key);
          }
          if (final.length >= 3) break;
        }
      }

      setNews(final.slice(0, 3));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("News fetch error:", err);
      setNews([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 350);
    }
  };

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 60 * 1000); // refresh every 60s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="news-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title" style={{ margin: 0 }}>Latest Headlines</h2>

        <div className="refresh-info" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {lastUpdated && <div style={{ fontSize: 13, color: "#475569" }}>Updated {lastUpdated}</div>}
          <button
            onClick={fetchNews}
            title="Refresh now"
            className="refresh-btn"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
          >
            <span className={isRefreshing ? "refresh-spin refresh-icon" : "refresh-idle refresh-icon"}>🔄</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="news-item card">Loading latest news...</div>
      ) : news.length === 0 ? (
        <div className="news-item card">No news available.</div>
      ) : (
        news.map((item, idx) => (
          <div key={item.id || item.link || idx} className="news-item card" style={{ marginBottom: 12 }}>
            {/* Blue category tag */}
            <div style={{
              display: "inline-block",
              backgroundColor: "#e6f0ff",
              color: "#2563eb",
              fontSize: 12,
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: 8,
              marginBottom: 8
            }}>
              {categoryLabel(item._cat)}
            </div>

            <div className="news-title" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              {item.title || item.heading || "No title"}
            </div>

            <div style={{ color: "#374151", fontSize: 14, lineHeight: 1.45 }}>
              {item.summary || item.description || item.content || "No summary available."}
            </div>

            <div style={{ marginTop: 10 }}>
              {item.link ? (
                <a className="read-more" href={item.link} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                  Read Full Story
                </a>
              ) : (
                <span className="read-more" style={{ color: "#2563eb" }}>Read Full Story</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsList;
