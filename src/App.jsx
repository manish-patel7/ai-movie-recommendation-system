import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BsMicFill } from "react-icons/bs";

function App() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchHistory, setSearchHistory] = useState(() => {
  const saved = localStorage.getItem("searchHistory");
  return saved ? JSON.parse(saved) : [];
});
const [showMenu, setShowMenu] = useState(false);
const [genre, setGenre] = useState("all");
const [featuredMovies, setFeaturedMovies] = useState([]);
const [page, setPage] = useState(1);
const [isListening, setIsListening] = useState(false);
const [showAbout, setShowAbout] = useState(false);

    // favorites
  const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
});

  const API_KEY = "c9692e30";
  useEffect(() => {
  loadFeaturedMovies();
}, []);

  const searchMovie = async () => {
    if (!movie.trim()) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${movie}&page=${page}`
      );
if (response.data.Search) {
  setMovies(response.data.Search);

  const updatedHistory = [
    movie,
    ...searchHistory.filter(
      (item) => item.toLowerCase() !== movie.toLowerCase()
    ),
  ].slice(0, 5);

  setSearchHistory(updatedHistory);

  localStorage.setItem(
    "searchHistory",
    JSON.stringify(updatedHistory)
  );
} else {
  setMovies([]);
  alert("Movie Not Found");
}
    

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const startVoiceSearch = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice Search not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.start();
  setIsListening(true);
  

  recognition.onresult = (event) => {
  console.log(event.results[0][0].transcript);

  const transcript =
    event.results[0][0].transcript;

  setMovie(transcript);
};

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    setMovie(transcript);
    setMovie(transcript);

setTimeout(() => {
  document
    .querySelector(".search-box button")
    ?.click();
}, 300);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };
  recognition.onstart = () => {
  console.log("Listening...");
};

recognition.onerror = (event) => {
  console.log("Voice Error:", event.error);
};


};

const loadFeaturedMovies = async () => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=avengers`
    );

    if (response.data.Search) {
      setFeaturedMovies(response.data.Search);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  if (movie.trim()) {
    searchMovie();
  }
}, [page]);


const getMovieDetails = async (id) => {
  console.log("Clicked:", id);

  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
    );

    console.log(response.data);

    setSelectedMovie(response.data);
    setShowModal(true);
  } catch (error) {
    console.log(error);
  }
};
 
const clearHistory = () => {
  setSearchHistory([]);
  localStorage.removeItem("searchHistory");
};


const addToFavorites = (movie) => {
  const alreadyExists = favorites.find(
    (fav) => fav.imdbID === movie.imdbID
  );



 
  if (alreadyExists) {
    alert("Movie already in favorites!");
    return;
  }

  const updatedFavorites = [...favorites, movie];

  setFavorites(updatedFavorites);

  localStorage.setItem(
    "favorites",
    JSON.stringify(updatedFavorites)
  );
};


// Remove from favorites
const removeFavorite = (id) => {
  const updatedFavorites = favorites.filter(
    (movie) => movie.imdbID !== id
  );

  setFavorites(updatedFavorites);

  localStorage.setItem(
    "favorites",
    JSON.stringify(updatedFavorites)
  );
};

const exportFavorites = () => {
  const dataStr = JSON.stringify(
    favorites,
    null,
    2
  );

  const blob = new Blob(
    [dataStr],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "favorites.json";

  link.click();

  URL.revokeObjectURL(url);
};

const importFavorites = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedFavorites = JSON.parse(
        e.target.result
      );

      setFavorites(importedFavorites);

      localStorage.setItem(
        "favorites",
        JSON.stringify(importedFavorites)
      );

      alert("Favorites Imported Successfully!");
    } catch (error) {
      alert("Invalid JSON File");
    }
  };

  reader.readAsText(file);
};

