import React from "react";

const Sidebar = () => {
  return (
    <aside>

      {/* ---- REMOVED: Share section ---- */}

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
