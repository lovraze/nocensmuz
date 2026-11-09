import React, { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  Upload,
  Heart,
  Play,
  Pause,
  Music2,
  Disc3,
  Headphones,
  Plus,
  X,
  AudioLines
} from "lucide-react";
import "./style.css";
import Auth from "./Auth";

const demoTracks = [
  { id: "1", title: "Midnight Drive", artist: "NOVA", genre: "Electronic", duration: "3:42", color: "violet" },
  { id: "2", title: "Город не спит", artist: "KIRA", genre: "Hip-hop", duration: "2:58", color: "orange" },
  { id: "3", title: "Afterglow", artist: "SØL", genre: "Indie", duration: "4:16", color: "blue" },
  { id: "4", title: "No Signal", artist: "404", genre: "Electronic", duration: "3:11", color: "pink" },
  { id: "5", title: "Тише воды", artist: "MIRA", genre: "Alternative", duration: "3:35", color: "green" },
  { id: "6", title: "Neon Skies", artist: "LUX", genre: "Pop", duration: "3:07", color: "cyan" }
];

function App() {
  const [tracks, setTracks] = useState(demoTracks);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Все");
  const [favorites, setFavorites] = useState([]);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");

  const inputRef = useRef(null);
  const audioRef = useRef(null);

  const genres = [
    "Все",
    "Electronic",
    "Hip-hop",
    "Indie",
    "Alternative",
    "Pop",
    "Мои треки"
  ];

  const visible = useMemo(
    () =>
      tracks.filter(
        t =>
          (genre === "Все" || t.genre === genre) &&
          `${t.title} ${t.artist} ${t.genre}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [tracks, genre, query]
  );

  function toggleFavorite(id) {
    setFavorites(old =>
      old.includes(id)
        ? old.filter(x => x !== id)
        : [...old, id]
    );
  }

  function play(track) {
    if (!track.url) {
      setCurrent(track);
      setPlaying(false);
      setNotice(
        "Это демо-карточка. Загрузи аудиофайл, чтобы послушать его в плеере."
      );
      return;
    }

    if (current?.id === track.id && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    setCurrent(track);
    setPlaying(true);
    setNotice("");

    setTimeout(
      () => audioRef.current?.play().catch(() => setPlaying(false)),
      0
    );
  }

  function upload(files) {
    const audio = [...files].filter(file =>
      file.type.startsWith("audio/")
    );

    if (!audio.length) {
      setNotice(
        "Не нашёл аудиофайлов. Выбери MP3, WAV, OGG или другой аудиоформат."
      );
      return;
    }

    const added = audio.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      artist: "Моя загрузка",
      genre: "Мои треки",
      duration: "—",
      color: ["violet", "orange", "blue", "pink"][i % 4],
      url: URL.createObjectURL(file)
    }));

    setTracks(old => [...added, ...old]);
    setGenre("Все");
    setCurrent(added[0]);
    setPlaying(true);

    setNotice(
      `Добавлено треков: ${added.length}. Пока это локальная библиотека в текущем браузере.`
    );

    setTimeout(
      () => audioRef.current?.play().catch(() => setPlaying(false)),
      0
    );
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          <span className="brand-icon">
            <AudioLines size={21} />
          </span>
          NoCens<span className="accent">Muz</span>
        </a>

        <div className="side-label">МЕНЮ</div>

        <button className="nav active">
          <Disc3 size={18} /> Обзор
        </button>

        <button className="nav" onClick={() => setGenre("Все")}>
          <Music2 size={18} /> Каталог
        </button>

        <button className="nav" onClick={() => setGenre("Все")}>
          <Heart size={18} /> Избранное <small>{favorites.length}</small>
        </button>

        <div className="side-label library-label">ТВОЯ МУЗЫКА</div>

        <button className="nav" onClick={() => inputRef.current?.click()}>
          <Plus size={18} /> Добавить треки
        </button>

        <div className="sidebar-note">
          <div className="bars">
            <i /><i /><i /><i /><i /><i />
          </div>
          <b>Твоя музыка.<br />Твои правила.</b>
          <p>Независимая сцена начинается здесь.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand">
            <AudioLines size={20} /> NoCens<span>Muz</span>
          </div>

          <label className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Найти трек, исполнителя или жанр..."
            />
          </label>

          <button
            className="upload-top"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={16} /> Загрузить музыку
          </button>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <i /> ТВОЯ МУЗЫКА. БЕЗ ГРАНИЦ.
            </div>

            <h1>
              Звучать<br />
              <em>по-своему.</em>
            </h1>

            <p>
              Открывай новое. Поддерживай независимых артистов.
              Загружай собственные треки.
            </p>

            <button
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Исследовать каталог <span>↗</span>
            </button>
          </div>

          <div className="hero-art">
            <div className="orbit one" />
            <div className="orbit two" />
            <div className="vinyl">
              <div className="vinyl-center">
                <AudioLines size={36} />
              </div>
            </div>
            <span className="art-code">NC / 001</span>
            <span className="art-caption">INDEPENDENT SOUND</span>
            <b className="note">♫</b>
          </div>

          <div className="hero-index">
            01 <span>/ 04</span>
          </div>
        </section>

        <section className="catalog" id="catalog">
          <div className="section-head">
            <div>
              <div className="eyebrow muted">СЛУШАЙ И ОТКРЫВАЙ</div>
              <h2>В центре внимания</h2>
            </div>
            <span className="count">
              {visible.length.toString().padStart(2, "0")} ТРЕКОВ
            </span>
          </div>

          <div className="filters">
            {genres.map(g => (
              <button
                key={g}
                className={genre === g ? "filter chosen" : "filter"}
                onClick={() => setGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="track-list">
            {visible.length ? (
              visible.map((t, i) => (
                <div
                  className={`track ${current?.id === t.id ? "selected" : ""}`}
                  key={t.id}
                >
                  <div className={`cover ${t.color}`}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <Music2 size={22} />
                  </div>

                  <button
                    className="track-play"
                    onClick={() => play(t)}
                    aria-label="Воспроизвести"
                  >
                    {current?.id === t.id && playing ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} fill="currentColor" />
                    )}
                  </button>

                  <div className="track-meta">
                    <b>{t.title}</b>
                    <span>{t.artist}</span>
                  </div>

                  <span className="track-genre">{t.genre}</span>
                  <span className="duration">{t.duration}</span>

                  <button
                    className={`heart ${
                      favorites.includes(t.id) ? "hearted" : ""
                    }`}
                    onClick={() => toggleFavorite(t.id)}
                    aria-label="В избранное"
                  >
                    <Heart
                      size={18}
                      fill={
                        favorites.includes(t.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">
                Ничего не найдено. Попробуй изменить поиск или жанр.
              </div>
            )}
          </div>
        </section>

        <section className="upload-panel">
          <div className="upload-icon">
            <Upload size={22} />
          </div>

          <div>
            <b>Твой звук — твоя площадка</b>
            <p>Добавь аудиофайлы и собери собственную библиотеку.</p>
          </div>

          <button onClick={() => inputRef.current?.click()}>
            Выбрать файлы <Plus size={16} />
          </button>
        </section>

        <footer>
          <span>© 2026 NoCensMuz</span>
          <span>СОЗДАНО ДЛЯ НЕЗАВИСИМОЙ МУЗЫКИ</span>
        </footer>
      </main>

      <div className="player">
        <div className="now-playing">
          <div className={`player-cover ${current?.color || "violet"}`}>
            <Music2 size={18} />
          </div>

          <div>
            <b>{current?.title || "Выбери свой звук"}</b>
            <span>{current?.artist || "NoCensMuz player"}</span>
          </div>

          <button
            className="heart"
            disabled={!current}
            onClick={() => current && toggleFavorite(current.id)}
          >
            <Heart
              size={17}
              fill={
                current && favorites.includes(current.id)
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>

        <div className="controls">
          <button
            className="main-play"
            disabled={!current?.url}
            onClick={() => current && play(current)}
          >
            {playing ? (
              <Pause size={17} />
            ) : (
              <Play size={17} fill="currentColor" />
            )}
          </button>

          <div className="progress">
            <span />
          </div>

          <div className="time">
            —:— <span>—:—</span>
          </div>
        </div>

        <div className="player-status">
          <Headphones size={18} />
          <span>
            {current ? "Локальный плеер" : "Готов к прослушиванию"}
          </span>
        </div>
      </div>

      {notice && (
        <div className="notice" role="status">
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="audio/*"
        multiple
        onChange={e => {
          upload(e.target.files || []);
          e.target.value = "";
        }}
      />

      <audio
        ref={audioRef}
        src={current?.url || undefined}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <Auth>
    <App />
  </Auth>
);
