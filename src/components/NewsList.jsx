import React from "react";
export default function NewsList({items=[]}){
  if(!items || items.length===0) return <div>No news available.</div>;
  return (
    <div>
      {items.map((it,idx)=>(
        <article key={it.id||idx} className="card" style={{marginBottom:12}}>
          <h3 className="headline">{it.title}</h3>
          <p className="summary">{it.summary||it.description||"No description available."}</p>
          {it.link ? (
            <a className="readmore" href={it.link} target="_blank" rel="noreferrer">Read Full Story</a>
          ) : (
            <span className="readmore" style={{opacity:0.9}}>Read Full Story</span>
          )}
        </article>
      ))}
    </div>
  );
}
