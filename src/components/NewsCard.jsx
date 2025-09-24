import React from "react";
import "./NewsCard.css";

function NewsCard({ article }) {
  return (
    <div className="news-card">
      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} />
      )}
      <div className="news-card-content">
        <h2>{article.title}</h2>
        <p>{article.description}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          Read More
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
