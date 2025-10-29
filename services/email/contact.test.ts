import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { receiveContactEmail } from "@/services/email/contact"
import { contactEmailTemplate } from "@/lib/templates/email/contact"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

const { CONTACT_SEND_FAILED } = EMAIL_ERROR;

const mockResendSend = vi.fn()
const mockResend = {
    emails: {
        send: mockResendSend
    }
}

vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => mockResend)
}))

vi.mock('@/lib/templates/email/contact', () => ({
    contactEmailTemplate: vi.fn()
}))

/* ==================================== 
    receiveContactEmail Test
==================================== */
describe('receiveContactEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_CONTACT_API_KEY', 'test-api-key')
        vi.stubEnv('CONTACT_EMAIL', 'test@example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    const commonFormData = new FormData()
    commonFormData.append('lastName', '田中')
    commonFormData.append('firstName', '太郎')
    commonFormData.append('email', 'tanaka@example.com')
    commonFormData.append('message', 'お問い合わせ内容です')
    commonFormData.append('userId', 'user-123')
    commonFormData.append('userName', '田中太郎')

    // 送信成功（ファイル無し）
    it('should send contact email successfully without files', async () => {
        const mockHtml = '<html>Contact email template</html>'
        vi.mocked(contactEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await receiveContactEmail(commonFormData)

        expect(result).toEqual({
            success: true,
            error: null
        })
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'contact@skill-sync.site',
            to: ['test@example.com'],
            subject: '【Skill Sync】のサイトからお問い合わせが届きました',
            html: mockHtml,
            attachments: []
        })
        expect(contactEmailTemplate).toHaveBeenCalledWith({
            userId: 'user-123',
            userName: '田中太郎',
            lastName: '田中',
            firstName: '太郎',
            email: 'tanaka@example.com',
            message: 'お問い合わせ内容です',
            files: []
        })
    })

    // 送信成功（ファイル有り）
    it('should send contact email successfully with files', async () => {
        const file1Content = 'file1 content'
        const file2Content = 'file2 content'
        
        const mockFile1 = new File([file1Content], 'document1.pdf', { type: 'application/pdf' })
        const mockFile2 = new File([file2Content], 'image1.jpg', { type: 'image/jpeg' })
        
        const mockArrayBuffer1 = vi.fn().mockResolvedValue(
            new TextEncoder().encode(file1Content).buffer
        )
        const mockArrayBuffer2 = vi.fn().mockResolvedValue(
            new TextEncoder().encode(file2Content).buffer
        )
        
        Object.defineProperty(mockFile1, 'arrayBuffer', {
            value: mockArrayBuffer1,
            writable: true,
            configurable: true
        })
        
        Object.defineProperty(mockFile2, 'arrayBuffer', {
            value: mockArrayBuffer2,
            writable: true,
            configurable: true
        })
        
        commonFormData.append('files', mockFile1)
        commonFormData.append('files', mockFile2)

        const mockHtml = '<html>Contact email with files</html>'
        vi.mocked(contactEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-456' })

        const result = await receiveContactEmail(commonFormData)

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(mockArrayBuffer1).toHaveBeenCalled()
        expect(mockArrayBuffer2).toHaveBeenCalled()
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'contact@skill-sync.site',
            to: ['test@example.com'],
            subject: '【Skill Sync】のサイトからお問い合わせが届きました',
            html: mockHtml,
            attachments: [
                {
                    filename: 'document1.pdf',
                    content: Buffer.from(file1Content).toString('base64')
                },
                {
                    filename: 'image1.jpg',
                    content: Buffer.from(file2Content).toString('base64')
                }
            ]
        })
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await receiveContactEmail(commonFormData)

        expect(result).toEqual({
            success: false,
            error: CONTACT_SEND_FAILED
        })
    })

    // 送信失敗（ファイルの処理エラー）
    it('should handle file processing error', async () => {
        const invalidFile = {
            name: 'invalid.txt',
            arrayBuffer: vi.fn().mockRejectedValue(new Error('File processing error'))
        } as unknown as File
        commonFormData.append('files', invalidFile)

        const result = await receiveContactEmail(commonFormData)

        expect(result).toEqual({
            success: false,
            error: CONTACT_SEND_FAILED
        })
    })
})