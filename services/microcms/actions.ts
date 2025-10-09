import { client } from "@/lib/clients/microcms/client"

import { 
    SYNC_LOG_DISPLAY_CONFIG, 
    SYNC_LOG_CATEGORIES,
    MICROCMS_CONFIG,
    PAGINATION_CONFIG,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PAGE_LIMIT } = SYNC_LOG_DISPLAY_CONFIG;
const { 
    SYNC_ALL, 
    SYNC_UPDATES, 
    SYNC_VOICES, 
    SYNC_EXTRAS 
} = SYNC_LOG_CATEGORIES;
const { INITIAL_OFFSET, LOG_ENDPOINT } = MICROCMS_CONFIG;
const { INITIAL_PAGE, PAGE_OFFSET } = PAGINATION_CONFIG;

const { LOG_ERROR } = ERROR_MESSAGES;

interface SyncLogQueries {
    limit?: number;
    category?: string;
    offset?: number;
}

interface MicroCMSQueries {
    limit: number;
    filters?: string;
    offset?: number;
}

interface GetPaginatedSyncLogByCategoryProps {
    page: number;
    limit: number;
    category: string;
}

// 記事ログのリストを取得
export async function getSyncLogList({ 
    limit = PAGE_LIMIT, 
    category = SYNC_ALL,
    offset = INITIAL_OFFSET
}: Partial<SyncLogQueries> = {}) {
    try {
        const queries: MicroCMSQueries = {
            limit: limit,
            offset: offset,
        };
        
        if (category !== SYNC_ALL) {
            const formattedCategory = category.charAt(0).toLowerCase() + category.slice(1);
            queries.filters = `category[equals]${formattedCategory}`;
        }

        const data = await client.get({
            endpoint: LOG_ENDPOINT,
            queries,
        });
        
        return {
            success: true,
            error: null,
            data: {
                logList: data.contents,
                totalCount: data.totalCount,
            }
        }
    } catch (error) {
        console.error('Actions Error - Get Sync Log List error:', error);

        return {
            success: false,
            error: LOG_ERROR.FETCH_FAILED,
            data: {
                logList: [],
                totalCount: INITIAL_OFFSET,
            }
        }
    }
}

// 記事ログの詳細を取得
export async function getSyncLogDetail(id: string) {
    try {
        const data = await client.get({
            endpoint: `${LOG_ENDPOINT}/${id}`,
        });

        return {
            success: true, 
            error: null, 
            data
        }
    } catch (error) {
        console.error('Actions Error - Get Sync Log Detail error:', error);
        
        return {
            success: false, 
            error: LOG_ERROR.DETAIL_FETCH_FAILED,
            data: null
        }
    }
}

// トップページの全てのカテゴリー別の記事ログリストを取得
export async function getAllSyncLogLists(limit: number) {
    try {
        const [allLogs, updatesLogs, voicesLogs, extrasLogs] = await Promise.all([
            getSyncLogList({ limit }),
            getSyncLogList({ limit, category: SYNC_UPDATES }),
            getSyncLogList({ limit, category: SYNC_VOICES }),
            getSyncLogList({ limit, category: SYNC_EXTRAS })
        ]);
    
        return {
            success: true, 
            error: null, 
            data: {
                [SYNC_ALL]: allLogs.data,
                [SYNC_UPDATES]: updatesLogs.data,
                [SYNC_VOICES]: voicesLogs.data,
                [SYNC_EXTRAS]: extrasLogs.data
            }
        }
    } catch (error) {
        console.error('Actions Error - Get All Sync Log Lists error:', error);

        return {
            success: false, 
            error: LOG_ERROR.FETCH_ALL_FAILED,
            data: null
        }
    }
}

// 記事ログのページネーション付きリストを取得
export async function getPaginatedSyncLogByCategory({
    page,
    limit,
    category
}: GetPaginatedSyncLogByCategoryProps) {
    try {
        const offset = (page - PAGE_OFFSET) * limit;
        
        const { success, error, data } = await getSyncLogList({ 
            limit, 
            category, 
            offset 
        });

        if (!success || !data) {
            return {
                success: false,
                error: error,
                data: null
            }
        }
        
        const totalPages = Math.ceil(data.totalCount / limit);
        
        return {
            success: true, 
            error: null, 
            data: {
                ...data,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > INITIAL_PAGE
            }
        }
    } catch (error) {
        console.error('Actions Error - Get Paginated Sync Log By Category error:', error);

        return {
            success: false, 
            error: LOG_ERROR.FETCH_FAILED
        }
    }
}