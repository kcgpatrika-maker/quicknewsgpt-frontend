// src/components/NewsList.jsx
import React from "react";

/**
 * Improved bilingual keyword lists (English + common Hindi forms)
 * and safer word-boundary matching to avoid false positives.
 */

// --- Keywords (extend as needed) ---
const INTERNATIONAL_KEYWORDS = [
  "world","international","united states","usa","america","u.s.","us",
  "united kingdom","uk","britain","china","russia","pakistan","afghanistan",
  "nepal","uae","europe","germany","france","japan","canada","australia",
  "israel","brazil","mexico","tanzania","south africa","kenya"
  // add more country names if you want
];

const INDIA_KEYWORDS = [
  "india","bharat","indian","delhi","mumbai","kolkata","chennai","bangalore",
  "bengaluru","up","uttar pradesh","maharashtra","governor","minister","modi",
  "bjp","congress","lok sabha","rajya sabha","सरकार","प्रधानमंत्री","चुनाव","भारत",
  "दिल्ली","मुंबई","कोलकाता","बेंगलुरु","चेन्नई"
];

const RAJASTHAN_KEYWORDS = [
  "rajasthan","jaipur","jodhpur","udaipur","ajmer","bikaner","jaisalmer","barmer",
  "alwar","sikar","pali","जयपुर","जोधपुर","उदयपुर","अजमेर","बीकानेर","जैसलमेर","राजस्थान"
];

const INDIAN_STATES = [
  // core state names (english + common short forms). Add Hindi forms as needed.
  "andhra pradesh","arunachal pradesh","assam","bihar","chhattisgarh","goa",
  "gujarat","haryana","himachal pradesh","jharkhand","karnataka","kerala",
  "madhya pradesh","maharashtra","manipur","meghalaya","mizoram","nagaland",
  "odisha","punjab","rajasthan","sikkim","tamil nadu","telangana","tripura",
  "uttar pradesh","uttarakhand","west bengal","andaman","nicobar"
];

// Utility: build regex from keyword that uses word boundaries where possible.
// For Hindi tokens word boundaries may not always work the same way; keep a fallback includes.
function makeRegexForKeyword(k) {
  // escape regexp special chars
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // if keyword contains spaces (multi-word) use substring match with word boundaries at edges
  if (/\s/.test(k)) {
    return new RegExp(`\\b${esc}\\b`, "i");
  }
  return new RegExp(`\\b${esc}\\b`, "i");
}

function textMatchesAny(text = "", keywords = []) {
  if (!text) return false;
  const t = text.toString();
  for (let k of keywords) {
    const rx = makeRegexForKeyword(k);
    if (rx.test(t)) return true;
    // fallback: for languages/inputs where \b may fail (Hindi), do case-insensitive includes
    if (t.toLowerCase().includes(k.toLowerCase())) return true;
  }
  return false;
}

// Robust category detection with clear priority:
// 1) explicit Rajasthan
// 2) international (world)
// 3) India / national
// 4) other Indian state
// 5) fallback general
function detectCategory(item = {}) {
  const title = (item.title || item.heading || "").toString();
  const desc = (item.summary || item.description || item.content || "").toString();
  const text = `${title} ${desc}`.trim();

  if (!text) return "general";

  // Priority 1: Rajasthan explicit
  if (textMatchesAny(text, RAJASTHAN_KEYWORDS)) return "rajasthan";

  // Priority 2: International (world)
  if (textMatchesAny(text, INTERNATIONAL_KEYWORDS)) return "world";

  // Priority 3: India / national
  if (textMatchesAny(text, INDIA_KEYWORDS)) return "india";

  // Priority 4: Other Indian state
  if (textMatchesAny(text, INDIAN_STATES)) {
    // If it's rajasthan already returned. So this is 'state' other than rajasthan
    return "state";
  }

  // Fallback general
  return "general";
}

function badgeLabel(cat) {
  switch ((cat || "").toLowerCase()) {
    case "world":
      return "World";
    case "india":
      return "India";
    case "rajasthan":
      return "Rajasthan";
    case "state":
      return "State";
    default:
      return "General";
  }
}

/**
 * Selection rules (strict):
 * 1) First try pick an item with "world"
 *    else fallback: pick "india"
 *    else fallback: pick any remaining item
 * 2) Second pick "india"
 *    else fallback: pick any state (including rajasthan)
 *    else any remaining not yet picked
 * 3) Third pick "rajasthan"
 *    else any state
 *    else any remaining
 *
 * Always avoid duplicates and preserve reasonable ordering from original list for ties.
 */
function selectTopThree(originalItems = []) {
  const items = Array.isArray(originalItems) ? originalItems.slice() : [];

  // annotate items
  const processed = items.map((it, idx) => ({
    __origIndex: idx,
    __cat: detectCategory(it),
    ...it
  }));

  const picked = [];
  const markPicked = (p) => {
    if (p && !picked.includes(p)) picked.push(p);
  };
  const findNotPicked = (predicate) => processed.find(p => !picked.includes(p) && predicate(p));

  // 1) First: world -> india -> any remaining
  let first = findNotPicked(p => p.__cat === "world");
  if (!first) first = findNotPicked(p => p.__cat === "india");
  if (!first) first = processed.find(p => !picked.includes(p));
  markPicked(first);

  // 2) Second: india -> any state -> any remaining
  let second = findNotPicked(p => p.__cat === "india");
  if (!second) second = findNotPicked(p => p.__cat === "rajasthan" || p.__cat === "state");
  if (!second) second = processed.find(p => !picked.includes(p));
  markPicked(second);

  // 3) Third: rajasthan -> any state -> any remaining
  let third = findNotPicked(p => p.__cat === "rajasthan");
  if (!third) third = findNotPicked(p => p.__cat === "state");
  if (!third) third = processed.find(p => !picked.includes(p));
  markPicked(third);

  // Filter out undefined picks and map back to UI shape
  const final = [first, second, third].filter(Boolean).map(p => {
    const { __cat, __origIndex, ...rest } = p;
    return {
      ...rest,
      category: badgeLabel(__cat),
      _internalCategory: __cat
    };
  });

  return final;
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
        <div key={item.id || item.link || idx} className="news-item card" style={{ marginBottom: 12 }}>
          {/* Category Badge: show only if not General (optional) */}
          {item.category && item.category !== "General" && (
            <div
              style={{
                display: "inline-block",
                marginBottom: 6,
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: 12,
                background: "#e0f2fe",
                color: "#0369a1",
                fontWeight: 600,
              }}
            >
              {item.category}
            </div>
          )}

          {/* Title */}
          <div className="news-title" style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            {item.title || item.heading || "No title"}
          </div>

          {/* Summary */}
          <div style={{ color: "#374151", fontSize: 14 }}>
            {item.summary || item.description || item.content || "No summary available."}
          </div>

          {/* Link */}
          <div style={{ marginTop: 8 }}>
            {item.link ? (
              <a className="read-more" href={item.link} target="_blank" rel="noreferrer">
                Read Full Story
              </a>
            ) : (
              <span className="read-more">Read Full Story</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
