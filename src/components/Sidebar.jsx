import React from "react";

const Sidebar = () => {
  const siteLink = "https://quicknewsgpt.vercel.app";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(siteLink).then(() => {
        alert("✅ Link copied to clipboard!");
      });
    } else {
      // fallback
      const el = document.createElement("textarea");
      el.value = siteLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      alert("✅ Link copied to clipboard!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quick News GPT",
          text: "Check out QuickNewsGPT — AI summaries of latest India news.",
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
    <aside className="sidebar">
      <div className="side-box">
        <div className="side-title">Quick News GPT</div>

        <div style={{ marginTop: 8 }}>
          <div className="side-title">Share this site</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={handleCopy} className="share-btn">🔗 Copy Link</button>
            <button onClick={handleShare} className="share-btn">📤 Share</button>
          </div>
        </div>
      </div>

      <div className="side-box" style={{ marginTop: 16 }}>
        <div className="side-title">About</div>
        <p style={{ fontSize: 13, lineHeight: "18px", marginTop: 8 }}>
          QuickNewsGPT delivers instant AI-generated summaries of trending headlines.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
