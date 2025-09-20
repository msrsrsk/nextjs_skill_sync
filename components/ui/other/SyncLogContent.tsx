"use client"

import NoDataText from "@/components/common/display/NoDataText"
import Pagination from "@/components/ui/navigation/Pagination"
import SyncLogCard from "@/components/ui/other/SyncLogCard"
import TabNavigation from "@/components/common/display/TabNavigation"
import { syncLogLinks } from "@/data/links"
import { formatTitleCase } from "@/lib/utils/format"
import { PAGINATION_CONFIG } from "@/constants/index"

const { INITIAL_PAGE } = PAGINATION_CONFIG;

interface SyncLogContentProps {
    categoryData: SyncLogData;
    categoryType: string;
}

const SyncLogContent = ({ 
    categoryData,
    categoryType,
}: SyncLogContentProps) => {
    const { 
        logList, 
        totalPages, 
        currentPage, 
        hasNextPage, 
        hasPrevPage 
    } = categoryData;

    const formattedCategory = formatTitleCase(categoryType);

    return <>
        <TabNavigation
            links={syncLogLinks}
            category={formattedCategory}
        />

        {logList.length === 0 ? (
            <NoDataText />
        ) : <>
            <div className="max-w-2xl mx-auto mr-5 md:mr-0">
                <div className="border-b border-sub">
                    {logList.map(({ 
                        id, 
                        thumbnail, 
                        title, 
                        content, 
                        category, 
                        createdAt 
                    }) => (
                        <SyncLogCard 
                            key={id} 
                            id={id} 
                            thumbnail={thumbnail} 
                            title={title} 
                            content={content} 
                            category={category} 
                            createdAt={createdAt} 
                        />
                    ))}
                </div>

                {totalPages > INITIAL_PAGE && (
                    <Pagination 
                        totalPages={totalPages}
                        currentPage={currentPage}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                    />
                )}
            </div>
        </>}
    </>
}

export default SyncLogContent