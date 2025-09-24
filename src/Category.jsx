import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import NewsCard from "./components/NewsCard";
import "./Category.css";

function Category() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=42ebb195d46947619293bf93d924205f`
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.articles));
  }, [category]);

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
    <div className="category">
      <h1>{category.toUpperCase()} News</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search in ${category}`}
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

export default Category;
