import React from "react";
import "./Favourites.css";

function Favorites() {
  return (
    <div className="favorites">
      <h1>Your Favorite Articles</h1>
      <div className="favorites-empty">
        <div className="favorites-empty-icon">📰</div>
        <p className="favorites-empty-text">
          You haven't saved any articles yet. Start exploring news and add your favorites!
        </p>
      </div>
    </div>
  );
}

export default Favorites;
