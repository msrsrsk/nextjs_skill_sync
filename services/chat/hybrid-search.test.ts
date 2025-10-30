import { describe, it, expect, vi, beforeEach } from "vitest"

import { CHAT_SOURCE, CHAT_CONFIG } from "@/constants/index"

const { RULE_BASED, EMBEDDING_SEARCH, STAFF_CONFIRMING } = CHAT_SOURCE;
const { DEFAULT_HUMAN_RESPONSE } = CHAT_CONFIG;

vi.mock('@/services/chat/rule-based', () => ({
    getRuleBasedAnswer: vi.fn(),
}))

vi.mock('@/services/chat/embedding', () => ({
    findSimilarTemplate: vi.fn(),
}))

const getHandle = async () => {
    const { handleChatMessage } = await import('@/services/chat/hybrid-search')
    return handleChatMessage
}

const getRuleBased = async () => {
    const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')
    return vi.mocked(getRuleBasedAnswer)
}

const getEmbedding = async () => {
    const { findSimilarTemplate } = await import('@/services/chat/embedding')
    return vi.mocked(findSimilarTemplate)
}

/* ==================================== 
    handleChatMessage Test
==================================== */
describe('handleChatMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
  
    // ENABLE_RULE_BASED が true の場合
    it('should return answer when rule-based is hit', async () => {
        const handle = await getHandle()
        const rule = await getRuleBased()
    
        rule.mockReturnValue({ 
            success: true,
            message: 'rule hit',
            matchedKeyword: 'rule',
            source: RULE_BASED,
        })

        const result = await handle('message')
        
        expect(result).toEqual({
            success: true,
            matchedKeyword: 'rule',
            message: 'rule hit',
            isAutoReply: true,
            source: RULE_BASED,
        })
    })
  
    // ENABLE_EMBEDDING が true の場合
    it('should return answer when embedding is hit', async () => {
        const handle = await getHandle()
        const rule = await getRuleBased()
        const emb = await getEmbedding()
    
        rule.mockReturnValue({ success: false, message: null })
        emb.mockResolvedValue({ success: true, error: null, message: 'embed hit' })
    
        const result = await handle('message')
        expect(result).toEqual({
            success: true,
            message: 'embed hit',
            isAutoReply: true,
            source: EMBEDDING_SEARCH,
        })
    })
  
    // ENABLE_RULE_BASED と ENABLE_EMBEDDING が false の場合
    it('should return default answer when both rule-based and embedding are not hit', async () => {
        const handle = await getHandle()
        const rule = await getRuleBased()
        const emb = await getEmbedding()

        rule.mockReturnValue({ success: false, message: null })
        emb.mockResolvedValue({ success: false, error: null, message: null })

        const result = await handle('message')

        expect(result).toEqual({
            success: true,
            message: DEFAULT_HUMAN_RESPONSE,
            isAutoReply: false,
            source: STAFF_CONFIRMING,
        })
    })

    // Embedding エラーの場合
    it('should return default answer when embedding is error', async () => {
        const handle = await getHandle()
        const rule = await getRuleBased()
        const emb = await getEmbedding()
    
        rule.mockReturnValue({ success: false, message: null })
        emb.mockResolvedValue({ success: false, error: 'OPENAI error', message: null })
    
        const res = await handle('msg')
        expect(res).toEqual({
            success: true,
            message: DEFAULT_HUMAN_RESPONSE,
            isAutoReply: false,
            source: STAFF_CONFIRMING,
        })
    })
})