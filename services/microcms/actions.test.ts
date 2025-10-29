import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    getSyncLogList,
    getSyncLogDetail,
    getAllSyncLogLists,
    getPaginatedSyncLogByCategory   
} from "@/services/microcms/actions"
import { MICROCMS_CONFIG, SYNC_LOG_DISPLAY_CONFIG, SYNC_LOG_CATEGORIES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { INITIAL_OFFSET, LOG_ENDPOINT } = MICROCMS_CONFIG;
const { PAGE_LIMIT } = SYNC_LOG_DISPLAY_CONFIG;
const { SYNC_UPDATES, SYNC_VOICES, SYNC_EXTRAS, SYNC_ALL } = SYNC_LOG_CATEGORIES;
const { LOG_ERROR } = ERROR_MESSAGES;
const { FETCH_FAILED, FETCH_ALL_FAILED, DETAIL_FETCH_FAILED } = LOG_ERROR;

const mockClientGet = vi.fn()

vi.mock('@/lib/clients/microcms/client', () => ({
    client: {
        get: vi.fn()
    }
}))

vi.mock('@/repository/microcms', () => ({
    getSyncLogRepository: () => ({
        getSyncLogList: vi.fn(),
        getSyncLogDetail: vi.fn(),
        getAllSyncLogLists: vi.fn(),
        getPaginatedSyncLogByCategory: vi.fn()
    })
}))

/* ==================================== 
    Get Sync Log List Test
==================================== */
describe('getSyncLogList', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const { client } = await import('@/lib/clients/microcms/client')
        vi.mocked(client.get).mockImplementation(mockClientGet)
    })

    // 取得成功
    it('should return sync log list with default parameters', async () => {
        const mockData = {
            contents: [
                { id: 'log-1', title: 'Test Log 1', category: 'All' },
                { id: 'log-2', title: 'Test Log 2', category: 'All' }
            ],
            totalCount: 2
        }

        mockClientGet.mockResolvedValue(mockData);

        const result = await getSyncLogList();

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET
            }
        })
        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                logList: mockData.contents,
                totalCount: mockData.totalCount
            }
        })
    })

    // カテゴリフィルタのテスト（Updates）
    it('should apply category filter for Updates', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        }

        mockClientGet.mockResolvedValue(mockData);

        await getSyncLogList({ category: SYNC_UPDATES });

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET,
                filters: 'category[equals]updates'
            }
        })
    })

    // カテゴリフィルタのテスト（Voices）
    it('should apply category filter for Voices', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        }

        mockClientGet.mockResolvedValue(mockData);

        await getSyncLogList({ category: SYNC_VOICES });

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET,
                filters: 'category[equals]voices'
            }
        })
    })

    // カテゴリフィルタのテスト（Extras）
    it('should apply category filter for Extras', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        }

        mockClientGet.mockResolvedValue(mockData);

        await getSyncLogList({ category: SYNC_EXTRAS });

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET,
                filters: 'category[equals]extras'
            }
        })
    })

    // Allカテゴリの場合（フィルタの適用無し）
    it('should not apply filter for All category', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        }

        mockClientGet.mockResolvedValue(mockData);

        await getSyncLogList({ category: SYNC_ALL });

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET
            }
        })
    })

    // 空のレスポンスのテスト
    it('should handle empty response', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        };

        mockClientGet.mockResolvedValue(mockData);

        const result = await getSyncLogList();

        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                logList: [],
                totalCount: 0
            }
        });
    })

    // 部分的なパラメータのテスト
    it('should work with partial parameters', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        }

        mockClientGet.mockResolvedValue(mockData)

        // limitのみ指定
        await getSyncLogList({ limit: 5 })
        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: 5,
                offset: INITIAL_OFFSET
            }
        })

        // categoryのみ指定
        await getSyncLogList({ category: SYNC_UPDATES })
        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET,
                filters: 'category[equals]updates'
            }
        })

        // offsetのみ指定
        await getSyncLogList({ offset: 10 })
        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: 10
            }
        })
    })

    // カテゴリ名の小文字変換のテスト
    it('should convert category name to lowercase for filter', async () => {
        const mockData = {
            contents: [],
            totalCount: 0
        }

        mockClientGet.mockResolvedValue(mockData)

        await getSyncLogList({ category: 'updates' })

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: PAGE_LIMIT,
                offset: INITIAL_OFFSET,
                filters: 'category[equals]updates'
            }
        })
    })

    // エラーハンドリングのテスト
    it('should handle client error and return error response', async () => {
        const mockError = new Error('Client error')
        mockClientGet.mockRejectedValue(mockError)

        const result = await getSyncLogList()

        expect(result).toEqual({
            success: false,
            error: FETCH_FAILED,
            data: {
                logList: [],
                totalCount: INITIAL_OFFSET
            }
        })
    })
})

