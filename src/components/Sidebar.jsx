import React from "react";
export default function Sidebar({news=[]}){
  return (
    <div>
      <div className="side-section">
        <div className="side-title">ताज़ा सुर्खियाँ</div>
        {news && news.length>0 ? news.slice(0,6).map((n,i)=>(
          <div key={i} className="mini-item">
            <strong style={{display:"block"}}>{n.title}</strong>
            <small style={{color:"#6b7280"}}>{n.source || ""}</small>
          </div>
        )) : <div style={{color:"#6b7280"}}>No headlines.</div>}
      </div>

      <div className="side-section">
        <div className="side-title">Links</div>
        <div style={{fontSize:13,color:"#2563eb"}}><a href={import.meta.env.VITE_BACKEND_URL} target="_blank" rel="noreferrer">Backend</a></div>
        <div style={{fontSize:13,color:"#2563eb",marginTop:6}}><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></div>
      </div>

      <div className="side-section">
        <div className="side-title">States</div>
        <div style={{fontSize:13,color:"#111827"}}>Delhi</div>
        <div style={{fontSize:13,color:"#111827"}}>Karnataka</div>
        <div style={{fontSize:13,color:"#111827"}}>Maharashtra</div>
      </div>

      <div className="side-section">
        <div className="side-title">About</div>
        <div style={{color:"#6b7280",fontSize:13}}>Quick NewsGPT — free news aggregator (Hindi + English).</div>
      </div>
    </div>
  );
}
