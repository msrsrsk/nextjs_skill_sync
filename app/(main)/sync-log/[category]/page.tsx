import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import SyncLogContent from "@/components/ui/other/SyncLogContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getPaginatedSyncLogByCategory } from "@/lib/services/microcms/actions"
import { isValidCategory } from "@/lib/utils/validation"
import { generatePageMetadata } from "@/lib/metadata/page"
import { 
    SYNC_LOG_DISPLAY_CONFIG, 
    SYNC_LOG_CATEGORIES, 
    DEFAULT_PAGE, 
    SITE_MAP,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PAGE_LIMIT } = SYNC_LOG_DISPLAY_CONFIG;
const { SYNC_ALL } = SYNC_LOG_CATEGORIES;
const { SYNC_LOG_PATH } = SITE_MAP;
const { LOG_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

interface SyncLogCategoryPageProps {
    params: {
        category: string;
    };
    searchParams: {
        page?: string;
    };
}

export async function generateMetadata({ 
    params 
}: { params: { category: string } }): Promise<Metadata> {
    const category = params.category;

    return generatePageMetadata({
        title: '記事ログ一覧',
        description: '記事ログの一覧ページです。',
        url: `${SYNC_LOG_PATH}/${category.toLowerCase()}`,
    });
}

const SyncLogCategoryPage = ({ 
    params,
    searchParams 
}: SyncLogCategoryPageProps) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE);
    const category = params.category;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="The Sync Log"
                customClass="mt-6 mb-6 md:mt-10 md:mb-10" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <SyncLogCategoryWrapper 
                    page={page} 
                    category={category}
                />
            </Suspense>
        </div>
    </>
}

const SyncLogCategoryWrapper = async ({ 
    page,
    category,
}: SearchParamsPageCategory) => {
    if (!isValidCategory(category, SYNC_LOG_CATEGORIES)) {
        notFound();
    }

    const normalizedCategory = category === SYNC_ALL.toLowerCase() 
        ? SYNC_ALL 
        : category;

    const { data, error } = await getPaginatedSyncLogByCategory({ 
        page, 
        limit: PAGE_LIMIT,
        category: normalizedCategory
    });
    // const { data, error } = { data: undefined, error: undefined };

    if (error) return <ErrorMessage message={error} />
    if (!data) return <ErrorMessage message={LOG_ERROR.FETCH_FAILED} />

    return <>
        <SyncLogContent 
            categoryData={data}
            categoryType={category || SYNC_ALL}
        />
    </>
}

export default SyncLogCategoryPage