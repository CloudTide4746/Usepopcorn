import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import StarRating from "./starrating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function SearchBar({ query, setQuery }) {
  const elInput = useRef(null);
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);
  useEffect(
    function () {
      function callback(ev1) {
        if (document.activeElement === elInput.current) {
          return;
        }
        if (ev1.code === "Enter") {
          elInput.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);

      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={elInput}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function LeftList({ movies, handleGetMovieID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() => {
            handleGetMovieID(movie.imdbID);
            console.log("Clicked!!");
          }}
        >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Box({ movies, children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}
// function RightBar({isOpen2,setIsOpen2,children}){
//   return(
//             <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>
//             {children}

//             </>
//           )}
//         </div>
//   )
// }
function MovieList({ watched, handleGetMovieID, handleDeleteWatch }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() => {
            handleGetMovieID(movie.imdbID);
            console.log("Clicked!!");
          }}
        >
          <img src={movie.Poster} alt={` ${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => handleDeleteWatch(movie.imdbID)}
            ></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MovieSummary({ avgImdbRating, avgUserRating, avgRuntime, watched }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function RightMovieDetail({ selectedid, handleAddMovie }) {
  const [movie, setmovie] = useState("");
  const [Rating, SetRating] = useState(0);

  const countRef = useRef(0);
  useEffect(
    function () {
      if (Rating) countRef.current = countRef.current + 1;
    },
    [Rating]
  );

  useEffect(
    function () {
      async function SHowMovieRight() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedid}`
        );
        let datas = await res.json();
        setmovie(datas);
        console.log(datas);
      }
      SHowMovieRight();
    },
    [selectedid]
  );

  useEffect(
    function () {
      document.title = movie.Title;
      return function () {
        document.title = "usePopCorn";
      };
    },
    [movie.Title]
  );

  return (
    <div>
      <h1>{countRef.current}</h1>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} alt="11" style={{ height: "250px" }}></img>
      <StarRating
        size={30}
        maxRatingNum={10}
        Rating={Rating}
        SetRating={SetRating}
      ></StarRating>
      <button onClick={() => handleAddMovie(movie)}>Submit</button>
    </div>
  );
}

function Mainf({ children }) {
  return <main className="main">{children}</main>;
}

const KEY = "db6ad773";

function LoadingBar() {
  return <h1>Loading </h1>;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [addedMovie, setAdded] = useLocalStorageState([], "Watched");
  const [selectedid, SetSelectedID] = useState(null);

  // const [addedMovie, setAdded] = useState(function () {
  //   try {
  //     const storedValue = localStorage.getItem("Watched");
  //     return storedValue ? JSON.parse(storedValue) : [];
  //   } catch {
  //     return [];
  //   }
  // });

  const { movies, isLoading, error, watched } = useMovies(query, KEY);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  function handleGetMovieID(id) {
    SetSelectedID(id);
  }
  function handleDeleteWatch(id) {
    setAdded((addedMovie) => addedMovie.filter((movie) => movie.imdbID !== id));
  }

  function handleCloseMenu() {
    SetSelectedID(null);
  }

  function handleAddMovie(movie) {
    setAdded((addedMovie) => [...addedMovie, movie]);
  }

  return (
    <>
      <NavBar>
        <Logo></Logo>
        <SearchBar query={query} setQuery={setQuery}></SearchBar>
        <NumResults movies={movies}></NumResults>
      </NavBar>

      <Mainf>
        <Box movies={movies}>
          {isLoading ? (
            <LoadingBar />
          ) : (
            <LeftList
              movies={movies}
              handleGetMovieID={handleGetMovieID}
            ></LeftList>
          )}
        </Box>

        <Box>
          <button onClick={handleCloseMenu} className="btn-back"></button>
          {selectedid ? (
            <RightMovieDetail
              selectedid={selectedid}
              handleAddMovie={handleAddMovie}
            />
          ) : (
            <>
              <MovieSummary
                avgImdbRating={avgImdbRating}
                avgUserRating={avgUserRating}
                avgRuntime={avgRuntime}
                watched={watched}
              ></MovieSummary>
              <MovieList
                movies={movies}
                watched={addedMovie}
                handleGetMovieID={handleGetMovieID}
                handleDeleteWatch={handleDeleteWatch}
              >
                {" "}
              </MovieList>
            </>
          )}
        </Box>
      </Mainf>
    </>
  );
}
