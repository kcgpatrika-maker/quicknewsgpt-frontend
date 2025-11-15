// src/components/NewsList.jsx
import React from "react";

const INTERNATIONAL_KEYWORDS = [
  "world", "international", "us", "united states", "usa", "america", "uk",
  "united kingdom", "britain", "british", "china", "russia", "pakistan",
  "afghanistan", "nepal", "uae", "un", "europe", "germany", "france", "japan",
  "canada", "australia", "israel"
];

const INDIA_KEYWORDS = [
  "india", "bharat", "modi", "bjp", "congress", "lok sabha", "vidhan sabha",
  "prime minister", "pm", "president", "union", "delhi", "rajya", "parliament",
  "election", "चुनाव", "प्रधानमंत्री", "सरकार", "सरकारी"
];

// Indian states list (abbreviated names + common city names for robustness)
const INDIAN_STATES = [
  "rajasthan","rajasthan", "bihar","uttar pradesh","maharashtra","up","mp",
  "madhya pradesh","karnataka","tamil nadu","telangana","gujarat","punjab",
  "haryana","assam","odisha","kerala","west bengal","jharkhand","chhattisgarh",
  "uttarakhand","goa","manipur","meghalaya","mizoram","nagaland","tripura",
  "sikkim","arunachal pradesh","andhra pradesh","andaman","nicobar"
];

// Rajasthan specific city keywords to help detection
const RAJASTHAN_KEYWORDS = ["rajasthan","jaipur","jaipur","jodhpur","udaipur","ajmer","bikaner","jaisalmer","barmer","alwar","sikar","pali"];

function textContainsAny(text = "", keywords = []) {
  if (!text) return false;
  const t = text.toLowerCase();
  return keywords.some(k => t.includes(k.toLowerCase()));
}

function detectCategory(item) {
  const txt = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`.toLowerCase();

  // 1) Rajasthan explicit
  if (textContainsAny(txt, RAJASTHAN_KEYWORDS)) return "rajasthan";

  // 2) International
  if (textContainsAny(txt, INTERNATIONAL_KEYWORDS)) return "world";

  // 3) India / National
  if (textContainsAny(txt, INDIA_KEYWORDS)) return "india";

  // 4) Other Indian State (check state names)
  if (textContainsAny(txt, INDIAN_STATES)) return "state";

  // 5) fallback general
  return "general";
}

function badgeLabel(cat) {
  switch ((cat || "").toLowerCase()) {
    case "world":
    case "international":
      return "World";
    case "india":
    case "national":
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
 * Select top-3 headlines according to your rules:
 * 1) First: International (world). If none, fallback -> India.
 * 2) Second: India. If none, fallback -> any State.
 * 3) Third: Rajasthan. If none, fallback -> any State. If still none, any remaining.
 */
function selectTopThree(originalItems = []) {
  const items = Array.isArray(originalItems) ? originalItems.slice() : [];

  // Attach detected category
  const processed = items.map((it, idx) => ({
    ...it,
    __detectedCategory: detectCategory(it),
    __idx: idx,
  }));

  const picked = [];
  const pick = (predicate) => {
    const found = processed.find(p => !picked.includes(p) && predicate(p));
    if (found) picked.push(found);
    return found;
  };

  // 1) First headline: world -> else india
  pick(p => p.__detectedCategory === "world");
  if (picked.length === 0) pick(p => p.__detectedCategory === "india");

  // 2) Second headline: india -> else any state
  pick(p => p.__detectedCategory === "india");
  if (picked.length < 2) pick(p => p.__detectedCategory === "state");

  // 3) Third headline: rajasthan -> else any state -> else any remaining
  pick(p => p.__detectedCategory === "rajasthan");
  if (picked.length < 3) pick(p => p.__detectedCategory === "state");
  if (picked.length < 3) {
    // pick any remaining (exclude already picked)
    const anyLeft = processed.find(p => !picked.includes(p));
    if (anyLeft) picked.push(anyLeft);
  }

  // Return original-shaped items (without internal helpers), preserving order chosen
  return picked.map(p => {
    const { __detectedCategory, __idx, ...rest } = p;
    // keep detected category for UI
    return { ...rest, category: badgeLabel(__detectedCategory), _internalCategory: __detectedCategory };
  });
}

export default function NewsList({ items = [] }) {
  // fallback safety
  const news = Array.isArray(items) ? items : [];

  // If no news at all
  if (!news.length) {
    return <div className="news-item card">No news available.</div>;
  }

  // Compute top-3 using selection logic (this ensures wherever NewsList used, same rules apply)
  const top = selectTopThree(news);

  return (
    <div className="news-section">
      {top.map((item, idx) => (
        <div key={item.id || item.link || idx} className="news-item card">
          {/* Category Badge */}
          {item.category && (
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
          <div
            className="news-title"
            style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}
          >
            {item.title || item.heading || "No title"}
          </div>

          {/* Summary */}
          <div style={{ color: "#374151", fontSize: 14 }}>
            {item.summary || item.description || item.content || "No summary available."}
          </div>

          {/* Link */}
          <div style={{ marginTop: 8 }}>
            {item.link ? (
              <a
                className="read-more"
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
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
