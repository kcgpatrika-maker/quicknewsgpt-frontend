// src/App.jsx
import "./App.css";
import React, { useEffect, useState, useCallback } from "react";
import AskNews from "./components/AskNews";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import GoldSilver from "./components/GoldSilver";
import LiveTV from "./components/LiveTV";
import WikipediaSearch from "./components/WikipediaSearch";
import CustomNewsAdmin from "./components/CustomNewsAdmin";
import CustomNewsList from "./components/CustomNewsList";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

export default function App() {
  console.log(window.firebase);
  const db = window.db;
  const [allNews, setAllNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [customNews, setCustomNews] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
  const db = window.db;
  db.collection("news").get().then(snapshot => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCustomNews(items);
    setLoading(false);
  }).catch(err => {
    setError(err.message);
    setLoading(false);
  });
}, []);

const fetchNews = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    // 🔹 बैकएंड से RSS/News लोड करना
    const res = await fetch(`${BACKEND}/news`);
    const data = await res.json();
    const grouped = data?.news || {};

    setAllNews(grouped);
    setLastUpdated(new Date());

    // ❌ यहां से customNews लोड करने की ज़रूरत नहीं
    // Firebase useEffect अलग से customNews को भरेगा
  } catch (err) {
    console.error("fetchNews error:", err);
    setError("Failed to load news.");
    setAllNews({});
    setLastUpdated(null);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchNews]);

  const timeString = lastUpdated ? lastUpdated.toLocaleTimeString() : "";

  return (
    <div>
      {window.location.pathname === "/privacy" ? (
        <PrivacyPolicy />
      ) : (
        <>
          {/* HEADER */}
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="title">Quick NewsGPT</div>
              {/* Punch line font बड़ा और एक लाइन में */}
              <div className="tagline" style={{ fontSize: "18px", fontWeight: 500 }}>
                Quick Gateway to Quick News
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {/* सिर्फ़ Share Button */}
              <button
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: "Quick NewsGPT", text: "Latest news from Quick NewsGPT", url });
                    } catch (err) {
                      console.error("Share failed:", err);
                    }
                  } else {
                    await navigator.clipboard.writeText(url);
                    alert("Link copied!");
                  }
                }}
                style={{ border: "none", background: "#059669", color: "white", padding: "6px 8px", borderRadius: 6 }}
              >
                📤 Share
              </button>
            </div>
          </div>

          {/* MAIN */}
          <div className="container">
            <main className="main-column">
              {/* Latest Headlines */}
              <section className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ margin: 0 }}>Latest Headlines</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Refresh हटाकर Updated time दिखाएँ */}
                    <div style={{ fontSize: 13, color: "#6b7280" }}>
                      {timeString ? `Updated ${timeString}` : ""}
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div>Loading...</div>
                ) : (
                  Object.keys(allNews).map(cat => (
                    <div key={cat} style={{ marginTop: 12 }}>
                      {/* Category headings अब सिर्फ़ colored text */}
                      <div className={`fixed-cat ${cat}`}>
                        {cat === "Rajasthan" ? "Rajasthan / States" : cat}
                      </div>
                      <NewsList items={allNews[cat]} hideBadge={true} />
                    </div>
                  ))
                )}
              </section>

              {/* Ask Section */}
              <section className="card" style={{ marginTop: 4 }}>
                <h3>🌐 अन्य खबरों के लिए सर्च करें</h3>
                <AskNews />
              </section>

<section className="kalam-card">
  <h3>
    गौतम की कलम से{" "}
    <CustomNewsAdmin
      onAdd={(headline, summary) => {
        const db = window.db;
        db.collection("news").add({
          title: headline,
          summary: summary,
          pubDate: new Date().toISOString().split("T")[0]
        }).then(() => {
          // ✅ बिना reload के state अपडेट
          db.collection("news").get().then(snapshot => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCustomNews(items);
          });
        });
      }}
      onEdit={(id, headline, summary) => {
        const db = window.db;
        db.collection("news").doc(id).update({
          title: headline,
          summary: summary
        }).then(() => {
          db.collection("news").get().then(snapshot => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCustomNews(items);
          });
        });
      }}
      onDelete={(id) => {
        const db = window.db;
        db.collection("news").doc(id).delete().then(() => {
          db.collection("news").get().then(snapshot => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCustomNews(items);
          });
        });
      }}
      setAuthenticated={setIsAdmin}
    />
  </h3>

  <CustomNewsList
    items={customNews}
    authenticated={isAdmin}
    onEdit={(id, headline, summary) => {
      const db = window.db;
      db.collection("news").doc(id).update({
        title: headline,
        summary: summary
      }).then(() => {
        db.collection("news").get().then(snapshot => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCustomNews(items);
        });
      });
    }}
    onDelete={(id) => {
      const db = window.db;
      db.collection("news").doc(id).delete().then(() => {
        db.collection("news").get().then(snapshot => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCustomNews(items);
        });
      });
    }}
  />
</section>
              
{/* Gold-Silver Rates */}
<section className="card goldsilver-card" style={{ marginTop: 4 }}>
  <GoldSilver />
</section>
              
              {/* Live TV */}
              <section className="card" style={{ marginTop: 4 }}>
                <h3>📺 Live TV</h3>
                <LiveTV />
              </section>
              {/* सबकुछ बताएगा विकीपीडिया */}
      <section className="card" style={{ marginTop: 4 }}>
        <h3>📖 सब कुछ बताएगा विकिपीडिया</h3>
        <WikipediaSearch />
      </section>

              {/* Footer */}
              <div className="footer" style={{ marginTop: 12, color: "#6b7280" }}>
                © 2026 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳
                <br />
                <a href="/privacy" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  Privacy Policy
                </a>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="sidebar">
              {/* अब पूरा allNews पास करें */}
              <Sidebar allNews={allNews} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
