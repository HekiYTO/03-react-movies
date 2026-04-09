import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      // Очищення попередніх результатів перед новим пошуком
      setMovies([]);
      setError(false);
      setIsLoading(true);

      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast('No movies found for your request.', { icon: '🍿' });
      } else {
        setMovies(results);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      
      {error && <ErrorMessage />}
      
      {!error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      
      {isLoading && <Loader />}
      
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
};

export default App;