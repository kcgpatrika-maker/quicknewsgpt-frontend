import React, { useEffect, useState } from "react";
import NewsList from "./components/NewsList";
import AskNews from "./components/AskNews";
import Sidebar from "./components/Sidebar";

export default function App(){
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  useEffect(()=>{
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/news`);
        const data = await res.json();
        const items = data.news || data.samples || [];
        setNews(items.slice(0, 20));
      } catch(err){
        console.error("Error fetching news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const id = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">Quick NewsGPT</div>
          <div className="tagline">Latest India news — हिंदी + English</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#6b7280",fontSize:12}}>Connected to:</div>
          <div style={{fontSize:13, color:"#0f172a"}}>{BACKEND}</div>
        </div>
      </div>

      <div className="container">
        <main className="main-column">
          <section className="card">
            <h2 style={{marginTop:0}}>Latest Headlines</h2>
            {loading ? <p style={{color:"#6b7280"}}>Loading latest news...</p> :
              <NewsList items={news.slice(0,3)} />
            }
          </section>

          <div className="card ad">Advertisement Space</div>

          <section className="card">
            <h3 style={{marginTop:0}}>क्विक न्यूज़ GPT से पूछें</h3>
            <AskNews />
          </section>

          <div className="footer">© 2025 Quick NewsGPT — Built by Kailash Gautam · Made in India 🇮🇳</div>
        </main>

        <aside className="sidebar"><Sidebar news={news} /></aside>
      </div>
    </div>
  );
}
