import React, { useEffect, useState } from "react";

const NewsList = () => {
  const [news, setNews] = useState([]);

  // डेटा लाने का फ़ंक्शन
  const fetchNews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/news`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews(); // पहली बार डेटा लाओ

    // हर 60 सेकंड में रीफ्रेश
    const interval = setInterval(fetchNews, 60000);

    return () => clearInterval(interval); // पेज बदलने पर इंटरवल क्लियर करें
  }, []);

  return (
    <div className="news-section">
      <h2 className="section-title">Latest Headlines</h2>
      {news.length > 0 ? (
        news.map((item, index) => (
          <div key={index} className="news-card">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <button className="read-btn">Read Full Story</button>
          </div>
        ))
      ) : (
        <p>Loading headlines...</p>
      )}
    </div>
  );
};

export default NewsList;
