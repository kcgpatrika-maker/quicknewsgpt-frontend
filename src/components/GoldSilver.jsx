// src/components/GoldSilver.jsx
import React from "react";

export default function GoldSilver() {
  return (
    <div className="goldsilver-card">
      <h3>💰 Gold & Silver Rates</h3>

      {/* Gold Widget */}
      <iframe
        src="https://www.goldprice.org/widget/live-gold-price.html?currency=INR"
        width="100%"
        height="120"
        frameBorder="0"
        scrolling="no"
        title="Gold Price"
      ></iframe>

      {/* Silver Widget */}
      <iframe
        src="https://www.goldprice.org/widget/live-silver-price.html?currency=INR"
        width="100%"
        height="120"
        frameBorder="0"
        scrolling="no"
        title="Silver Price"
      ></iframe>
    </div>
  );
}
