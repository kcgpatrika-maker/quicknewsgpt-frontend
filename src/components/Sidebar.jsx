import React from "react";

const Sidebar = () => {
  const siteLink = "https://quicknewsgpt.vercel.app";

  // Copy Link फ़ंक्शन
  const handleCopy = () => {
    navigator.clipboard.writeText(siteLink);
    alert("✅ Link copied to clipboard!");
  };

  // Share फ़ंक्शन
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quick News GPT",
          text: "Check out this amazing AI-powered news site!",
          url: siteLink,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      alert("Sharing not supported on this device, please copy the link instead.");
    }
  };

  return (
    <div className="sidebar">
      <div className="side-title">Quick News GPT</div>

      {/* Share Section */}
      <div className="side-box">
        <div className="side-title">Share this site</div>
        <button onClick={handleCopy} className="share-btn">🔗 Copy Link</button>
        <button onClick={handleShare} className="share-btn">📤 Share</button>
      </div>

      {/* About Section */}
      <div className="side-box">
        <div className="side-title">About</div>
        <p style={{ fontSize: 13, lineHeight: "18px" }}>
          QuickNewsGPT delivers instant AI-generated summaries of trending headlines.
          Ask anything and get smart, concise updates instantly.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
