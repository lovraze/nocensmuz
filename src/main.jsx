
import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import Auth from "./Auth";
import "./style.css";

const demoTracks = [
  {
    id: 1,
    title: "Ночной город",
    artist: "NoCensMuz",
    genre: "Электроника",
    duration: "3:42",
  },
  {
    id: 2,
    title: "Без границ",
    artist: "Independent",
    genre: "Хип-хоп",
    duration: "2:58",
  },
  {
    id: 3,
    title: "Свободный звук",
    artist: "Underground",
    genre: "Рок",
    duration: "4:15",
  },
];

function App() {
  const [tracks, setTracks] = useState(demoTracks);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Все");
  const [favorites, setFavorites] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [page, setPage] = useState("Обзор");

  const audioRef = useRef(null);

  const genres = [
    "Все",
    "Электроника",
    "Хип-хоп",
    "Рок",
    "Поп",
    "Другое",
  ];

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      genre === "Все" || track.genre === genre;

    const matchesFavorites =
      page !== "Избранное" || favorites.includes(track.id);

    return matchesSearch && matchesGenre && matchesFavorites;
  });

  function toggleFavorite(id) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function playTrack(track) {
    setCurrentTrack(track);
    setPlaying(true);
  }

  function uploadMusic(event) {
    const files = Array.from(event.target.files || []);

    const newTracks = files
      .filter((file) => file.type.startsWith("audio/"))
      .map((file, index) => ({
        id: Date.now() + index,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Ваш трек",
        genre: "Другое",
        duration: "—",
        url: URL.createObjectURL(file),
      }));

    setTracks((previous) => [...previous, ...newTracks]);
    event.target.value = "";
  }

  function togglePlayback() {
    if (!currentTrack) return;

    if (currentTrack.url && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setPlaying(true);
      }
    } else {
      setPlaying((previous) => !previous);
    }
  }

  React.useEffect(() => {
    if (currentTrack?.url && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">♫</span>
          <span>NoCensMuz</span>
        </div>

        <div className="menu-title">МЕНЮ</div>

        {["Обзор", "Каталог", "Избранное"].map((item) => (
          <button
            key={item}
            className={`menu-item ${page === item ? "active" : ""}`}
            onClick={() => setPage(item)}
          >
            <span className="menu-icon">
              {item === "Обзор" ? "⌂" : item === "Каталог" ? "♫" : "♥"}
            </span>
            {item}
          </button>
        ))}

        <label className="upload-button">
          <span>＋</span>
          Загрузить музыку
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={uploadMusic}
            hidden
          />
        </label>

        <div className="sidebar-bottom">
          <span>NO CENSORSHIP.</span>
          <span>ONLY MUSIC.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="welcome-label">ТВОЯ МУЗЫКА. ТВОИ ПРАВИЛА.</div>
            <h1>{page}</h1>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Найти музыку или исполнителя..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">НЕЗАВИСИМАЯ МУЗЫКАЛЬНАЯ ПЛАТФОРМА</span>
            <h2>
              Слушай.
              <br />
              Создавай.
              <br />
              Будь свободен.
            </h2>
            <p>
              Музыка без границ, ограничений и чужих правил.
            </p>
            <button
              className="hero-button"
              onClick={() => setPage("Каталог")}
            >
              Открыть каталог <span>→</span>
            </button>
          </div>
          <div className="hero-symbol">♫</div>
        </section>

        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <span className="welcome-label">ТВОЯ КОЛЛЕКЦИЯ</span>
              <h2>
                {page === "Избранное" ? "Избранное" : "Треки"}
              </h2>
            </div>
            <span className="track-count">
              {filteredTracks.length} треков
            </span>
          </div>

          <div className="genre-list">
            {genres.map((item) => (
              <button
                key={item}
                className={`genre-button ${genre === item ? "selected" : ""}`}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="track-list">
            {filteredTracks.length === 0 ? (
              <div className="empty-state">
                <span>♫</span>
                <h3>Здесь пока пусто</h3>
                <p>Найди трек или загрузи свою музыку.</p>
              </div>
            ) : (
              filteredTracks.map((track, index) => (
                <div className="track-row" key={track.id}>
                  <button
                    className="track-play"
                    onClick={() => playTrack(track)}
                  >
                    {currentTrack?.id === track.id && playing ? "Ⅱ" : "▶"}
                  </button>

                  <div className="track-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="track-info">
                    <strong>{track.title}</strong>
                    <span>{track.artist}</span>
                  </div>

                  <span className="track-genre">{track.genre}</span>

                  <span className="track-duration">
                    {track.duration}
                  </span>

                  <button
                    className={`favorite-button ${
                      favorites.includes(track.id) ? "favorited" : ""
                    }`}
                    onClick={() => toggleFavorite(track.id)}
                    aria-label="Добавить в избранное"
                  >
                    {favorites.includes(track.id) ? "♥" : "♡"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <footer>
          <span>NoCensMuz © 2026</span>
          <span>Музыка принадлежит тем, кто её создаёт.</span>
        </footer>
      </main>

      {currentTrack && (
        <div className="player">
          <div className="player-track">
            <span className="player-icon">♫</span>
            <div>
              <strong>{currentTrack.title}</strong>
              <span>{currentTrack.artist}</span>
            </div>
          </div>

          <button className="player-control" onClick={togglePlayback}>
            {playing ? "Ⅱ" : "▶"}
          </button>

          <span className="player-status">
            {playing ? "Воспроизводится" : "Пауза"}
          </span>

          <audio
            ref={audioRef}
            onEnded={() => setPlaying(false)}
          />
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <Auth>
    <App />
  </Auth>
);
