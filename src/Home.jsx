import React, { useEffect, useState } from "react";
import NewsCard from "./components/NewsCard";
import "./Home.css";

function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=42ebb195d46947619293bf93d924205f`
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.articles));
  }, []);

  return (
    <div className="home">
      <h1>Top Headlines</h1>
      <div className="news-grid">
        {articles.map((a, i) => (
          <NewsCard key={i} article={a} />
        ))}
      </div>
    </div>
  );
}

export default Home;
