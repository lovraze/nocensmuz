
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
        options: {
          data: { username }
        }
      });

      if (error) setMessage(error.message);
      else setMessage("Регистрация отправлена! Проверь почту для подтверждения.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) setMessage(error.message);
    }
  }

  if (loading) return <p>Загрузка...</p>;

  if (session) return children;

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#101014",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: 20
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: 380,
        display: "grid",
        gap: 14,
        padding: 28,
        background: "#1d1d25",
        borderRadius: 16
      }}>
        <h1>NoCensMuz</h1>
        <h2>{register ? "Создать аккаунт" : "Вход"}</h2>

        {register && (
          <input
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль (минимум 6 символов)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit">
          {register ? "Зарегистрироваться" : "Войти"}
        </button>

        {message && <p>{message}</p>}

        <button
          type="button"
          onClick={() => {
            setRegister(!register);
            setMessage("");
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