const surpriseMe = () => {
  const randomMovies = [
    "Avengers",
    "Batman",
    "Spider Man",
    "Inception",
    "Interstellar",
    "Joker",
    "Titanic",
    "Avatar",
    "Iron Man",
    "John Wick"
  ];

  const randomMovie =
    randomMovies[
      Math.floor(
        Math.random() * randomMovies.length
      )
    ];

  setMovie(randomMovie);

  setTimeout(() => {
    searchMovie();
  }, 200);
};


const filteredMovies =
  genre === "all"
    ? movies
    : movies.filter((movie) =>
        movie.Title.toLowerCase().includes(
          genre.toLowerCase()
        )
      );




  return (
    <div className={darkMode ? "container dark" : "container light"}>
      <h1>🎬 AI Movie Recommendation System</h1>
    <button
  className="theme-btn"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️" : "🌙"}
</button>
<button
  className="menu-btn"
  onClick={() => setShowMenu(!showMenu)}
>
  ☰
</button>
{showMenu && (
  <div className="side-menu">
    <h3>📋 Dashboard</h3>

    <p>❤️ Favorites: {favorites.length}</p>
   

    <button
      className="menu-item"
      onClick={() => {
        setSearchHistory([]);
        localStorage.removeItem("searchHistory");
      }}
    >
      🗑️ Clear History
    </button>

    <h4>🕒 Recent Searches</h4>

    {searchHistory.map((item, index) => (
      <button
        key={index}
        className="history-btn"
        onClick={() => {
          setMovie(item);
          setShowMenu(false);
        }}
      >
        {item}
      </button>
    ))}

     <button
  className="menu-item"
  onClick={() => {
    setShowAbout(true);
    setShowMenu(false);
  }}
>
  ℹ️ About
</button>

  </div>
)}
      <p className="subtitle">
        Discover Movies Instantly
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMovie();
            }
          }}
        />

     <button
  className="search-icon-btn"
  onClick={searchMovie}
>
  🔍
</button>

{/* <button
  className="mic-btn"
  onClick={startVoiceSearch}
>
  {isListening ? "🎤..." : "🎙️"}
</button> */}


<button className="voice-btn" onClick={startVoiceSearch}>
  <BsMicFill />
</button>

<button
  className="surprise-btn"
  onClick={surpriseMe}
>
  🎲 Surprise Me
</button>

      </div>

{movies.length === 0 && (
  <>
    <h2 className="fav-title">
      🔥 Featured Movies
    </h2>

    <div className="movies-container">
      {featuredMovies.map((movie) => (
        <div
          className="movie-card"
          key={movie.imdbID}
        >
          <img
            src={movie.Poster}
            alt={movie.Title}
          />

          <h2>{movie.Title}</h2>

          <p>📅 {movie.Year}</p>
        </div>
      ))}
    </div>
  </>
)}


<div className="genre-filter">
  <select
    value={genre}
    onChange={(e) => setGenre(e.target.value)}
  >
    <option value="all">All Movies</option>
    <option value="action">Action</option>
    <option value="comedy">Comedy</option>
    <option value="horror">Horror</option>
    <option value="romance">Romance</option>
    <option value="animation">Animation</option>
    <option value="sci-fi">Sci-Fi</option>
  </select>
</div>

      {/* {searchHistory.length > 0 && (
  <div className="history-container">
   <div className="history-header">
  <h3>Search History:</h3>

  <button
    className="clear-history-btn"
    onClick={clearHistory}
  >
    ❌ Clear
  </button>
</div>

    {searchHistory.map((item, index) => (
      <button
        key={index}
        className="history-btn"
        onClick={() => {
          setMovie(item);
        }}
      >
        {item}
      </button>
    ))}
  </div>
)} */}
       <p className="result-count">
  Results Found: {movies.length}
</p>