/* ==================================== 
    Get Sync Log Detail Test
==================================== */
describe('getSyncLogDetail', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const { client } = await import('@/lib/clients/microcms/client')
        vi.mocked(client.get).mockImplementation(mockClientGet)
    })

    // 取得成功
    it('should return sync log detail successfully', async () => {
        const mockId = 'log-123'
        const mockData = {
            id: 'log-123',
            title: 'Test Log Detail',
            content: 'Test content',
            category: 'Updates',
            publishedAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
        }

        mockClientGet.mockResolvedValue(mockData)

        const result = await getSyncLogDetail(mockId)

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: `${LOG_ENDPOINT}/${mockId}`
        })
        expect(result).toEqual({
            success: true,
            error: null,
            data: mockData
        })
    })

    // 取得成功（空のデータの場合）
    it('should handle empty data response', async () => {
        const mockId = 'log-empty'
        const mockData = {}

        mockClientGet.mockResolvedValue(mockData)

        const result = await getSyncLogDetail(mockId)

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: `${LOG_ENDPOINT}/${mockId}`
        })
        expect(result).toEqual({
            success: true,
            error: null,
            data: mockData
        })
    })

    // 取得失敗（エラー）
    it('should handle client error and return error response', async () => {
        const mockId = 'log-error'
        const mockError = new Error('Client error')

        mockClientGet.mockRejectedValue(mockError)

        const result = await getSyncLogDetail(mockId)

        expect(result).toEqual({
            success: false,
            error: DETAIL_FETCH_FAILED,
            data: null
        })
    })

    // 取得失敗（例外発生）
    it('should handle not found error', async () => {
        const mockId = 'non-existent-log'

        mockClientGet.mockRejectedValue(
            new Error('Not Found')
        )

        const result = await getSyncLogDetail(mockId)

        expect(result).toEqual({
            success: false,
            error: DETAIL_FETCH_FAILED,
            data: null
        })
    })
})

