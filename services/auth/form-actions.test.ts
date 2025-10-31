import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createAccountWithEmailAction,
    sendVerificationEmailAction,
    updatePasswordAction,
    signInWithCredentialsAction,
    signOutAction
} from "@/services/auth/form-actions"
import { mockUserData, mockUser } from "@/__tests__/mocks/domain-mocks"
import { 
    EMAIL_VERIFICATION_PAGE_TYPES,
    EMAIL_VERIFICATION_TYPES,
    UPDATE_PASSWORD_PAGE_TYPES,
    AUTH_TYPES
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { AUTH_ERROR, USER_ERROR, EMAIL_ERROR } = ERROR_MESSAGES;

const { PASSWORD_UPDATE_FAILED } = USER_ERROR;
const { TOKEN_CREATE_FAILED, EMAIL_EXISTS, CREATE_VERIFICATION_TOKEN_PROCESS_FAILED, CREATE_ACCOUNT_MISSING_DATA, EMAIL_MISSING_DATA, RESET_PASSWORD_PROCESS_FAILED, SESSION_NOT_FOUND, PASSWORD_MISSING_DATA, TOKEN_MISSING_DATA, USER_NOT_FOUND, EMAIL_NOT_MATCH, INCORRECT_EMAIL_OR_PASSWORD, SIGN_IN_MISSING_DATA } = AUTH_ERROR;
const { AUTH_SEND_FAILED } = EMAIL_ERROR;
const { EMAIL_RESET_PASSWORD_PAGE, EMAIL_UPDATE_EMAIL_PAGE } = EMAIL_VERIFICATION_PAGE_TYPES;
const { RESET_PASSWORD_TYPE, UPDATE_EMAIL_TYPE } = EMAIL_VERIFICATION_TYPES;
const { RESET_PASSWORD_PAGE, EDIT_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { AUTH_LOGIN, AUTH_REAUTHENTICATE } = AUTH_TYPES;

const mockGetUserByEmail = vi.fn()

vi.mock('@/lib/auth', () => ({
    signIn: vi.fn(),
    signOut: vi.fn()
}))

vi.mock('@/lib/middleware/auth', () => ({
    actionAuth: vi.fn()
}))

vi.mock('@/services/auth/actions', () => ({
    createVerificationTokenWithEmail: vi.fn(),
    createVerificationTokenWithPassword: vi.fn()
}))

vi.mock('@/services/email/auth/verification', () => ({
    sendVerificationEmail: vi.fn()
}))

vi.mock('@/services/user/actions', () => ({
    getUser: vi.fn(),
    updateUserPassword: vi.fn()
}))

vi.mock('@/services/verification-token/actions', () => ({
    updatePasswordWithToken: vi.fn()
}))

vi.mock('@/repository/user', () => ({
    getUserRepository: () => ({
        getUserByEmail: mockGetUserByEmail
    })
}))

const getMockSignIn = async () => {
    const { signIn } = await import('@/lib/auth')
    return vi.mocked(signIn)
}

const getMockSignOut = async () => {
    const { signOut } = await import('@/lib/auth')
    return vi.mocked(signOut)
}

const getMockGetUser = async () => {
    const { getUser } = await import('@/services/user/actions')
    return vi.mocked(getUser)
}

const getMockCreateVerificationTokenWithPassword = async () => {
    const { createVerificationTokenWithPassword } = await import('@/services/auth/actions')
    return vi.mocked(createVerificationTokenWithPassword)
}

const getMockCreateVerificationTokenWithEmail = async () => {
    const { createVerificationTokenWithEmail } = await import('@/services/auth/actions')
    return vi.mocked(createVerificationTokenWithEmail)
}

const getMockSendVerificationEmail = async () => {
    const { sendVerificationEmail } = await import('@/services/email/auth/verification')
    return vi.mocked(sendVerificationEmail)
}

const getMockActionAuth = async () => {
    const { actionAuth } = await import('@/lib/middleware/auth')
    return vi.mocked(actionAuth)
}

const getMockUpdatePasswordWithToken = async () => {
    const { updatePasswordWithToken } = await import('@/services/verification-token/actions')
    return vi.mocked(updatePasswordWithToken)
}

const getMockUpdateUserPassword = async () => {
    const { updateUserPassword } = await import('@/services/user/actions')
    return vi.mocked(updateUserPassword)
}

/* ==================================== 
    createAccountWithEmailAction Test
==================================== */
describe('createAccountWithEmailAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonEmail = 'test@example.com'
    
    const commonFormData = new FormData()
    commonFormData.append('lastname', 'test_lastname')
    commonFormData.append('firstname', 'test_firstname')
    commonFormData.append('email', commonEmail)
    commonFormData.append('password', 'password')

    const commonPrevState = {
        success: true,
        error: null,
        email: undefined,
        timestamp: Date.now()
    }

    // 作成成功
    it('should create account with email successfully', async () => {
        const mockCreateVerificationTokenWithPassword = await getMockCreateVerificationTokenWithPassword()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithPassword.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.email).toBe(commonEmail)
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（既存ユーザーが存在する場合）
    it('should return failure when email already exists', async () => {
        mockGetUserByEmail.mockResolvedValue(mockUserData)

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(EMAIL_EXISTS)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（createVerificationTokenWithPassword で失敗の場合）
    it('should return failure when create verification token with password fails', async () => {
        const mockCreateVerificationTokenWithPassword = await getMockCreateVerificationTokenWithPassword()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithPassword.mockResolvedValue({
            success: false,
            error: CREATE_VERIFICATION_TOKEN_PROCESS_FAILED,
            token: null
        })

        mockSendVerificationEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_VERIFICATION_TOKEN_PROCESS_FAILED)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（!token の場合）
    it('should return failure when create verification token with password returns null token', async () => {
        const mockCreateVerificationTokenWithPassword = await getMockCreateVerificationTokenWithPassword()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithPassword.mockResolvedValue({
            success: true,
            error: null,
            token: null as unknown as string
        })

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(TOKEN_CREATE_FAILED)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（sendVerificationEmail で失敗の場合）
    it('should return failure when send verification email fails', async () => {
        const mockCreateVerificationTokenWithPassword = await getMockCreateVerificationTokenWithPassword()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithPassword.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockResolvedValue({
            success: false,
            error: AUTH_SEND_FAILED
        })

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(AUTH_SEND_FAILED)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（getUserByEmail で例外の場合）
    it('should return failure when getUserByEmail throws an exception', async () => {
        mockGetUserByEmail.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（createVerificationTokenWithPassword で例外の場合）
    it('should return failure when create verification token with password throws an exception', async () => {
        const mockCreateVerificationTokenWithPassword = await getMockCreateVerificationTokenWithPassword()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithPassword.mockRejectedValue(
            new Error('Database error')
        )

        mockSendVerificationEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（sendVerificationEmail で例外の場合）
    it('should return failure when send verification email throws an exception', async () => {
        const mockCreateVerificationTokenWithPassword = await getMockCreateVerificationTokenWithPassword()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithPassword.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createAccountWithEmailAction(commonPrevState, commonFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（formData が空の場合）
    it('should return failure when formData is empty', async () => {
        const emptyFormData = new FormData()

        const result = await createAccountWithEmailAction(commonPrevState, emptyFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ACCOUNT_MISSING_DATA)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })
})

/* ==================================== 
    sendVerificationEmailAction Test
==================================== */
describe('sendVerificationEmailAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonEmail = 'test@example.com'
    
    const commonFormData = new FormData()
    commonFormData.append('email', commonEmail)

    const commonPrevState = {
        success: true,
        error: null,
        email: undefined,
        timestamp: Date.now()
    }

    // 送信成功（EMAIL_RESET_PASSWORD_PAGE で既存ユーザーが存在する場合）
    it('should send verification email successfully when user exists', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(mockUserData)

        mockCreateVerificationTokenWithEmail.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonEmail
        })
        expect(mockCreateVerificationTokenWithEmail).toHaveBeenCalledWith(commonEmail)
        expect(mockSendVerificationEmail).toHaveBeenCalledWith({
            email: commonEmail,
            token: 'test_token',
            type: RESET_PASSWORD_TYPE
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.email).toBe(commonEmail)
        expect(result.timestamp).toBeDefined()
    })

    // 送信成功（EMAIL_UPDATE_EMAIL_PAGE で既存ユーザーが存在しない場合）
    it('should send verification email successfully when user does not exist and type is EMAIL_UPDATE_EMAIL_PAGE', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(null)

        mockCreateVerificationTokenWithEmail.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_UPDATE_EMAIL_PAGE
        )

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonEmail
        })
        expect(mockCreateVerificationTokenWithEmail).toHaveBeenCalledWith(commonEmail)
        expect(mockSendVerificationEmail).toHaveBeenCalledWith({
            email: commonEmail,
            token: 'test_token',
            type: UPDATE_EMAIL_TYPE
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.email).toBe(commonEmail)
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（EMAIL_RESET_PASSWORD_PAGE で既存ユーザーが存在しない場合）
    it('should return failure when type is EMAIL_RESET_PASSWORD_PAGE and user does not exist', async () => {
        mockGetUserByEmail.mockResolvedValue(null)

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonEmail
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(EMAIL_EXISTS)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（UPDATE_EMAIL_TYPE で既存ユーザーが存在する場合）
    it('should return failure when type is UPDATE_EMAIL_TYPE and user exists', async () => {
        mockGetUserByEmail.mockResolvedValue(mockUserData)

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_UPDATE_EMAIL_PAGE
        )

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonEmail
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(EMAIL_EXISTS)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（createVerificationTokenWithEmail で失敗の場合）
    it('should return failure when createVerificationTokenWithEmail fails', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()

        mockGetUserByEmail.mockResolvedValue(mockUserData)

        mockCreateVerificationTokenWithEmail.mockResolvedValue({
            success: false,
            error: 'Token creation failed',
            token: null
        })

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(TOKEN_CREATE_FAILED)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（createVerificationTokenWithEmail で null token を返す場合）
    it('should return failure when createVerificationTokenWithEmail returns null token', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()

        mockGetUserByEmail.mockResolvedValue(mockUserData)

        mockCreateVerificationTokenWithEmail.mockResolvedValue({
            success: true,
            error: null,
            token: null as unknown as string
        })

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(TOKEN_CREATE_FAILED)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（sendVerificationEmail で失敗の場合）
    it('should return failure when sendVerificationEmail fails', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(mockUserData)

        mockCreateVerificationTokenWithEmail.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockResolvedValue({
            success: false,
            error: AUTH_SEND_FAILED
        })

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(AUTH_SEND_FAILED)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（getUserByEmail で例外発生）
    it('should return failure when getUserByEmail throws an exception', async () => {
        mockGetUserByEmail.mockRejectedValue(new Error('Database error'))

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（createVerificationTokenWithEmail で例外発生）
    it('should return failure when createVerificationTokenWithEmail throws an exception', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()

        mockGetUserByEmail.mockResolvedValue(mockUserData)

        mockCreateVerificationTokenWithEmail.mockRejectedValue(
            new Error('Token creation error')
        )

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Token creation error')
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（sendVerificationEmail で例外発生）
    it('should return failure when sendVerificationEmail throws an exception', async () => {
        const mockCreateVerificationTokenWithEmail = await getMockCreateVerificationTokenWithEmail()
        const mockSendVerificationEmail = await getMockSendVerificationEmail()

        mockGetUserByEmail.mockResolvedValue(mockUserData)

        mockCreateVerificationTokenWithEmail.mockResolvedValue({
            success: true,
            error: null,
            token: 'test_token'
        })

        mockSendVerificationEmail.mockRejectedValue(
            new Error('Email send error')
        )

        const result = await sendVerificationEmailAction(
            commonPrevState, 
            commonFormData, 
            EMAIL_RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Email send error')
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })

    // 送信失敗（formData が空の場合）
    it('should return failure when formData is empty', async () => {
        const emptyFormData = new FormData()

        const result = await sendVerificationEmailAction(commonPrevState, emptyFormData, EMAIL_RESET_PASSWORD_PAGE)

        expect(result.success).toBe(false)
        expect(result.error).toBe(EMAIL_MISSING_DATA)
        expect(result.email).toBeUndefined()
        expect(result.timestamp).toBeDefined()
    })
})

/* ==================================== 
    updatePasswordAction Test
==================================== */
describe('updatePasswordAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonPassword = 'new_password'
    const commonToken = 'test_token'

    const commonFormDataForReset = new FormData()
    commonFormDataForReset.append('confirmPassword', commonPassword)
    commonFormDataForReset.append('token', commonToken)

    const commonFormDataForEdit = new FormData()
    commonFormDataForEdit.append('confirmPassword', commonPassword)

    const commonPrevState = {
        success: true,
        error: null,
        email: undefined,
        timestamp: Date.now()
    }

    // 更新成功（type が RESET_PASSWORD_PAGE の場合）
    it('should update password successfully when type is RESET_PASSWORD_PAGE', async () => {
        const mockUpdatePasswordWithToken = await getMockUpdatePasswordWithToken()

        mockUpdatePasswordWithToken.mockResolvedValue({
            success: true,
            error: null,
            data: mockUserData
        })

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForReset,
            RESET_PASSWORD_PAGE
        )

        expect(mockUpdatePasswordWithToken).toHaveBeenCalledWith(
            commonToken,
            commonPassword
        )
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 更新成功（type が EDIT_PASSWORD_PAGE の場合）
    it('should update password successfully when type is EDIT_PASSWORD_PAGE', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserPassword = await getMockUpdateUserPassword()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: mockUserData.id
        })

        mockUpdateUserPassword.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForEdit,
            EDIT_PASSWORD_PAGE
        )

        expect(mockActionAuth).toHaveBeenCalledWith(AUTH_ERROR.SESSION_NOT_FOUND)
        expect(mockUpdateUserPassword).toHaveBeenCalledWith({
            userId: mockUserData.id,
            password: commonPassword
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（updatePasswordWithToken が失敗の場合）
    it('should return failure when updatePasswordWithToken fails', async () => {
        const mockUpdatePasswordWithToken = await getMockUpdatePasswordWithToken()

        mockUpdatePasswordWithToken.mockResolvedValue({
            success: false,
            error: RESET_PASSWORD_PROCESS_FAILED,
            data: null
        })

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForReset,
            RESET_PASSWORD_PAGE
        )

        expect(mockUpdatePasswordWithToken).toHaveBeenCalledWith(
            commonToken,
            commonPassword
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe(RESET_PASSWORD_PROCESS_FAILED)
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（actionAuth が失敗の場合）
    it('should return failure when actionAuth fails', async () => {
        const mockActionAuth = await getMockActionAuth()

        mockActionAuth.mockResolvedValue({
            success: false,
            error: SESSION_NOT_FOUND,
            userId: undefined
        })

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForEdit,
            EDIT_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(SESSION_NOT_FOUND)
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（updateUserPassword が失敗の場合）
    it('should return failure when updateUserPassword fails', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserPassword = await getMockUpdateUserPassword()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: mockUserData.id
        })

        mockUpdateUserPassword.mockResolvedValue({
            success: false,
            error: PASSWORD_UPDATE_FAILED
        })

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForEdit,
            EDIT_PASSWORD_PAGE
        )

        expect(mockUpdateUserPassword).toHaveBeenCalledWith({
            userId: mockUserData.id,
            password: commonPassword
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(PASSWORD_UPDATE_FAILED)
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（updatePasswordWithToken で例外発生）
    it('should return failure when updatePasswordWithToken throws an exception', async () => {
        const mockUpdatePasswordWithToken = await getMockUpdatePasswordWithToken()

        mockUpdatePasswordWithToken.mockRejectedValue(new Error('Database error'))

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForReset,
            RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（actionAuth で例外発生）
    it('should return failure when actionAuth throws an exception', async () => {
        const mockActionAuth = await getMockActionAuth()

        mockActionAuth.mockRejectedValue(new Error('Auth error'))

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForEdit,
            EDIT_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Auth error')
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（updateUserPassword で例外発生）
    it('should return failure when updateUserPassword throws an exception', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserPassword = await getMockUpdateUserPassword()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: mockUserData.id
        })

        mockUpdateUserPassword.mockRejectedValue(new Error('Database error'))

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForEdit,
            EDIT_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（formData が空の場合）
    it('should return failure when formData is empty', async () => {
        const emptyFormData = new FormData()

        const result = await updatePasswordAction(commonPrevState, emptyFormData, EDIT_PASSWORD_PAGE)

        expect(result.success).toBe(false)
        expect(result.error).toBe(PASSWORD_MISSING_DATA)
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗（token が空の場合）
    it('should return failure when token is empty in RESET_PASSWORD_PAGE', async () => {
        const mockUpdatePasswordWithToken = await getMockUpdatePasswordWithToken()

        mockUpdatePasswordWithToken.mockResolvedValue({
            success: false,
            error: TOKEN_MISSING_DATA,
            data: null
        })

        const result = await updatePasswordAction(
            commonPrevState,
            commonFormDataForEdit,
            RESET_PASSWORD_PAGE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(TOKEN_MISSING_DATA)
        expect(result.timestamp).toBeDefined()
    })
})

/* ==================================== 
    signInWithCredentialsAction Test
==================================== */
describe('signInWithCredentialsAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonEmail = 'test@example.com'
    const commonPassword = 'password'

    const commonFormData = new FormData()
    commonFormData.append('email', commonEmail)
    commonFormData.append('password', commonPassword)

    const commonPrevState = {
        success: true,
        error: null,
        timestamp: Date.now()
    }

    // サインイン成功（type が AUTH_LOGIN の場合）
    it('should sign in successfully when type is AUTH_LOGIN', async () => {
        const mockSignIn = await getMockSignIn()

        mockSignIn.mockResolvedValue({
            error: undefined
        })

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_LOGIN
        )

        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
            email: commonEmail,
            password: commonPassword,
            redirect: false
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // サインイン成功（type が AUTH_REAUTHENTICATE の場合）
    it('should sign in successfully when type is AUTH_REAUTHENTICATE', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()
        const mockSignIn = await getMockSignIn()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            user: {
                id: mockUserData.id
            }
        })

        mockGetUser.mockResolvedValue(mockUser)

        mockSignIn.mockResolvedValue({
            error: undefined
        })

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_REAUTHENTICATE
        )

        expect(mockActionAuth).toHaveBeenCalledWith(SESSION_NOT_FOUND)
        expect(mockGetUser).toHaveBeenCalledWith({
            userId: mockUserData.id
        })
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
            email: commonEmail,
            password: commonPassword,
            redirect: false
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（actionAuth が失敗の場合）
    it('should return failure when actionAuth fails in AUTH_REAUTHENTICATE', async () => {
        const mockActionAuth = await getMockActionAuth()

        mockActionAuth.mockResolvedValue({
            success: false,
            error: SESSION_NOT_FOUND,
            user: undefined
        })

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_REAUTHENTICATE
        )

        expect(mockActionAuth).toHaveBeenCalledWith(SESSION_NOT_FOUND)
        expect(result.success).toBe(false)
        expect(result.error).toBe(SESSION_NOT_FOUND)
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（getUser が null の場合）
    it('should return failure when getUser returns null in AUTH_REAUTHENTICATE', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            user: {
                id: mockUserData.id
            }
        })

        mockGetUser.mockResolvedValue(null)

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_REAUTHENTICATE
        )

        expect(mockActionAuth).toHaveBeenCalledWith(SESSION_NOT_FOUND)
        expect(mockGetUser).toHaveBeenCalledWith({
            userId: mockUserData.id
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(USER_NOT_FOUND)
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（AUTH_REAUTHENTICATE で email が一致しない場合）
    it('should return failure when email does not match in AUTH_REAUTHENTICATE', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            user: {
                id: mockUserData.id
            }
        })

        const userDataWithDifferentEmail = {
            ...mockUser,
            email: 'different@example.com'
        }

        mockGetUser.mockResolvedValue(userDataWithDifferentEmail)

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_REAUTHENTICATE
        )

        expect(mockActionAuth).toHaveBeenCalledWith(SESSION_NOT_FOUND)
        expect(mockGetUser).toHaveBeenCalledWith({
            userId: mockUserData.id
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(EMAIL_NOT_MATCH)
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（signIn が error を返す場合）
    it('should return failure when signIn returns error', async () => {
        const mockSignIn = await getMockSignIn()

        mockSignIn.mockResolvedValue({
            error: 'Invalid credentials'
        })

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_LOGIN
        )

        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
            email: commonEmail,
            password: commonPassword,
            redirect: false
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(INCORRECT_EMAIL_OR_PASSWORD)
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（actionAuth で例外発生）
    it('should return failure when actionAuth throws an exception', async () => {
        const mockActionAuth = await getMockActionAuth()

        mockActionAuth.mockRejectedValue(new Error('Auth error'))

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_REAUTHENTICATE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Auth error')
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（getUser で例外発生）
    it('should return failure when getUser throws an exception', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            user: {
                id: mockUserData.id
            }
        })

        mockGetUser.mockRejectedValue(new Error('Database error'))

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_REAUTHENTICATE
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（signIn で例外発生）
    it('should return failure when signIn throws an exception', async () => {
        const mockSignIn = await getMockSignIn()

        mockSignIn.mockRejectedValue(new Error('Sign in error'))

        const result = await signInWithCredentialsAction(
            commonPrevState,
            commonFormData,
            AUTH_LOGIN
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Sign in error')
        expect(result.timestamp).toBeDefined()
    })

    // サインイン失敗（formData が空の場合）
    it('should return failure when formData is empty', async () => {
        const emptyFormData = new FormData()

        const result = await signInWithCredentialsAction(commonPrevState, emptyFormData, AUTH_LOGIN)

        expect(result.success).toBe(false)
        expect(result.error).toBe(SIGN_IN_MISSING_DATA)
        expect(result.timestamp).toBeDefined()
    })
})

/* ==================================== 
    signOutAction Test
==================================== */
describe('signOutAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ログアウト成功
    it('should call signOut successfully', async () => {
        const mockSignOut = await getMockSignOut()

        mockSignOut.mockResolvedValue(undefined)

        await signOutAction()

        expect(mockSignOut).toHaveBeenCalledTimes(1)
        expect(mockSignOut).toHaveBeenCalledWith()
    })

    // ログアウト失敗（signOut で例外発生）
    it('should throw error when signOut throws an exception', async () => {
        const mockSignOut = await getMockSignOut()

        mockSignOut.mockRejectedValue(new Error('Sign out error'))

        await expect(signOutAction()).rejects.toThrow('Sign out error')

        expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
})