{/* loading spinner */}


      {loading && (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p>Loading Movies...</p>
  </div>
)}

      <div className="movies-container">
        {filteredMovies.map((movie) => (
          <div className="movie-card" key={movie.imdbID}>
            <img
              src={movie.Poster}
              alt={movie.Title}
            />

            <h2>{movie.Title}</h2>

            <p>📅 {movie.Year}</p>

      

            <p>🎬 {movie.Type}</p>

            <button
              className="details-btn"
              onClick={() =>
                getMovieDetails(movie.imdbID)
              }
            >
              View Details
            </button>
            <button
  className="fav-btn"
  onClick={() => addToFavorites(movie)}
>
  ❤️ Favorite

  
</button>
          </div>
        ))}
      </div>

      {movies.length > 0 && (
  <div className="pagination">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
    >
      ⬅ Previous
    </button>

    <span>Page {page}</span>

    <button
      onClick={() => setPage(page + 1)}
    >
      Next ➡
    </button>
  </div>
)}

      {favorites.length > 0 && (
  <>
    <h2 className="fav-title">
      ❤️ Favorite Movies
    </h2>

    <button
  className="export-btn"
  onClick={exportFavorites}
>
  📤 Export Favorites
</button>

<label className="import-btn">
  📥 Import Favorites

  <input
    type="file"
    accept=".json"
    onChange={importFavorites}
    hidden
  />
</label>

    <div className="movies-container">
      {favorites.map((movie) => (
        <div
          className="movie-card"
          key={movie.imdbID}
        >
          <img
            src={movie.Poster}
            alt={movie.Title}
          />

          <h2>{movie.Title}</h2>

          <p>📅 {movie.Year}</p>
          <button
  className="remove-btn"
  onClick={() => removeFavorite(movie.imdbID)}
>
  ❌ Remove
</button>



        </div>
      ))}
    </div>
  </>
)}

      {showModal && selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <img
              src={selectedMovie.Poster}
              alt={selectedMovie.Title}
            />

            <h2>{selectedMovie.Title}</h2>

            {/* <p>
              ⭐ IMDb Rating:
              {" "}
              {selectedMovie.imdbRating}
            </p> */}

                     <p
  className={
    Number(selectedMovie.imdbRating) >= 8
      ? "rating excellent"
      : Number(selectedMovie.imdbRating) >= 6
      ? "rating good"
      : "rating poor"
  }
>
  ⭐ IMDb Rating: {selectedMovie.imdbRating}
</p>

            <p>
              📅 Year:
              {" "}
              {selectedMovie.Year}
            </p>

            <p>
              🎭 Genre:
              {" "}
              {selectedMovie.Genre}
            </p>

            <p>
              🎬 Director:
              {" "}
              {selectedMovie.Director}
            </p>

            <p>
              👨‍🎭 Actors:
              {" "}
              {selectedMovie.Actors}
            </p>

            <p>
              📝 Plot:
              {" "}
              {selectedMovie.Plot}
            </p>
            <a
  href={`https://www.youtube.com/results?search_query=${selectedMovie.Title}+Official+Trailer`}
  target="_blank"
  rel="noreferrer"
>
  <button className="trailer-btn">
    🎬 Watch Trailer
  </button>
</a>
          </div>
        </div>
      )}
      {showAbout && (
  <div className="modal-overlay">
    <div className="modal-box">
      <button
        className="close-btn"
        onClick={() => setShowAbout(false)}
      >
        ✖
      </button>

      <h2>ℹ️ About Project</h2>

      <p>
        AI Movie Recommendation System is a React-based
        movie search application that uses the OMDb API.
      </p>

      <p>
        Features:
      </p>

      <ul style={{ textAlign: "left" }}>
        <li>🎬 Movie Search</li>
        <li>⭐ Movie Details</li>
        <li>❤️ Favorites</li>
        <li>🕒 Search History</li>
        <li>🌙 Dark/Light Mode</li>
        <li>🎙️ Voice Search</li>
        <li>📤 Export Favorites</li>
      </ul>

      <p>
        Developed by ❤️ Manish Patel
      </p>
    </div>
  </div>
)}

<footer
  className="footer"
  onClick={() => setShowAbout(true)}
>
  🎬 AI Movie Recommendation System |
  Developed by ❤️ Manish Patel
</footer>

    </div>
  

  );
 
}


export default App;