import React, { useEffect, useState } from "react";
import "./DarkModeToggle.css";

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="dark-toggle">
      <label>
        <input
          type="checkbox"
          checked={dark}
          onChange={() => setDark(!dark)}
        />
        <div className="toggle-switch"></div>
        <span>{dark ? 'Light' : 'Dark'} Mode</span>
      </label>
    </div>
  );
}

export default DarkModeToggle;
