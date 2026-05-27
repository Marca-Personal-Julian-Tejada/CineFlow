import './Pagination.css';
import { MAX_VISIBLE_PAGES } from '@/constants/app';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
    if (end - start < MAX_VISIBLE_PAGES - 1) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPages();

  return (
    <nav className="pagination" aria-label="Navegación de páginas">
      <button
        className="pagination__btn pagination__btn--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Anterior</span>
      </button>

      <div className="pagination__pages">
        {pages[0] > 1 && (
          <>
            <button className="pagination__page" onClick={() => onPageChange(1)} type="button">1</button>
            {pages[0] > 2 && <span className="pagination__ellipsis">…</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination__page${page === currentPage ? ' pagination__page--active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            type="button"
          >
            {page}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="pagination__ellipsis">…</span>}
            <button className="pagination__page" onClick={() => onPageChange(totalPages)} type="button">{totalPages}</button>
          </>
        )}
      </div>

      <button
        className="pagination__btn pagination__btn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        type="button"
      >
        <span>Siguiente</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
