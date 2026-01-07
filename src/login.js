  import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const users = [
    { email: "sule@icloud.com", password: "123" },
    { email: "serdar@icloud.com", password: "1234" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("activeUser", user.email);
      navigate("/app");
    } else {
      setError("Mail veya şifre hatalı!");
    }
  };

  return (
    <div className="login-container">
      <h1>ToDoList Giriş</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
