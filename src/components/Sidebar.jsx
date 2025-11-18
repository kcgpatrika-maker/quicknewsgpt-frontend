// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

const toLower = (s) => (s || "").toLowerCase();

const KEYWORDS = {
  international: [
    "world","international","foreign","us","u.s.","usa","america","united states",
    "china","russia","pakistan","bangladesh","global","europe","uk","britain","brazil","mexico","tanzania"
  ],
  india: [
    "india","bharat","delhi","mumbai","bangalore","bengaluru","chennai","kolkata","modi",
    "parliament","भारत","दिल्ली","मुंबई","बेंगलुरु","कोलकाता"
  ],
  rajasthan: [
    "rajasthan","जयपुर","jaipur","jodhpur","udaipur","udaypur","ajmer",
    "bikaner","jaisalmer","alwar","sikar"
  ]
};

function textHasAny(text = "", arr = []) {
  const t = toLower(text || "");
  return arr.some(k => {
    if (!k) return false;
    return t.includes(k.toLowerCase());
  });
}

function detectCategoryForItem(item = {}) {
  const txt = `${item.title || ""} ${item.summary || item.description || ""} ${item.content || ""}`.trim();
  if (textHasAny(txt, KEYWORDS.rajasthan)) return "rajasthan";
  if (textHasAny(txt, KEYWORDS.international)) return "international";
  if (textHasAny(txt, KEYWORDS.india)) return "india";
  return "general";
}

function pickTopByCategory(items = []) {
  const processed = (Array.isArray(items) ? items : []).map((it, idx) => ({ ...it, __cat: detectCategoryForItem(it), __i: idx }));
  const result = { international: null, india: null, rajasthan: null };

  for (const p of processed) {
    if (!result.international && p.__cat === "international") result.international = p;
    if (!result.india && p.__cat === "india") result.india = p;
    if (!result.rajasthan && p.__cat === "rajasthan") result.rajasthan = p;
    if (result.international && result.india && result.rajasthan) break;
  }

  // fallback: pick any if specific not found
  const remaining = processed.filter(p => ![result.international?.__i, result.india?.__i, result.rajasthan?.__i].includes(p.__i));
  if (!result.international && remaining.length) result.international = remaining.shift();
  if (!result.india && remaining.length) result.india = remaining.shift();
  if (!result.rajasthan && remaining.length) result.rajasthan = remaining.shift();

  // Normalize to simple shape
  const norm = {};
  Object.keys(result).forEach(k => {
    const v = result[k];
    if (!v) norm[k] = null;
    else {
      const { __cat, __i, ...rest } = v;
      norm[k] = { ...rest, _detected: __cat };
    }
  });
  return norm;
}

export default function Sidebar(props = {}) {
  // props optional shortcuts (App.jsx can pass these)
  const { topInternational = null, topIndia = null, topState = null } = props;

  const [headlines, setHeadlines] = useState({
    international: topInternational,
    india: topIndia,
    rajasthan: topState
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if props provided, use them
    if (topInternational || topIndia || topState) {
      setHeadlines({
        international: topInternational,
        india: topIndia,
        rajasthan: topState
      });
      return;
    }

    // otherwise fetch once from backend and pick top headlines
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/news`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        const items = data?.news || data?.items || data?.samples || [];
        const picked = pickTopByCategory(items);
        if (mounted) setHeadlines({
          international: picked.international,
          india: picked.india,
          rajasthan: picked.rajasthan
        });
      } catch (err) {
        // silent fail (sidebar is non-critical)
        // eslint-disable-next-line no-console
        console.log("Sidebar fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    return () => { mounted = false; };
  }, [topInternational, topIndia, topState]);

  const short = (s = "", n = 80) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  const scrollToCategory = (catLabel) => {
    // Try to find .fixed-cat that contains category text (robust to emoji)
    try {
      const nodes = Array.from(document.querySelectorAll(".fixed-cat"));
      const node = nodes.find(nd => {
        const txt = (nd.textContent || "").toLowerCase();
        return txt.includes(catLabel.toLowerCase()) ||
               (catLabel.toLowerCase() === "international" && txt.includes("🌍")) ||
               (catLabel.toLowerCase() === "rajasthan" && txt.includes("राजस्थान"));
      });
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        // optional visual flash
        node.style.transition = "box-shadow 0.3s ease";
        const prev = node.style.boxShadow;
        node.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
        setTimeout(() => { node.style.boxShadow = prev || ""; }, 900);
      } else {
        // fallback: top of main
        const main = document.querySelector(".main-column") || document.querySelector("main");
        if (main) main.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <aside>
      {/* TOP: English Headlines card */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Top English Headlines</div>

        {loading ? (
          <div style={{ color: "#6b7280" }}>Loading...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              onClick={() => scrollToCategory("International")}
              style={{ cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: "#fafafa" }}
              title={headlines.international?.title || "Go to International section"}
            >
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>🌍 International</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {headlines.international?.title ? short(headlines.international.title, 80) : "No headline"}
              </div>
            </div>

            <div
              onClick={() => scrollToCategory("India")}
              style={{ cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: "#fafafa" }}
              title={headlines.india?.title || "Go to India section"}
            >
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>🇮🇳 India</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {headlines.india?.title ? short(headlines.india.title, 80) : "No headline"}
              </div>
            </div>

            <div
              onClick={() => scrollToCategory("Rajasthan")}
              style={{ cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: "#fafafa" }}
              title={headlines.rajasthan?.title || "Go to Rajasthan / State section"}
            >
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>🏜️ Rajasthan / State</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {headlines.rajasthan?.title ? short(headlines.rajasthan.title, 80) : "No headline"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About card */}
      <div className="card about">
        <div className="side-title" style={{ fontWeight: 700 }}>About</div>
        <p style={{ marginTop: 8 }}>
          QuickNewsGPT delivers instant AI-summaries of latest headlines in Hindi & English.
        </p>
      </div>
    </aside>
  );
}
