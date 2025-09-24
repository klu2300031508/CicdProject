import React, { useEffect, useMemo, useState } from "react";
import NewsCard from "./components/NewsCard";
import "./Home.css";

function Home() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=42ebb195d46947619293bf93d924205f`
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.articles));
  }, []);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => {
      const title = a.title || "";
      const desc = a.description || "";
      const source = a.source?.name || "";
      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        source.toLowerCase().includes(q)
      );
    });
  }, [articles, query]);

  return (
    <div className="home">
      <h1>Top Headlines</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search articles, sources, keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="news-grid">
        {filteredArticles.map((a, i) => (
          <NewsCard key={i} article={a} />
        ))}
      </div>
    </div>
  );
}

export default Home;
