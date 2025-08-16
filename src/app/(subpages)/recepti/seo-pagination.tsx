import Link from "next/link";

type Props = {
  currentPage: number;
  pageCount: number;
};

export default function SEOPagination({ currentPage, pageCount }: Props) {
  if (pageCount <= 1) return null;

  // Generate all page links for crawlers (hidden from users)
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="sr-only" aria-label="Pagination for search engines">
      {/* Previous page */}
      {currentPage > 1 && (
        <Link 
          href={`/recepti?page=${currentPage - 1}`}
          rel="prev"
        >
          Previous
        </Link>
      )}
      
      {/* All pages */}
      {pages.map(page => (
        <Link 
          key={page}
          href={`/recepti?page=${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          Page {page}
        </Link>
      ))}
      
      {/* Next page */}
      {currentPage < pageCount && (
        <Link 
          href={`/recepti?page=${currentPage + 1}`}
          rel="next"
        >
          Next
        </Link>
      )}
    </nav>
  );
}