import axios from "axios";
import Image from "next/image";
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}

interface Props {
  results: Movie[];
}

export default function TrendingDay({ results }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleViewMoreClick = (movie: Movie, index: number) => {
    setSelectedMovie(movie);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleNextClick = () => {
    setSelectedIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevClick = () => {
    setSelectedIndex((prevIndex) => prevIndex - 1);
  };

  const selectedMovieIndex = selectedIndex !== -1 ? selectedIndex : 0;
  return (
    <div className="p-8 bg-purple-800 space-y-4">
      <h2 className="text-3xl text-white">Trending Movies For The Day</h2>
      <div className="flex p-4 space-x-8 overflow-x-hidden overflow-x-scroll">
        {results.map((movie, index) => {
          const { id, title, overview, poster_path, vote_average } = movie;
          return (
            <div key={id} className="flex flex-col text-white space-y-4">
              <div className="w-48">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                  alt={`${title} poster`}
                  height={100}
                  width={100}
                  style={{ width: "100%" }}
                />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="flex-1">{overview.slice(0, 200)}...</p>
              <button
                onClick={() => handleViewMoreClick(movie, index)}
                className="bg-white hover:opacity-0.75 text-purple-800 font-bold py-2 px-4 rounded"
              >
                View More
              </button>
              <p className="font-bold">Average Ratings: {vote_average}</p>
            </div>
          );
        })}
      </div>
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-8 my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-2xl font-semibold">
                  {selectedMovie.title}
                </h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      const index = results.findIndex(
                        (movie) => movie.id === selectedMovie.id
                      );
                      setSelectedMovie(
                        results[index === 0 ? results.length - 1 : index - 1]
                      );
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    disabled={selectedMovieIndex === 0}
                  >
                    Prev
                  </button>

                  <button
                    onClick={() => {
                      const index = results.findIndex(
                        (movie) => movie.id === selectedMovie.id
                      );
                      setSelectedMovie(results[(index + 1) % results.length]);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    disabled={selectedMovieIndex === results.length - 1}
                  >
                    Next
                  </button>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="relative p-6 flex-auto space-y-4">
                <p>{selectedMovie.overview}</p>
                <p className="font-bold">
                  Average Ratings: {selectedMovie.vote_average}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps(): Promise<{ props: Props }> {
  const API_KEY = process.env.API_KEY; // Replace with your own API key
  const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

  try {
    const response = await axios.get(TRENDING_MOVIES_URL);
    const { results } = response.data;

    return {
      props: {
        results,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        results: [],
      },
    };
  }
}
