import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { sendVerificationEmail } from "@/services/email/auth/verification"
import { verificationEmailTemplate } from "@/lib/templates/email/verification"
import { getVerificationEmailConfig } from "@/services/email/auth/config"
import { EMAIL_VERIFICATION_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;
const { CREATE_ACCOUNT_TYPE, RESET_PASSWORD_TYPE, UPDATE_EMAIL_TYPE } = EMAIL_VERIFICATION_TYPES;

const { AUTH_SEND_FAILED } = EMAIL_ERROR;

const mockResendSend = vi.fn()
const mockResend = {
    emails: {
        send: mockResendSend
    }
}

vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => mockResend)
}))

vi.mock('@/lib/templates/email/verification', () => ({
    verificationEmailTemplate: vi.fn()
}))

vi.mock('@/services/email/auth/config', () => ({
    getVerificationEmailConfig: vi.fn()
}))

/* ==================================== 
    sendVerificationEmail Test
==================================== */
describe('sendVerificationEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_AUTH_VERIFY_EMAIL_API_KEY', 'test-api-key')
        vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    const mockEmail = 'test@example.com'
    const mockToken = 'test-token-123'

    // 送信成功（アカウント作成の場合）
    it('should send verification email successfully for CREATE_ACCOUNT_TYPE', async () => {
        const mockConfig = {
            url: 'https://example.com/verify-account?token=test-token-123',
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        }
        const mockHtml = '<html>Verification email template</html>'

        vi.mocked(getVerificationEmailConfig).mockReturnValue(mockConfig)
        vi.mocked(verificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: CREATE_ACCOUNT_TYPE
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(getVerificationEmailConfig).toHaveBeenCalledWith(CREATE_ACCOUNT_TYPE, mockToken)
        expect(verificationEmailTemplate).toHaveBeenCalledWith(mockConfig)
        
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'noreply@skill-sync.site',
            to: mockEmail,
            subject: mockConfig.subject,
            html: mockHtml
        })
    })

    // 送信成功（パスワードリセットの場合）
    it('should send verification email successfully for RESET_PASSWORD_TYPE', async () => {
        const mockConfig = {
            url: 'https://example.com/reset-password?token=test-token-123',
            subject: '【Skill Sync】パスワードリセットのメールアドレス認証のご案内'
        }
        const mockHtml = '<html>Password reset email template</html>'

        vi.mocked(getVerificationEmailConfig).mockReturnValue(mockConfig)
        vi.mocked(verificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-456' })

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: RESET_PASSWORD_TYPE
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(getVerificationEmailConfig).toHaveBeenCalledWith(RESET_PASSWORD_TYPE, mockToken)
    })

    // 送信成功（メールアドレス変更の場合）
    it('should send verification email successfully for UPDATE_EMAIL_TYPE', async () => {
        const mockConfig = {
            url: 'https://example.com/update-email?token=test-token-123',
            subject: '【Skill Sync】メールアドレス変更のアドレス認証のご案内'
        }
        const mockHtml = '<html>Email update template</html>'

        vi.mocked(getVerificationEmailConfig).mockReturnValue(mockConfig)
        vi.mocked(verificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-789' })

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: UPDATE_EMAIL_TYPE
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(getVerificationEmailConfig).toHaveBeenCalledWith(UPDATE_EMAIL_TYPE, mockToken)
    })

    // 送信失敗（getVerificationEmailConfig でエラー）
    it('should handle getVerificationEmailConfig error', async () => {
        vi.mocked(getVerificationEmailConfig).mockImplementation(() => {
            throw new Error('Invalid configuration')
        })

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: CREATE_ACCOUNT_TYPE
        })

        expect(result).toEqual({
            success: false,
            error: AUTH_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（テンプレート関数内でエラー）
    it('should handle verificationEmailTemplate error', async () => {
        const mockConfig = {
            url: 'https://example.com/verify-account?token=test-token-123',
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        }

        vi.mocked(getVerificationEmailConfig).mockReturnValue(mockConfig)
        vi.mocked(verificationEmailTemplate).mockImplementation(() => {
            throw new Error('Template error')
        })

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: CREATE_ACCOUNT_TYPE
        })

        expect(result).toEqual({
            success: false,
            error: AUTH_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        const mockConfig = {
            url: 'https://example.com/verify-account?token=test-token-123',
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        }
        const mockHtml = '<html>Template</html>'

        vi.mocked(getVerificationEmailConfig).mockReturnValue(mockConfig)
        vi.mocked(verificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: CREATE_ACCOUNT_TYPE
        })

        expect(result).toEqual({
            success: false,
            error: AUTH_SEND_FAILED
        })
    })

    // 送信失敗（環境変数未設定）
    it('should handle missing RESEND_AUTH_VERIFY_EMAIL_API_KEY', async () => {
        vi.stubEnv('RESEND_AUTH_VERIFY_EMAIL_API_KEY', undefined)
        
        const mockConfig = {
            url: 'https://example.com/verify-account?token=test-token-123',
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        }
        const mockHtml = '<html>Template</html>'

        vi.mocked(getVerificationEmailConfig).mockReturnValue(mockConfig)
        vi.mocked(verificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockRejectedValue(new Error('Missing API key'))

        const result = await sendVerificationEmail({
            email: mockEmail,
            token: mockToken,
            type: CREATE_ACCOUNT_TYPE
        })

        expect(result).toEqual({
            success: false,
            error: AUTH_SEND_FAILED
        })
    })
})