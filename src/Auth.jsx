
import React, { useState } from "react";
import { supabase } from "./supabase";

export default function Auth({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (register) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });

      if (error) setMessage(error.message);
      else setMessage("Регистрация отправлена! Проверь почту.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) setMessage(error.message);
    }
  }

  if (loading) return <p style={{color:"white"}}>Загрузка...</p>;
  if (session) return children;

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    background: "#292933",
    color: "#ffffff",
    border: "1px solid #414154",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none"
  };

  const buttonStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    background: "linear-gradient(135deg, #9b6cff, #7138db)",
    color: "#ffffff",
    border: "0",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    appearance: "none"
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#101014",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "380px",
        display: "grid",
        gap: "15px",
        padding: "28px",
        boxSizing: "border-box",
        background: "#1d1d25",
        border: "1px solid #333342",
        borderRadius: "18px"
      }}>
        <h1 style={{margin: 0}}>
          NoCens<span style={{color:"#a77aff"}}>Muz</span>
        </h1>

        <h2>{register ? "Создать аккаунт" : "Вход"}</h2>

        {register && (
          <input
            style={inputStyle}
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        )}

        <input
          style={inputStyle}
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Пароль (минимум 6 символов)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit" style={buttonStyle}>
          {register ? "Зарегистрироваться" : "Войти"}
        </button>

        {message && (
          <p style={{color:"#c4a5ff", fontSize:"14px"}}>
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setRegister(!register);
            setMessage("");
          }}
          style={{
            ...buttonStyle,
            background: "#292433",
            color: "#c4a5ff",
            fontSize: "14px",
            fontWeight: "normal"
          }}
        >
          {register
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}
