import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import c from "./AuthPage.module.scss";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await axios.post(
          "https://server-production-45af.up.railway.app/api/user/login",
          {
            name,
            password,
          }
        );
        const { token } = response.data;
        localStorage.setItem("token", token);
        alert("Login successful!");
        navigate("/");
      } else {
        if (!email) {
          setError("Email is required for registration.");
          setIsLoading(false);
          return;
        }
        response = await axios.post(
          "https://server-production-45af.up.railway.app/api/user/register",
          {
            name,
            email,
            password,
            role: "USER",
          }
        );
        alert("Registration successful! Please log in.");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(
        "Authentication error:",
        err.response ? err.response.data : err.message
      );
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={c.authPage}>
      {isLoading && (
        <div className={c.loaderOverlay}>
          <div className={c.loader}></div>
        </div>
      )}

      <div className={c.authContainer}>
        <h3 className={c.authTitle}>
          {isLogin ? "Welcome Back!" : "Join Belle Aura"}
        </h3>
        <form onSubmit={handleSubmit} className={c.authForm}>
          {error && <p className={c.errorMessage}>{error}</p>}

          <div className={c.inputGroup}>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your username"
              required
              className={c.authInput}
            />
          </div>

          {!isLogin && (
            <div className={c.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required={!isLogin}
                className={c.authInput}
              />
            </div>
          )}

          <div className={c.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={c.authInput}
            />
          </div>

          <button type="submit" className={c.authButton} disabled={isLoading}>
            {isLogin ? "Log In" : "Register"}
          </button>
        </form>

        <div className={c.switchForm}>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setName("");
                setEmail("");
                setPassword("");
              }}
              className={c.switchButton}
            >
              {isLogin ? "Register here" : "Log In here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
