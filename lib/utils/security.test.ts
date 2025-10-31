import { describe, it, expect, vi, beforeEach } from "vitest"
import crypto from "crypto"

import { 
    verifyHMACSignature,
} from "@/lib/utils/security"

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        webhooks: {
            constructEvent: vi.fn()
        }
    }
}))

vi.mock('next/headers', () => ({
    headers: vi.fn()
}))

/* ==================================== 
    verifyHMACSignature Test
==================================== */
describe('verifyHMACSignature', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 正しい署名の場合
    it('should return true for valid HMAC signature', async () => {
        const payload = 'test payload'
        const secret = 'test secret'
        
        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const validSignature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload,
            signature: validSignature,
            secret
        })

        expect(result).toBe(true)
    })

    // 無効な署名の場合
    it('should return false for invalid HMAC signature', async () => {
        const payload = 'test payload'
        const secret = 'test secret'
        const invalidSignature = 'invalid_signature'

        const result = await verifyHMACSignature({
            payload,
            signature: invalidSignature,
            secret
        })

        expect(result).toBe(false)
    })

    // 異なるシークレットでの署名（無効）
    it('should return false when signature is generated with different secret', async () => {
        const payload = 'test payload'
        const secret1 = 'secret1'
        const secret2 = 'secret2'

        const hmac = crypto.createHmac('sha256', secret1)
        hmac.update(payload)
        const signature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload,
            signature,
            secret: secret2
        })

        expect(result).toBe(false)
    })

    // 異なるペイロードでの署名（無効）
    it('should return false when signature is for different payload', async () => {
        const payload1 = 'payload1'
        const payload2 = 'payload2'
        const secret = 'test secret'

        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload1)
        const signature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload: payload2,
            signature,
            secret
        })

        expect(result).toBe(false)
    })

    // 空のペイロード
    it('should handle empty payload', async () => {
        const payload = ''
        const secret = 'test secret'

        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const validSignature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload,
            signature: validSignature,
            secret
        })

        expect(result).toBe(true)
    })

    // 長いペイロード
    it('should handle long payload', async () => {
        const payload = 'a'.repeat(10000) // 長い文字列
        const secret = 'test secret'

        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const validSignature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload,
            signature: validSignature,
            secret
        })

        expect(result).toBe(true)
    })

    // Base64 エンコードされた署名の形式チェック
    it('should handle base64 encoded signatures correctly', async () => {
        const payload = 'test payload'
        const secret = 'test secret'

        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const validSignature = hmac.digest('base64')

        const result1 = await verifyHMACSignature({
            payload,
            signature: validSignature,
            secret
        })
        expect(result1).toBe(true)

        const result2 = await verifyHMACSignature({
            payload,
            signature: 'invalid-base64!@#',
            secret
        })
        expect(result2).toBe(false)
    })

    // 空のシークレット
    it('should handle empty secret', async () => {
        const payload = 'test payload'
        const secret = ''

        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const validSignature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload,
            signature: validSignature,
            secret
        })

        expect(result).toBe(true)
    })

    // 特殊文字を含むペイロード
    it('should handle payload with special characters', async () => {
        const payload = '{"key": "value", "test": "特殊文字@#$%"}'
        const secret = 'test secret'

        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const validSignature = hmac.digest('base64')

        const result = await verifyHMACSignature({
            payload,
            signature: validSignature,
            secret
        })

        expect(result).toBe(true)
    })
})