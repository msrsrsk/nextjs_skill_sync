import { describe, it, expect, vi, beforeEach } from "vitest"

import { getRuleBasedAnswer } from "@/services/chat/rule-based"
import { CHAT_TEMPLATES } from "@/data/chats"
import { CHAT_SOURCE } from "@/constants/index"

const { RULE_BASED } = CHAT_SOURCE;

vi.mock('@/data/chats', () => ({
    CHAT_TEMPLATES: [
        { id: 't1', keywords: ['返品', '返金'], answer: '返品・返金はこちら' },
        { id: 't2', keywords: ['配送', '遅延'], answer: '配送のご案内' },
    ],
}))

const getRuleBased = async () => {
    const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')
    return vi.mocked(getRuleBasedAnswer)
}

/* ==================================== 
    getRuleBasedAnswer Test
==================================== */
describe('getRuleBasedAnswer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetModules()
    })
  
    // キーワードにヒットした場合
    it('should return answer, matched keyword, and source when keyword is hit', async () => {
        const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')

        const result = getRuleBasedAnswer('配送について')
        
        expect(result).toEqual({
            success: true,
            message: '配送のご案内',
            matchedKeyword: '配送',
            source: RULE_BASED,
        })
    })

    // 複数のキーワードにヒットした場合（最初にヒットしたキーワードを返す）
    it('should return answer, matched keyword, and source when multiple keywords are hit', async () => {
        const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')
        const result = getRuleBasedAnswer('返品・配送について')
        expect(result).toEqual({
            success: true,
            message: '返品・返金はこちら',
            matchedKeyword: '返品',
            source: RULE_BASED,
        })
    })
  
    // ヒット無し
    it('should return failure when no hit', async () => {
        const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')
        const result = getRuleBasedAnswer('関係ない話題')
        expect(result).toEqual({ 
            success: false, 
            message: null 
        })
    })

    // 空文字の場合
    it('should return failure when empty or whitespace only is passed', async () => {
        const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')
        const result = getRuleBasedAnswer('')
        expect(result).toEqual({ 
            success: false, 
            message: null 
        })
    })

    // 空白のみの場合
    it('should return failure when whitespace only is passed', async () => {
        const { getRuleBasedAnswer } = await import('@/services/chat/rule-based')
        const result = getRuleBasedAnswer('　　')
        expect(result).toEqual({ 
            success: false, 
            message: null 
        })
    })
})