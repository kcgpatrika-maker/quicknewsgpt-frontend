import React, { useEffect, useState, useCallback } from "react";
import NewsList from "./components/NewsList";
import AskNews from "./components/AskNews";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://quick-newsgpt-backend.onrender.com";

export default function App() {
  const [international, setInternational] = useState([]);
  const [india, setIndia] = useState([]);
  const [rajasthan, setRajasthan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const [intRes, inRes, rajRes] = await Promise.all([
        fetch(`${BACKEND}/headline/international`),
        fetch(`${BACKEND}/headline/india`),
        fetch(`${BACKEND}/headline/rajasthan`)
      ]);
      setInternational(await intRes.json());
      setIndia(await inRes.json());
      setRajasthan(await rajRes.json());
    } catch (err) {
      console.error("Fetch news error:", err);
      setInternational([]);
      setIndia([]);
      setRajasthan([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1>Quick NewsGPT</h1>
          <div>Your Quick Gateway to Quick News</div>
        </div>
      </header>

      <section style={{ marginBottom: 16 }}>
        <h2>🌍 International</h2>
        <NewsList items={loading ? [] : international} />
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2>🇮🇳 India</h2>
        <NewsList items={loading ? [] : india} />
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2>🏜️ Rajasthan / State</h2>
        <NewsList items={loading ? [] : rajasthan} />
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>क्विक न्यूज़ GPT से पूछें</h2>
        <AskNews />
      </section>
    </div>
  );
}
