"use client";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    currentPage: number;
    pageCount: number;
};

export default function Pagination({ currentPage, pageCount }: PaginationProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    // Generate page numbers based on screen size
    const getVisiblePages = () => {
        const delta = 1; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(pageCount - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < pageCount - 1) {
            rangeWithDots.push('...', pageCount);
        } else {
            rangeWithDots.push(pageCount);
        }

        return rangeWithDots;
    };

    if (pageCount <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-12 md:mt-16">
            {/* Mobile-first layout */}
            <div className="flex items-center space-x-1 md:space-x-2">
                {/* Previous button */}
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-md border border-line p-0 font-sans text-ink-soft hover:border-terracotta hover:bg-paper hover:text-terracotta-dark disabled:opacity-40 md:h-10 md:w-auto md:px-4 md:py-2"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Prethodno</span>
                </Button>

                {/* Mobile: Show only current page info */}
                <div className="flex items-center md:hidden">
                    <span className="px-3 py-1 font-sans text-sm text-ink-soft">
                        {currentPage} / {pageCount}
                    </span>
                </div>

                {/* Desktop: Show page numbers */}
                <div className="hidden md:flex items-center space-x-1">
                    {getVisiblePages().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 font-sans text-ink-soft">...</span>
                            ) : (
                                <Button
                                    onClick={() => handlePageChange(page as number)}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-10 w-10 rounded-md border font-sans ${currentPage === page
                                        ? 'border-terracotta text-terracotta font-semibold bg-transparent hover:bg-transparent'
                                        : 'border-transparent text-ink-soft hover:border-line hover:bg-paper hover:text-ink'
                                        }`}
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next button */}
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-md border border-line p-0 font-sans text-ink-soft hover:border-terracotta hover:bg-paper hover:text-terracotta-dark disabled:opacity-40 md:h-10 md:w-auto md:px-4 md:py-2"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Sljedeće</span>
                </Button>
            </div>

            {/* Mobile: Jump to page input (optional) */}
            <div className="md:hidden ml-4">
                <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(parseInt(e.target.value))}
                    className="rounded-md border border-line bg-cream px-2 py-1 font-sans text-sm text-ink"
                    aria-label="Jump to page"
                >
                    {Array.from({ length: pageCount }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Str. {i + 1}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
