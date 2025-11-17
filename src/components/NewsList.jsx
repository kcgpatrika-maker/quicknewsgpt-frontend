// src/components/NewsList.jsx
import React from "react";

/**
 * NEW NewsList:
 * - bilingual (Hindi + English) keywords
 * - deterministic category detection with proper priority:
 *    1) world/international
 *    2) india/national
 *    3) rajasthan (priority)
 *    4) other Indian states
 *    5) general (fallback)
 * - selectTopThree implements your exact slot rules + safe fallbacks and ensures always up to 3 items.
 */

// keywords: small but broad lists. Add more as needed.
const INTERNATIONAL_KEYWORDS = [
  "world", "international", "foreign", "global", "us", "u.s", "united states", "usa", "america",
  "uk", "united kingdom", "britain", "china", "russia", "pakistan", "afghanistan", "nepal", "uae",
  "europe", "germany", "france", "japan", "canada", "australia", "israel", "brazil", "mexico", "tanzania"
];

const INDIA_KEYWORDS = [
  "india", "bharat", "indian", "new delhi", "delhi", "modi", "bjp", "congress", "parliament",
  "lok sabha", "vidhan sabha", "election", "चुनाव", "प्रधानमंत्री", "सरकार", "भारत", "दिल्ली", "मुंबई"
];

const RAJASTHAN_KEYWORDS = [
  "rajasthan","राजस्थान","jaipur","जयपुर","jodhpur","जोधपुर","udaipur","उदयपुर","ajmer","अजमेर",
  "bikaner","बीकानेर","jaisalmer","जैसलमेर","barmer","बारमेर","alwar","알वर","sikar","पाली","पाली"
];

const INDIAN_STATES = [
  "uttar pradesh","up","bihar","jharkhand","madhya pradesh","mp","maharashtra","karnataka","tamil nadu","tamil",
  "telangana","andhra pradesh","gujarat","punjab","haryana","assam","odisha","kerala","west bengal","kolkata",
  "goa","uttarakhand","himachal","jharkhand","jharkhand","sikkim","manipur","meghalaya","mizoram","nagaland","tripura"
];

function normalizeText(item = {}) {
  const s = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`;
  return s.toLowerCase();
}

function containsAny(text, keywords = []) {
  if (!text) return false;
  return keywords.some(k => text.includes(k.toLowerCase()));
}

function detectCategoryForItem(item) {
  const text = normalizeText(item);

  // priority: world -> india -> rajasthan -> other-state -> general
  if (containsAny(text, INTERNATIONAL_KEYWORDS)) return "world";
  if (containsAny(text, INDIA_KEYWORDS)) return "india";
  if (containsAny(text, RAJASTHAN_KEYWORDS)) return "rajasthan";
  if (containsAny(text, INDIAN_STATES)) return "state";
  return "general";
}

function prettyBadge(cat) {
  switch ((cat || "").toLowerCase()) {
    case "world": return "World";
    case "india": return "India";
    case "rajasthan": return "Rajasthan";
    case "state": return "State";
    default: return "General";
  }
}

function selectTopThree(items = []) {
  // attach detected category and stable index
  const processed = (items || []).map((it, i) => ({
    __idx: i,
    __cat: detectCategoryForItem(it),
    ...it
  }));

  const chosen = [];
  const markChosen = (p) => p && chosen.push(p);

  // 1) First: world -> else india
  markChosen(processed.find(p => p.__cat === "world" && !chosen.includes(p)));
  if (chosen.length === 0) markChosen(processed.find(p => p.__cat === "india" && !chosen.includes(p)));

  // 2) Second: india -> else any state
  markChosen(processed.find(p => p.__cat === "india" && !chosen.includes(p)));
  if (chosen.length < 2) markChosen(processed.find(p => (p.__cat === "state" || p.__cat === "rajasthan") && !chosen.includes(p)));

  // 3) Third: rajasthan -> else any state -> else any remaining
  markChosen(processed.find(p => p.__cat === "rajasthan" && !chosen.includes(p)));
  if (chosen.length < 3) markChosen(processed.find(p => p.__cat === "state" && !chosen.includes(p)));
  if (chosen.length < 3) {
    const anyLeft = processed.find(p => !chosen.includes(p));
    if (anyLeft) markChosen(anyLeft);
  }

  // Ensure up to 3 items; if fewer, fill from remaining
  if (chosen.length < 3) {
    for (const p of processed) {
      if (chosen.length >= 3) break;
      if (!chosen.includes(p)) chosen.push(p);
    }
  }

  // Map back to original shape, include category labels for UI
  return chosen.slice(0, 3).map(p => {
    const { __cat, __idx, ...rest } = p;
    return { ...rest, category: prettyBadge(__cat), _internalCategory: __cat };
  });
}

export default function NewsList({ items = [] }) {
  const news = Array.isArray(items) ? items : [];

  if (!news.length) {
    return <div className="news-item card">No news available.</div>;
  }

  const top = selectTopThree(news);

  return (
    <div className="news-section">
      {top.map((item, idx) => (
        <div key={item.id || item.link || `${idx}-${item.title?.slice(0,20)}`} className="news-item card">
          {/* Category Badge */}
          {item.category && (
            <div style={{
              display: "inline-block",
              marginBottom: 6,
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: 12,
              background: "#e0f2fe",
              color: "#0369a1",
              fontWeight: 600,
            }}>
              {item.category}
            </div>
          )}

          <div className="news-title" style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            {item.title || item.heading || "No title"}
          </div>

          <div style={{ color: "#374151", fontSize: 14 }}>
            {item.summary || item.description || item.content || "No summary available."}
          </div>

          <div style={{ marginTop: 8 }}>
            {item.link ? (
              <a className="read-more" href={item.link} target="_blank" rel="noreferrer">Read Full Story</a>
            ) : (
              <span className="read-more">Read Full Story</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
