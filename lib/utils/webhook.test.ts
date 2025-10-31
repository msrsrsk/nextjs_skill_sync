import { describe, it, expect, vi, beforeEach } from "vitest"
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers"
import { NextRequest } from "next/server"
import crypto from "crypto"

import { 
    verifyWebhookSignature,
    verifySupabaseWebhookAuth
} from "@/lib/utils/webhook"

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        webhooks: {
            constructEvent: vi.fn()
        }
    }
}))

vi.mock('@/lib/utils/security', () => ({
    verifyHMACSignature: vi.fn()
}))

vi.mock('next/headers', () => ({
    headers: vi.fn()
}))

const getMockHeaders = async () => {
    const { headers } = await import('next/headers')
    return vi.mocked(headers)
}

const getMockStripe = async () => {
    const { stripe } = await import('@/lib/clients/stripe/client')
    return vi.mocked(stripe)
}

const getMockSecurity = async () => {
    const { verifyHMACSignature } = await import('@/lib/utils/security')
    return vi.mocked(verifyHMACSignature)
}

/* ==================================== 
    verifyWebhookSignature Test
==================================== */
describe('verifyHMACSignature', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        process.env.STRIPE_SIGNATURE_HEADER = 'test-signature'
    })

    // 認証成功
    it('should verify webhook signature successfully', async () => {
        const mockHeaders = await getMockHeaders()
        const mockStripe = await getMockStripe()
        
        const mockRequest = {
            text: vi.fn().mockResolvedValue('{"type": "payment_intent.succeeded", "data": {}}')
        }

        const mockEvent = {
            type: 'payment_intent.succeeded',
            data: {}
        }

        const signature = 'test_signature'
        const endpointSecret = 'test_endpoint_secret'
        const errorMessage = 'Verification failed'

        mockHeaders.mockReturnValue({
            get: vi.fn().mockReturnValue(signature)
        } as unknown as ReadonlyHeaders)

        ;(mockStripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockEvent)

        const result = await verifyWebhookSignature({
            request: mockRequest as unknown as NextRequest,
            endpointSecret,
            errorMessage
        })

        expect(mockHeaders().get).toHaveBeenCalledWith('test-signature')
        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
            '{"type": "payment_intent.succeeded", "data": {}}',
            signature,
            endpointSecret
        )
        expect(result).toEqual(mockEvent)
    })

    // 署名がない場合
    it('should throw error when signature is not found', async () => {
        const mockHeaders = await getMockHeaders()
        
        const mockRequest = {
            text: vi.fn()
        } as unknown as NextRequest

        const endpointSecret = 'test_endpoint_secret'
        const errorMessage = 'Verification failed'

        mockHeaders.mockReturnValue({
            get: vi.fn().mockReturnValue(null)
        } as unknown as ReadonlyHeaders)

        await expect(verifyWebhookSignature({
            request: mockRequest,
            endpointSecret,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockRequest.text).not.toHaveBeenCalled()
    })

    // endpointSecret がない場合
    it('should throw error when endpointSecret is not provided', async () => {
        const mockHeaders = await getMockHeaders()
        
        const mockRequest = {
            text: vi.fn()
        } as unknown as NextRequest

        const signature = 'test_signature'
        const endpointSecret = ''
        const errorMessage = 'Verification failed'

        mockHeaders.mockReturnValue({
            get: vi.fn().mockReturnValue(signature)
        } as unknown as ReadonlyHeaders)

        await expect(verifyWebhookSignature({
            request: mockRequest,
            endpointSecret,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockRequest.text).not.toHaveBeenCalled()
    })

    // stripe.webhooks.constructEvent が失敗する場合
    it('should throw error when constructEvent fails', async () => {
        const mockHeaders = await getMockHeaders()
        const mockStripe = await getMockStripe()
        
        const mockRequest = {
            text: vi.fn().mockResolvedValue('invalid body')
        } as unknown as NextRequest

        const signature = 'test_signature'
        const endpointSecret = 'test_endpoint_secret'
        const errorMessage = 'Verification failed'

        mockHeaders.mockReturnValue({
            get: vi.fn().mockReturnValue(signature)
        } as unknown as ReadonlyHeaders)

        ;(mockStripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
            throw new Error('Invalid signature')
        })

        await expect(verifyWebhookSignature({
            request: mockRequest,
            endpointSecret,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockHeaders().get).toHaveBeenCalledWith('test-signature')
        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
            'invalid body',
            signature,
            endpointSecret
        )
    })

    // request.text() がエラーを投げる場合
    it('should propagate error when request.text() fails', async () => {
        const mockHeaders = await getMockHeaders()
        
        const mockRequest = {
            text: vi.fn().mockRejectedValue(new Error('Request error'))
        } as unknown as NextRequest

        const signature = 'test_signature'
        const endpointSecret = 'test_endpoint_secret'
        const errorMessage = 'Verification failed'

        mockHeaders.mockReturnValue({
            get: vi.fn().mockReturnValue(signature)
        } as unknown as ReadonlyHeaders)

        await expect(verifyWebhookSignature({
            request: mockRequest,
            endpointSecret,
            errorMessage
        })).rejects.toThrow('Request error')
    })

    // 環境変数が設定されていない場合
    it('should handle missing STRIPE_SIGNATURE_HEADER environment variable', async () => {
        const mockHeaders = await getMockHeaders()
        
        const originalEnv = process.env.STRIPE_SIGNATURE_HEADER
        delete process.env.STRIPE_SIGNATURE_HEADER

        const mockRequest = {
            text: vi.fn()
        } as unknown as NextRequest

        const endpointSecret = 'test_endpoint_secret'
        const errorMessage = 'Verification failed'

        mockHeaders.mockReturnValue({
            get: vi.fn().mockReturnValue(null)
        } as unknown as ReadonlyHeaders)

        await expect(verifyWebhookSignature({
            request: mockRequest,
            endpointSecret,
            errorMessage
        })).rejects.toThrow(errorMessage)

        process.env.STRIPE_SIGNATURE_HEADER = originalEnv
    })

    // 複数のイベントタイプをテスト
    it('should handle different event types', async () => {
        const mockHeaders = await getMockHeaders()
        const mockStripe = await getMockStripe()
        
        const eventTypes = [
            'payment_intent.succeeded',
            'payment_intent.payment_failed',
            'customer.subscription.created'
        ]

        for (const eventType of eventTypes) {
            vi.clearAllMocks()

            const mockRequest = {
                text: vi.fn().mockResolvedValue(`{"type": "${eventType}", "data": {}}`)
            } as unknown as NextRequest

            const mockEvent = {
                type: eventType,
                data: {}
            }

            const signature = 'test_signature'
            const endpointSecret = 'test_endpoint_secret'
            const errorMessage = 'Verification failed'

            mockHeaders.mockReturnValue({
                get: vi.fn().mockReturnValue(signature)
            } as unknown as ReadonlyHeaders)

            ;(mockStripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockEvent)

            const result = await verifyWebhookSignature({
                request: mockRequest,
                endpointSecret,
                errorMessage
            })

            expect(result.type).toBe(eventType)
        }
    })
})

/* ==================================== 
    verifySupabaseWebhookAuth Test
==================================== */
describe('verifySupabaseWebhookAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        process.env.SUPABASE_WEBHOOK_SECRET_KEY = 'test_secret_key'
    })
    
    // 認証成功
    it('should verify Supabase webhook auth successfully', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()
        
        const payload = JSON.stringify({
            record: { id: '1', name: 'test' },
            old_record: { id: '1', name: 'old' },
            type: 'INSERT'
        })

        const secret = process.env.SUPABASE_WEBHOOK_SECRET_KEY as string
        
        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const signatureHeader = hmac.digest('base64')

        const mockRequest = {
            text: vi.fn().mockResolvedValue(payload)
        } as unknown as NextRequest

        const authHeader = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`
        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn((name: string) => {
                if (name === 'authorization') return authHeader
                if (name === 'x-webhook-signature') return signatureHeader
                return null
            })
        } as unknown as ReadonlyHeaders)

        mockSecurity.mockResolvedValue(true)

        const result = await verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockHeaders).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledWith({
            payload,
            signature: signatureHeader,
            secret: process.env.SUPABASE_WEBHOOK_SECRET_KEY
        })
        expect(result).toEqual({
            record: { id: '1', name: 'test' },
            old_record: { id: '1', name: 'old' },
            type: 'INSERT'
        })

        mockSecurity.mockRestore()
    })

    // authorization ヘッダーが一致しない場合
    it('should throw error when authorization header does not match', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()
        
        const mockRequest = {
            text: vi.fn().mockResolvedValue('{}')
        } as unknown as NextRequest

        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn((name: string) => {
                if (name === 'authorization') return 'Bearer wrong_secret'
                if (name === 'x-webhook-signature') return 'test_signature'
                return null
            })
        } as unknown as ReadonlyHeaders)

        await expect(verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledTimes(0)
    })

    // authorization ヘッダーが null の場合
    it('should throw error when authorization header is null', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()

        const mockRequest = {
            text: vi.fn().mockResolvedValue('{}')
        } as unknown as NextRequest

        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn((name: string) => {
                if (name === 'authorization') return null
                if (name === 'x-webhook-signature') return 'test_signature'
                return null
            })
        } as unknown as ReadonlyHeaders)

        await expect(verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledTimes(0)
    })

    // verifyHMACSignature が false を返す場合（署名が無効）
    it('should throw error when HMAC signature is invalid', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()
        
        const payload = JSON.stringify({
            record: { id: '1' },
            old_record: null,
            type: 'UPDATE'
        })

        const mockRequest = {
            text: vi.fn().mockResolvedValue(payload)
        } as unknown as NextRequest

        const authHeader = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`
        const signatureHeader = 'invalid_signature'
        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn((name: string) => {
                if (name === 'authorization') return authHeader
                if (name === 'x-webhook-signature') return signatureHeader
                return null
            })
        } as unknown as ReadonlyHeaders)

        await expect(verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledWith({
            payload,
            signature: signatureHeader,
            secret: process.env.SUPABASE_WEBHOOK_SECRET_KEY
        })
    })

    // x-webhook-signature ヘッダーが null の場合
    it('should throw error when x-webhook-signature header is null', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()
        
        const payload = JSON.stringify({
            record: { id: '1' },
            old_record: null,
            type: 'UPDATE'
        })

        const mockRequest = {
            text: vi.fn().mockResolvedValue(payload)
        } as unknown as NextRequest

        const authHeader = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`
        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn((name: string) => {
                if (name === 'authorization') return authHeader
                if (name === 'x-webhook-signature') return null
                return null
            })
        } as unknown as ReadonlyHeaders)

        mockSecurity.mockResolvedValue(false)

        await expect(verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })).rejects.toThrow(errorMessage)

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledWith({
            payload,
            signature: null,
            secret: process.env.SUPABASE_WEBHOOK_SECRET_KEY
        })

        mockSecurity.mockRestore()
    })

    // JSON パースエラーの場合
    it('should throw error when JSON parse fails', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()
        
        const invalidPayload = 'invalid json'
        const mockRequest = {
            text: vi.fn().mockResolvedValue(invalidPayload)
        } as unknown as NextRequest

        const authHeader = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`
        const signatureHeader = 'test_signature'
        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn((name: string) => {
                if (name === 'authorization') return authHeader
                if (name === 'x-webhook-signature') return signatureHeader
                return null
            })
        } as unknown as ReadonlyHeaders)

        mockSecurity.mockResolvedValue(true)

        await expect(verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })).rejects.toThrow()

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockSecurity).toHaveBeenCalledWith({
            payload: invalidPayload,
            signature: signatureHeader,
            secret: process.env.SUPABASE_WEBHOOK_SECRET_KEY
        })

        mockSecurity.mockRestore()
    })

    // request.text() がエラーを投げる場合
    it('should propagate error when request.text() fails', async () => {
        const mockHeaders = await getMockHeaders()
        const mockSecurity = await getMockSecurity()
        
        const mockRequest = {
            text: vi.fn().mockRejectedValue(new Error('Request error'))
        } as unknown as NextRequest

        const errorMessage = 'Verification failed'

        mockHeaders.mockResolvedValue({
            get: vi.fn().mockReturnValue(null)
        } as unknown as ReadonlyHeaders)

        mockSecurity.mockResolvedValue(true)

        await expect(verifySupabaseWebhookAuth({
            request: mockRequest,
            errorMessage
        })).rejects.toThrow('Request error')

        expect(mockRequest.text).toHaveBeenCalledTimes(1)
        expect(mockSecurity).not.toHaveBeenCalled()
        expect(mockHeaders).not.toHaveBeenCalled()

        mockSecurity.mockRestore()
    })
})