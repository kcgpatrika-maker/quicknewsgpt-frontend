import React from "react";

const Sidebar = () => {
  const siteLink = (import.meta.env.VITE_PUBLIC_SITE || "https://quicknewsgpt-frontend.vercel.app") || window.location.origin;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(siteLink).then(() => alert("✅ Link copied to clipboard!"));
    } else {
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
        await navigator.share({ title: "Quick News GPT", text: "Check QuickNewsGPT — AI summaries of latest news", url: siteLink });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      alert("Sharing not supported on this device. Please copy the link.");
    }
  };

  return (
    <div className="card about">
        <div className="side-title" style={{ fontWeight: 700 }}>About</div>
        <p style={{ marginTop: 8 }}>
          QuickNewsGPT delivers instant AI-summaries of latest headlines in Hindi & English.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
