"use client";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pageCount: number;
};

export default function Pagination({ currentPage, totalPages, pageSize, pageCount }: PaginationProps) {
    const searchParams = useSearchParams();
    const basePath = searchParams.get('basePath') || '';
    const pathname = usePathname();
    const { replace } = useRouter();


    const handlePageChange = (page: number) => {
        // Update the URL with the new page number while preserving other query parameters, and don't overwrite search query if present
        // take existing search params
        const params = new URLSearchParams(searchParams);
        // Copy existing query param if present
        const query = params.get('query');
        if (query) {
            params.set('query', query);
        }
        params.set('page', page.toString());
        replace(`${pathname}?${params.toString()}`);

        // replace(`${pathname}?page=${page}`);
    };

    return (
        <div className="flex justify-center align-center mt-12 space-x-2">
            <Button onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 rounded disabled:opacity-50" disabled={currentPage === 1}>
                Prethodno
            </Button>
            {/* Show first page always, and last page if there are set dots between */}
            {Array.from({ length: pageCount }, (_, i) => (
                // Show only first, last, current, and two pages before and after current
                (i === 0 || i === pageCount - 1 || (i >= currentPage - 3 && i <= currentPage + 1)) ? (
                    <Button onClick={() => handlePageChange(i + 1)} key={i} className={`px-4 py-2 hover:bg-pink-700 focus:bg-pink-600 cursor-pointer rounded ${currentPage === i + 1 ? 'bg-pink-500 hover:bg-pink-600 text-white' : ''}`}>
                        {i + 1}
                    </Button>
                ) : (
                    // Show dots if not already shown
                    (i === currentPage - 4 || i === currentPage + 2) ? (
                        <span key={i} className="px-4 py-2">...</span>
                    ) : null
                )
            ))}

            <Button onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 rounded disabled:opacity-50" disabled={currentPage === totalPages}>
                Sljedeće
            </Button>
        </div>
    );
}
