// src/components/WikipediaSearch.jsx
import React from "react";

function WikipediaSearch() {
  return (
    <section id="wiki" className="card" style={{ marginTop: 12 }}>
      <h3>Wikipedia Search</h3>
      <form
        action="https://en.wikipedia.org/wiki/Special:Search"
        method="get"
        target="_blank"
      >
        <input
          type="text"
          name="search"
          placeholder="Enter topic..."
          style={{
            padding: 6,
            width: "70%",
            border: "1px solid #d1d5db",
            borderRadius: 6,
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: "6px 12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Search
        </button>
      </form>
    </section>
  );
}

export default WikipediaSearch;
