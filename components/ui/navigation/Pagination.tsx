"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { PAGINATION_CONFIG } from "@/constants/index"

const { PAGE_OFFSET, INITIAL_PAGE } = PAGINATION_CONFIG;

const Pagination = ({ 
    totalPages, 
    currentPage, 
    hasNextPage, 
    hasPrevPage,
}: PaginationProps) => {
    const searchParams = useSearchParams()

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        return `?${params.toString()}`
    }

    if (totalPages <= INITIAL_PAGE) return null;

    return (
        <div className="flex items-center justify-center gap-8 mt-10 md:mt-20">
            <Link 
                href={createPageUrl(currentPage - PAGE_OFFSET)}
                className={`pagination-btn${
                    !hasPrevPage ? ' is-disabled' : ''
                }`}
                aria-disabled={!hasPrevPage}
            >
                Prev
            </Link>

            <div className="pagination-numbox">
                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + PAGE_OFFSET

                    return (
                        <Link 
                            key={page} 
                            href={createPageUrl(page)}
                            className={`pagination-num${
                                page === currentPage ? ' is-active' : ''
                            }`}
                        >
                            {page}
                        </Link>
                    )
                })}
            </div>

            <Link 
                href={createPageUrl(currentPage + PAGE_OFFSET)}
                className={`pagination-btn${
                    !hasNextPage ? ' is-disabled' : ''
                }`}
                aria-disabled={!hasNextPage}
            >
                Next
            </Link>
        </div>
    )
}

export default Pagination