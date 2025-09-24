import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsCard from "./components/NewsCard";
import "./Category.css";

function Category() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=42ebb195d46947619293bf93d924205f`
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.articles));
  }, [category]);

  return (
    <div className="category">
      <h1>{category.toUpperCase()} News</h1>
      <div className="news-grid">
        {articles.map((a, i) => (
          <NewsCard key={i} article={a} />
        ))}
      </div>
    </div>
  );
}

export default Category;
