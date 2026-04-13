// src/components/WikipediaSearch.jsx
import React from "react";

function WikipediaSearch() {
  return (
    <section id="wiki" className="wiki-card">
      <form
        action="https://en.wikipedia.org/wiki/Special:Search"
        method="get"
        target="_blank"
      >
        <input
          type="text"
          name="search"
          placeholder="Enter topic..."
          className="wiki-input"
        />
        <button type="submit" className="wiki-btn">
          Search
        </button>
      </form>
    </section>
  );
}

export default WikipediaSearch;
