import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { CHAT_CONFIG } from "@/constants"

vi.mock('@langchain/openai', () => ({
    OpenAIEmbeddings: vi.fn(),
}))

vi.mock('langchain/vectorstores/memory', () => ({
    MemoryVectorStore: {
        fromTexts: vi.fn(),
    },
}))

let findSimilarTemplate: typeof import('@/services/chat/embedding').findSimilarTemplate
let resetMonthlyUsage: typeof import('@/services/chat/embedding').resetMonthlyUsage
let getUsageStats: typeof import('@/services/chat/embedding').getUsageStats

const setOpenAiApiKey = (key: string, val?: string) => {
    if (val === undefined) delete process.env[key]
    else process.env[key] = val
}

const getModule = async () => {
    const mod = await import('@/services/chat/embedding')
    findSimilarTemplate = mod.findSimilarTemplate
    resetMonthlyUsage = mod.resetMonthlyUsage
    getUsageStats = mod.getUsageStats
}

vi.mock('langchain/vectorstores/memory', () => {
    class MockMemoryVectorStore {
      similaritySearchWithScore = vi.fn<
        (query: string, k: number) => Promise<Array<[ { metadata: any }, number ]>>
      >()
    }
  
    const fromTexts = vi.fn<
      (texts: string[], metadatas: any[], embeddings: any) => Promise<MockMemoryVectorStore>
    >(async () => new MockMemoryVectorStore())
  
    const MemoryVectorStore = { fromTexts }
  
    return { MemoryVectorStore }
})

/* ==================================== 
    findSimilarTemplate Test
==================================== */
describe('embedding', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        setOpenAiApiKey('OPENAI_API_KEY', 'test-key')
        await getModule()
        resetMonthlyUsage()
    })
  
    afterEach(() => {
        vi.unstubAllEnvs?.()
    })

    // 作成成功（類似スコアが閾値を超えた場合）
    it('should return answer when similarity score is greater than threshold', async () => {
        const { MemoryVectorStore } = await import('langchain/vectorstores/memory')

        vi.mocked(MemoryVectorStore.fromTexts).mockResolvedValue(
            Object.assign(new (class {
            similaritySearchWithScore = vi.fn().mockResolvedValue([
                [{ metadata: { answer: 'matched answer' } }, CHAT_CONFIG.SIMILARITY_THRESHOLD + 0.1],
            ])
            })())
        )

        const result = await findSimilarTemplate('question')

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.message).toBe('matched answer')
    })
  
    // 作成失敗（APIキー未設定）
    it('should return error when API key is not set', async () => {
        setOpenAiApiKey('OPENAI_API_KEY', undefined)

        const result = await findSimilarTemplate('hello')

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
        expect(result.message).toBeNull()
    })
  
    // 作成失敗（月次上限超過）
    it('should return error when monthly limit is exceeded', async () => {
        const { MemoryVectorStore } = await import('langchain/vectorstores/memory')

        vi.mocked(MemoryVectorStore.fromTexts).mockResolvedValue(
            Object.assign(new (class {
              similaritySearchWithScore = vi.fn().mockResolvedValue([])
            })())
        )

        for (let i = 0; i < CHAT_CONFIG.MONTHLY_LIMIT; i++) {
            await findSimilarTemplate('hello')
        }

        const result = await findSimilarTemplate('hello')

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
        expect(result.message).toBeNull()
    })
  
    // 作成失敗（類似スコアが閾値以下）
    it('should return null when similarity score is less than threshold', async () => {
        const { MemoryVectorStore } = await import('langchain/vectorstores/memory')

        vi.mocked(MemoryVectorStore.fromTexts).mockResolvedValue(
            Object.assign(new (class {
              similaritySearchWithScore = vi.fn().mockResolvedValue([])
            })())
        )

        const result = await findSimilarTemplate('question')

        expect(result.success).toBe(false)
        expect(result.error).toBeNull()
        expect(result.message).toBeNull()
    })
  
    // 作成失敗（例外発生）
    it('should return error when exception occurs', async () => {
        const { MemoryVectorStore } = await import('langchain/vectorstores/memory')

        vi.mocked(MemoryVectorStore.fromTexts).mockRejectedValue(
            new Error('vector error')
        )

        const result = await findSimilarTemplate('question')

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
        expect(result.message).toBeNull()
    })
  
    // 使用量のカウントとリセットの機能確認
    it('should count and reset usage correctly', async () => {
        const { MemoryVectorStore } = await import('langchain/vectorstores/memory')

        vi.mocked(MemoryVectorStore.fromTexts).mockResolvedValue(
            Object.assign(new (class {
              similaritySearchWithScore = vi.fn().mockResolvedValue([])
            })())
        )

        const before = getUsageStats()
        await findSimilarTemplate('q1')
        const mid = getUsageStats()

        resetMonthlyUsage()
        const after = getUsageStats()
        expect(after.currentUsage).toBeLessThanOrEqual(before.currentUsage)
        expect(mid.currentUsage).toBe(before.currentUsage + 1)
    })
})