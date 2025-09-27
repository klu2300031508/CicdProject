import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import DarkModeToggle from "./components/DarkModeToggle";
import Landing from "./Landing";
import Home from "./Home";
import Category from "./Category";
import Favorites from "./Favorites";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <DarkModeToggle />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