/* ==================================== 
    Get All Sync Log Lists Test
==================================== */
describe('getAllSyncLogLists', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const { client } = await import('@/lib/clients/microcms/client')
        vi.mocked(client.get).mockImplementation(mockClientGet)
    })

    // 取得成功
    it('should return all sync log lists successfully', async () => {
        const mockLimit = 5
        const mockAllLogs = {
            success: true,
            error: null,
            data: {
                logList: [
                    { id: 'log-1', title: 'All Log 1', category: 'All' },
                    { id: 'log-2', title: 'All Log 2', category: 'All' }
                ],
                totalCount: 2
            }
        }
        const mockUpdatesLogs = {
            success: true,
            error: null,
            data: {
                logList: [
                    { id: 'log-3', title: 'Updates Log 1', category: 'Updates' }
                ],
                totalCount: 1
            }
        }
        const mockVoicesLogs = {
            success: true,
            error: null,
            data: {
                logList: [
                    { id: 'log-4', title: 'Voices Log 1', category: 'Voices' }
                ],
                totalCount: 1
            }
        }
        const mockExtrasLogs = {
            success: true,
            error: null,
            data: {
                logList: [
                    { id: 'log-5', title: 'Extras Log 1', category: 'Extras' }
                ],
                totalCount: 1
            }
        }

        mockClientGet
            .mockResolvedValueOnce({ contents: mockAllLogs.data.logList, totalCount: mockAllLogs.data.totalCount })
            .mockResolvedValueOnce({ contents: mockUpdatesLogs.data.logList, totalCount: mockUpdatesLogs.data.totalCount })
            .mockResolvedValueOnce({ contents: mockVoicesLogs.data.logList, totalCount: mockVoicesLogs.data.totalCount })
            .mockResolvedValueOnce({ contents: mockExtrasLogs.data.logList, totalCount: mockExtrasLogs.data.totalCount })

        const result = await getAllSyncLogLists(mockLimit)

        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                [SYNC_ALL]: mockAllLogs.data,
                [SYNC_UPDATES]: mockUpdatesLogs.data,
                [SYNC_VOICES]: mockVoicesLogs.data,
                [SYNC_EXTRAS]: mockExtrasLogs.data
            }
        })
    })

    // 取得成功（空のデータの場合）
    it('should handle empty data for all categories', async () => {
        const mockLimit = 10
        const emptyData = {
            logList: [],
            totalCount: 0
        }

        // 全てのカテゴリで空のデータを返す
        mockClientGet
            .mockResolvedValueOnce({ contents: [], totalCount: 0 })
            .mockResolvedValueOnce({ contents: [], totalCount: 0 })
            .mockResolvedValueOnce({ contents: [], totalCount: 0 })
            .mockResolvedValueOnce({ contents: [], totalCount: 0 })
            .mockResolvedValueOnce({ contents: [], totalCount: 0 })

        const result = await getAllSyncLogLists(mockLimit)

        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                [SYNC_ALL]: emptyData,
                [SYNC_UPDATES]: emptyData,
                [SYNC_VOICES]: emptyData,
                [SYNC_EXTRAS]: emptyData
            }
        })
    })

    // 取得失敗（例外発生）
    it('should handle exception and return error response', async () => {
        const mockLimit = 10

        mockClientGet.mockRejectedValue(
            new Error('Client error')
        )

        const result = await getAllSyncLogLists(mockLimit)

        expect(result.success).toBe(false)
        expect(result.error).toBe(FETCH_ALL_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Paginated Sync Log By Category Test
==================================== */
describe('getPaginatedSyncLogByCategory', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const { client } = await import('@/lib/clients/microcms/client')
        vi.mocked(client.get).mockImplementation(mockClientGet)
    })

    // 取得成功
    it('should return paginated data for first page', async () => {
        const mockParams = {
            page: 1,
            limit: 5,
            category: SYNC_UPDATES
        }
        
        const mockData = {
            contents: [
                { id: 'log-1', title: 'Log 1', category: 'Updates' },
                { id: 'log-2', title: 'Log 2', category: 'Updates' }
            ],
            totalCount: 12
        }
    
        mockClientGet.mockResolvedValue(mockData)
    
        const result = await getPaginatedSyncLogByCategory(mockParams)
    
        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: 5,
                offset: 0,
                filters: 'category[equals]updates'
            }
        })
    
        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                logList: mockData.contents,
                totalCount: 12,
                totalPages: 3,
                currentPage: 1,
                hasNextPage: true,
                hasPrevPage: false
            }
        })
    })

    // 取得成功（2ページ目）
    it('should return paginated data for second page', async () => {
        const mockParams = {
            page: 2,
            limit: 3,
            category: SYNC_VOICES
        }
        
        const mockData = {
            contents: [
                { id: 'log-3', title: 'Log 3', category: 'Voices' },
                { id: 'log-4', title: 'Log 4', category: 'Voices' }
            ],
            totalCount: 8
        }
    
        mockClientGet.mockResolvedValue(mockData)
    
        const result = await getPaginatedSyncLogByCategory(mockParams)
    
        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: 3,
                offset: 3,
                filters: 'category[equals]voices'
            }
        })
    
        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                logList: mockData.contents,
                totalCount: 8,
                totalPages: 3,
                currentPage: 2,
                hasNextPage: true,
                hasPrevPage: true
            }
        })
    })

    // 取得成功（最後のページ）
    it('should return paginated data for last page', async () => {
        const mockParams = {
            page: 3,
            limit: 5,
            category: SYNC_EXTRAS
        }
        
        const mockData = {
            contents: [
                { id: 'log-5', title: 'Log 5', category: 'Extras' }
            ],
            totalCount: 11
        }

        mockClientGet.mockResolvedValue(mockData)

        const result = await getPaginatedSyncLogByCategory(mockParams)

        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                logList: mockData.contents,
                totalCount: 11,
                totalPages: 3,
                currentPage: 3,
                hasNextPage: false,
                hasPrevPage: true
            }
        })
    })

    // 取得成功（All カテゴリ）
    it('should return paginated data for All category', async () => {
        const mockParams = {
            page: 1,
            limit: 10,
            category: SYNC_ALL
        }
        
        const mockData = {
            contents: [
                { id: 'log-1', title: 'Log 1', category: 'All' }
            ],
            totalCount: 1
        }

        mockClientGet.mockResolvedValue(mockData)

        const result = await getPaginatedSyncLogByCategory(mockParams)

        expect(mockClientGet).toHaveBeenCalledWith({
            endpoint: LOG_ENDPOINT,
            queries: {
                limit: 10,
                offset: 0
            }
        })

        expect(result).toEqual({
            success: true,
            error: null,
            data: {
                logList: mockData.contents,
                totalCount: 1,
                totalPages: 1,
                currentPage: 1,
                hasNextPage: false,
                hasPrevPage: false
            }
        })
    })

    // 取得失敗（例外発生）
    it('should handle exception and return error response', async () => {
        const mockParams = {
            page: 1,
            limit: 5,
            category: SYNC_UPDATES
        }

        mockClientGet.mockRejectedValue(new Error('Client error'))

        const result = await getPaginatedSyncLogByCategory(mockParams)

        expect(result).toEqual({
            success: false,
            error: FETCH_FAILED,
            data: null
        })
    })
})