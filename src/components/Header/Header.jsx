import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import c from "./Header.module.scss";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`${c.header} ${isScrolled ? c.scrolled : ""}`}>
      <Link to="/" className={c.logoLink}>
        <h1>Belle Aura</h1>
      </Link>
      <nav className={c.nav}>
        <ul className={c.navList}>
          <li className={c.navItem}>
            <Link to="/" className={isActive("/") ? c.active : ""}>
              Home
            </Link>
          </li>
          <li className={c.navItem}>
            <Link to="/shop" className={isActive("/shop") ? c.active : ""}>
              Shop
            </Link>
          </li>
          {isLoggedIn ? (
            <li className={c.navItem}>
              <Link
                to="/for-you"
                className={isActive("/for-you") ? c.active : ""}
              >
                For You
              </Link>
            </li>
          ) : (
            <></>
          )}
          <li className={c.navItem}>
            <Link to="/about" className={isActive("/about") ? c.active : ""}>
              About Us
            </Link>
          </li>
          <li className={c.navItem}>
            {isLoggedIn ? (
              <Link
                to="/profile"
                className={isActive("/profile") ? c.active : ""}
              >
                Profile
              </Link>
            ) : (
              <Link to="/auth" className={isActive("/auth") ? c.active : ""}>
                Log In
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
