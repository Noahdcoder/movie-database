import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery("");
    setMovies([]);
  };

  const handleViewMore = async (movie: Movie) => {
    setSelectedMovie(movie);
  };

  useEffect(() => {
    const handleSearch = async () => {
      const API_KEY = process.env.API_KEY;
      if (query.length > 1) {
        // added condition to check query length
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

        try {
          const response = await axios.get(url);
          setMovies(response.data.results);
        } catch (error) {
          console.log(error);
        }
      } else {
        setMovies([]); // reset movies to empty array
      }
    };

    handleSearch();
  }, [query]);

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-full space-x-1">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-full focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            placeholder="Search for your favourite movies..."
          />
          <button
            className="px-4 text-white bg-purple-600 rounded-full"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
      {movies.length > 0 && (
        <div className="p-8 bg-purple-800 space-y-4">
          <h3 className="text-white text-3xl">Results for {`"${query}"`}</h3>
          <div className="flex space-x-8 pb-4 overflow-x-hidden overflow-x-scroll">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col text-white space-y-4"
              >
                <div className="w-48">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    height={100}
                    width={100}
                    style={{ width: "100%" }}
                  />
                </div>
                <h3 className="text-xl font-bold">{movie.title}</h3>
                <p className="flex-1">{movie.overview.slice(0, 200)}...</p>
                <button
                  onClick={() => handleViewMore(movie)}
                  className="bg-white hover:opacity-0.75 text-purple-800 font-bold py-2 px-4 rounded"
                >
                  View More
                </button>
                <p className="font-bold">
                  Average Ratings: {movie.vote_average}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedMovie && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            />
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      {selectedMovie.title}
                    </h3>
                    <div className="mt-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                        alt={`${selectedMovie.title} poster`}
                        height={400}
                        width={300}
                      />
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      {selectedMovie.overview}
                    </p>
                    <p className="text-gray-700 text-sm mt-2 font-bold">
                      Average Ratings: {selectedMovie.vote_average}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedMovie(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
