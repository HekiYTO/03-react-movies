import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './MovieModal.module.css';
import type { Movie } from '../../types/movie';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Заборона скролінгу
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Очищення ефектів
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : 'https://via.placeholder.com/1280x720?text=No+Image'
          }
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || 'No overview available.'}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || 'Unknown'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;