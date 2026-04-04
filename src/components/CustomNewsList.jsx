import React from "react";

export default function CustomNewsList({ items = [], onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <div>कोई खबर नहीं</div>;
  }

  return (
    <div>
      {items.map((r, i) => (
        <div key={r.id || i} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: "bold" }}>{r.title}</div>

          {r.summary && <div>{r.summary}</div>}

          {/* 👇 Delete अब हमेशा दिखेगा */}
          <div key={r.id} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: "bold" }}>{r.title}</div>
            
            {r.summary && (
              <>
               <button onClick={() => alert(r.summary)}>   
                पूरा पढ़ें
               </button>
              </>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
