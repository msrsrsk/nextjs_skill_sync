import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createVerificationToken, 
    getVerificationTokenAndVerify,
    updatePasswordWithToken,
    deleteVerificationToken
} from "@/services/verification-token/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { VERIFICATION_TOKEN_ERROR, USER_ERROR } = ERROR_MESSAGES;

const { NOT_FOUND_EMAIL_TOKEN, EXPIRED_EMAIL_TOKEN } = VERIFICATION_TOKEN_ERROR;
const { PASSWORD_UPDATE_FAILED } = USER_ERROR;

const mockCreateVerificationToken = vi.fn()
const mockGetVerificationToken = vi.fn()
const mockUpdatePasswordWithToken = vi.fn()
const mockDeleteVerificationToken = vi.fn()

vi.mock('@/repository/verificationToken', () => ({
    createVerificationTokenRepository: () => ({
        createVerificationToken: mockCreateVerificationToken
    }),
    getVerificationTokenRepository: () => ({
        getVerificationToken: mockGetVerificationToken
    }),
    updatePasswordWithTokenRepository: () => ({
        updatePasswordWithToken: mockUpdatePasswordWithToken
    }),
    deleteVerificationTokenRepository: () => ({
        deleteVerificationTokenWithTransaction: mockDeleteVerificationToken
    })
}))

vi.mock('@/services/auth/actions', () => ({
    resetPassword: vi.fn()
}))

/* ==================================== 
    Create Verification Token Test
==================================== */
describe('createVerificationToken', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        verificationData: {
            identifier: 'test@example.com',
            token: 'test_token',
            expires: new Date(),
            password: 'hashed_password',
            userData: '{"lastname": "Test LASTNAME", "firstname": "Test FIRSTNAME"}'
        }
    }

    // 作成成功
    it('should create verification token successfully', async () => {
        mockCreateVerificationToken.mockResolvedValue({ success: true })
  
        const result = await createVerificationToken(commonParams)
    
        expect(result.success).toBe(true)
        expect(result.data).toBe('test_token')
    })
  
    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateVerificationToken.mockResolvedValue(null)
    
        const result = await createVerificationToken(commonParams)
    
        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })

    // 無効なデータ
    it('should handle invalid data', async () => {
        const invalidData = {
            identifier: '',
            token: '',     
            expires: new Date('invalid'),
            password: '',
            userData: ''
        }
        
        const result = await createVerificationToken({ verificationData: invalidData })
        
        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Verification Token And Verify Test
==================================== */
describe('getVerificationTokenAndVerify', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        token: 'test_token',
        notFoundErrorMessage: NOT_FOUND_EMAIL_TOKEN,
        expiredErrorMessage: EXPIRED_EMAIL_TOKEN
    }

    // トークンの取得成功
    it('should get and verify token successfully', async () => {
        mockGetVerificationToken.mockResolvedValue({
            success: true,
            error: null,
            data: {
                token: 'test_token',
                expires: new Date(Date.now() + 3600000), // 1時間後
                identifier: 'test@example.com'
            }
        })

        const result = await getVerificationTokenAndVerify(commonParams)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // トークンの期限切れ
    it('should return error when token is expired', async () => {
        mockGetVerificationToken.mockResolvedValue({
            token: 'test_token',
            expires: new Date(Date.now() - 3600000), // 1時間前（期限切れ）
            identifier: 'test@example.com'
        })
    
        const result = await getVerificationTokenAndVerify(commonParams)
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(EXPIRED_EMAIL_TOKEN)
        expect(result.data).toBeNull()
    })

    // トークンの取得失敗
    it('should return failure when token not found', async () => {
        mockGetVerificationToken.mockResolvedValue(null)

        const result = await getVerificationTokenAndVerify(commonParams)

        expect(result.success).toBe(false)
        expect(result.error).toBe(NOT_FOUND_EMAIL_TOKEN)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Password With Token Test
==================================== */
const getMockResetPassword = async () => {
    const { resetPassword } = await import('@/services/auth/actions')
    return vi.mocked(resetPassword)
}

describe('updatePasswordWithToken', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        token: 'test_token',
        password: 'hashed_password'
    }

    // パスワードの更新成功
    it('should update password successfully', async () => {
        const mockResetPassword = await getMockResetPassword()

        mockGetVerificationToken.mockResolvedValue({
            token: 'test_token',
            expires: new Date(Date.now() + 3600000), // 1時間後
            identifier: 'test@example.com'
        })

        mockResetPassword.mockResolvedValue({
            success: true,
            error: null,
            data: {
                id: 'user_id',
                email: 'test@example.com',
                password: 'hashed_password',
                created_at: new Date(),
                updated_at: new Date(),
                emailVerified: null
            }
        })

        const result = await updatePasswordWithToken(
            commonParams.token, 
            commonParams.password
        )

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // パスワードの更新失敗
    it('should return failure when reset password fails', async () => {
        const mockResetPassword = await getMockResetPassword()

        mockResetPassword.mockResolvedValue({
            success: false,
            error: PASSWORD_UPDATE_FAILED,
            data: null
        })

        const result = await updatePasswordWithToken(
            commonParams.token, 
            commonParams.password
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(PASSWORD_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Delete Verification Token Test
==================================== */
describe('deleteVerificationToken', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        tx: {
            verificationToken: {
                delete: mockDeleteVerificationToken
            }
        } as unknown as TransactionClient,
        token: 'test_token'
    }

    // 認証トークンの削除成功
    it('should delete verification token successfully', async () => {
        mockDeleteVerificationToken.mockResolvedValue({
            success: true
        })

        const result = await deleteVerificationToken({
            tx: commonParams.tx,
            token: commonParams.token
        })

        expect(result.success).toBe(true)
    })

    // 認証トークンの削除失敗
    it('should return failure when delete fails', async () => {
        // 失敗時のモック
        mockDeleteVerificationToken.mockResolvedValue(null)

        const result = await deleteVerificationToken({
            tx: commonParams.tx,
            token: commonParams.token
        })

        expect(result.success).toBe(false)
    })
})