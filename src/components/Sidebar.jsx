import React from "react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="side-title">Quick Info</h2>

      <div className="side-card">
        <p><strong>About:</strong> Quick NewsGPT gives you latest AI-generated headlines from India & world.</p>
      </div>

      <div className="side-card">
        <h3>Links</h3>
        <p>
          <a href={import.meta.env.VITE_BACKEND_URL} target="_blank" rel="noreferrer">
            Backend API
          </a>
          <br />
          <a href="https://github.com/kcgpatrika-maker/quicknewsgpt-frontend" target="_blank" rel="noreferrer">
            Frontend Repo
          </a>
        </p>
      </div>

      <div className="footer">
        © 2025 Quick NewsGPT <br /> Built by Kailash Gautam
      </div>
    </div>
  );
};

export default Sidebar;
