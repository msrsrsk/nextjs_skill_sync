import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createVerificationTokenWithPassword,
    verifyEmailToken,
    createVerificationTokenWithEmail,
    resetPassword,
    verifyResetPasswordToken
} from "@/services/auth/actions"
import { mockUserData, mockChatRoom, mockUserProfileData, mockVerificationToken } from "@/__tests__/mocks/domain-mocks"
import { mockCustomer } from "@/__tests__/mocks/stripe-mocks"
import { VERIFY_EMAIL_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { VERIFY_CREATE_ACCOUNT, VERIFY_UPDATE_EMAIL } = VERIFY_EMAIL_TYPES;
const { AUTH_ERROR, VERIFICATION_TOKEN_ERROR, USER_ERROR, USER_PROFILE_ERROR, USER_IMAGE_ERROR, CHAT_ROOM_ERROR, CHAT_ERROR, STRIPE_ERROR, USER_STRIPE_ERROR } = ERROR_MESSAGES;

const { PASSWORD_NOT_FOUND, CREATE_ACCOUNT_PROCESS_FAILED, SESSION_NOT_FOUND, CREATE_VERIFICATION_TOKEN_PROCESS_FAILED } = AUTH_ERROR;
const { NOT_FOUND_EMAIL_TOKEN, EXPIRED_EMAIL_TOKEN, VERIFY_TOKEN_FAILED, NOT_FOUND_PASSWORD_TOKEN, EXPIRED_PASSWORD_TOKEN } = VERIFICATION_TOKEN_ERROR;
const { CREATE_ACCOUNT_FAILED, MAIL_UPDATE_FAILED } = USER_ERROR;
const { CREATE_PROFILE_FAILED } = USER_PROFILE_ERROR;
const { CREATE_ROOM_FAILED } = CHAT_ROOM_ERROR;
const { CREATE_INITIAL_FAILED } = CHAT_ERROR;
const { CUSTOMER_CREATE_FAILED, CUSTOMER_DELETE_FAILED } = STRIPE_ERROR;
const { CUSTOMER_ID_UPDATE_FAILED } = USER_STRIPE_ERROR;

vi.mock('@/lib/clients/prisma/client', () => {
    const $transaction = vi.fn(async (fn: any) => await fn({}))
    return {
        default: {
            $transaction
        }
    }
})

vi.mock('bcryptjs', () => ({
    default: { hash: vi.fn() },
}))

vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn(),
    },
}))

vi.mock('@/services/user/actions', () => ({
    createUser: vi.fn(),
    updateUserEmail: vi.fn(),
    deleteUser: vi.fn(),
    updateUserPasswordWithTransaction: vi.fn(),
}))

vi.mock('@/services/user-profile/actions', () => ({
    createUserProfile: vi.fn(),
}))

vi.mock('@/services/user-image/actions', () => ({
    createUserImage: vi.fn(),
}))

vi.mock('@/services/chat-room/actions', () => ({
    createChatRoom: vi.fn(),
}))

vi.mock('@/services/chat/actions', () => ({
    createInitialChat: vi.fn(),
}))

vi.mock('@/services/verification-token/actions', () => ({
    deleteVerificationToken: vi.fn(),
    createVerificationToken: vi.fn(),
    getVerificationTokenAndVerify: vi.fn(),
}))

vi.mock('@/services/stripe/actions', () => ({
    createStripeCustomer: vi.fn(),
    deleteStripeCustomer: vi.fn(),
}))

vi.mock('@/services/user-stripe/actions', () => ({
    createUserStripeCustomerId: vi.fn(),
}))

vi.mock('@/lib/middleware/auth', () => ({
    actionAuth: vi.fn()
}))

const getBcryptHash = async () => {
    const { default: bcrypt } = await import('bcryptjs')
    return vi.mocked(bcrypt.hash) as ReturnType<typeof vi.fn>
}

const getCryptoRandomBytes = async () => {
    const crypto = await import('crypto')
    return vi.mocked(crypto.default.randomBytes) as ReturnType<typeof vi.fn>
}

const getModule = async () => {
    const mod = await import('@/services/auth/actions')
    return mod.registerUserWithChat
}

const getMockCreateUser = async () => {
    const { createUser } = await import('@/services/user/actions')
    return vi.mocked(createUser)
}

const getMockCreateUserProfile = async () => {
    const { createUserProfile } = await import('@/services/user-profile/actions')
    return vi.mocked(createUserProfile)
}

const getMockCreateUserImage = async () => {
    const { createUserImage } = await import('@/services/user-image/actions')
    return vi.mocked(createUserImage)
}

const getMockCreateChatRoom = async () => {
    const { createChatRoom } = await import('@/services/chat-room/actions')
    return vi.mocked(createChatRoom)
}

const getMockCreateInitialChat = async () => {
    const { createInitialChat } = await import('@/services/chat/actions')
    return vi.mocked(createInitialChat)
}

const getMockDeleteVerificationToken = async () => {
    const { deleteVerificationToken } = await import('@/services/verification-token/actions')
    return vi.mocked(deleteVerificationToken)
}

const getMockCreateVerificationToken = async () => {
    const { createVerificationToken } = await import('@/services/verification-token/actions')
    return vi.mocked(createVerificationToken)
}

const getMockGetVerificationTokenAndVerify = async () => {
    const { getVerificationTokenAndVerify } = await import('@/services/verification-token/actions')
    return vi.mocked(getVerificationTokenAndVerify)
}

const getMockCreateStripeCustomer = async () => {
    const { createStripeCustomer } = await import('@/services/stripe/actions')
    return vi.mocked(createStripeCustomer)
}

const getMockCreateUserStripeCustomerId = async () => {
    const { createUserStripeCustomerId } = await import('@/services/user-stripe/actions')
    return vi.mocked(createUserStripeCustomerId)
}

const getMockActionAuth = async () => {
    const { actionAuth } = await import('@/lib/middleware/auth')
    return vi.mocked(actionAuth)
}

const getMockUpdateUserEmail = async () => {
    const { updateUserEmail } = await import('@/services/user/actions')
    return vi.mocked(updateUserEmail)
}

const getMockDeleteUser = async () => {
    const { deleteUser } = await import('@/services/user/actions')
    return vi.mocked(deleteUser)
}

const getMockDeleteStripeCustomer = async () => {
    const { deleteStripeCustomer } = await import('@/services/stripe/actions')
    return vi.mocked(deleteStripeCustomer)
}

const getMockUpdateUserPasswordWithTransaction = async () => {
    const { updateUserPasswordWithTransaction } = await import('@/services/user/actions')
    return vi.mocked(updateUserPasswordWithTransaction)
}

/* ==================================== 
    Register User With Chat Test
==================================== */
describe('registerUserWithChat', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })
  
    // 作成成功
    it('should register user with chat successfully', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })
    
        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data?.data).toEqual(mockUserData)
    })

    // 作成失敗（createUser が失敗）
    it('should return failure when create user fails', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()

        mockCreateUser.mockResolvedValue({ 
            success: false, 
            error: CREATE_ACCOUNT_FAILED,
            data: null 
        })

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ACCOUNT_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（createUserProfile が失敗）
    it('should return failure when create user profile fails', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null,
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: false, 
            error: CREATE_PROFILE_FAILED,
        })

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_PROFILE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成成功（createUserImage が失敗）
    it('should return failure when create user image fails', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: false, 
            error: USER_IMAGE_ERROR.CREATE_FAILED,
        })

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(USER_IMAGE_ERROR.CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（createChatRoom が失敗）
    it('should return failure when create chat room fails', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: false, 
            error: CREATE_ROOM_FAILED, 
            data: null
        })

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ROOM_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（createInitialChat が失敗）
    it('should return failure when create initial chat exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: false, 
            error: CREATE_INITIAL_FAILED, 
        })

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_INITIAL_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（deleteVerificationToken が失敗）
    it('should return failure when delete verification token exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: false, 
            error: VERIFICATION_TOKEN_ERROR.DELETE_FAILED, 
        })
    
        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data?.data).toEqual(mockUserData)
    })
  
    // 作成失敗（createUser で例外発生）
    it('should return failure when create user exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()

        mockCreateUser.mockRejectedValue(new Error('Database error'))

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成失敗（createUserProfile で例外発生）
    it('should return failure when create user profile exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null,
            data: mockUserData 
        })

        mockCreateUserProfile.mockRejectedValue(new Error('Database error'))

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成成功（createUserImage で例外発生）
    it('should return failure when create user image exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockRejectedValue(new Error('Database error'))

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成失敗（createChatRoom で例外発生）
    it('should return failure when create chat room exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockRejectedValue(new Error('Database error'))

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成失敗（createInitialChat で例外発生）
    it('should return failure when create initial chat exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockRejectedValue(new Error('Database error'))

        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成失敗（deleteVerificationToken で例外発生）
    it('should return failure when delete verification token exception occurs', async () => {
        const registerUserWithChat = await getModule()
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockRejectedValue(new Error('Database error'))
    
        const result = await registerUserWithChat(
            mockUserData,
            mockUserProfileData,
            'token'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Create Verification Token With Password Test
==================================== */
describe('createVerificationTokenWithPassword', () => {
    beforeEach(() => vi.clearAllMocks())
  
    const commonUserData = {
        email: 'test@example.com',
        password: 'plain_password',
        lastname: 'test_lastname',
        firstname: 'test_firstname',
    }
  
    // 作成成功
    it('should create verification token with password successfully', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockBcryptHash = await getBcryptHash()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))
        mockBcryptHash.mockResolvedValue('hashed_password')

        mockCreateVerificationToken.mockResolvedValue({
            success: true,
            error: null,
            data: 'test_token_123',
        })
    
        const result = await createVerificationTokenWithPassword(commonUserData)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(mockBcryptHash).toHaveBeenCalledWith('plain_password', expect.any(Number))
        expect(mockCreateVerificationToken).toHaveBeenCalledWith({
                verificationData: expect.objectContaining({
                identifier: commonUserData.email,
                token: expect.any(String),
                expires: expect.any(Date),
                password: 'hashed_password',
                userData: JSON.stringify({
                    lastname: 'test_lastname',
                    firstname: 'test_firstname',
                }),
            }),
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.token).toBeDefined()
    })

    // 作成失敗（createVerificationToken が失敗）
    it('should return failure when create verification token fails', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockBcryptHash = await getBcryptHash()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))
        mockBcryptHash.mockResolvedValue('hashed_password')

        mockCreateVerificationToken.mockResolvedValue({
            success: false,
            error: VERIFICATION_TOKEN_ERROR.CREATE_FAILED,
            data: null,
        })
    
        const result = await createVerificationTokenWithPassword(commonUserData)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(mockBcryptHash).toHaveBeenCalledWith('plain_password', expect.any(Number))
        expect(result.success).toBe(false)
        expect(result.error).toBe(VERIFICATION_TOKEN_ERROR.CREATE_FAILED)
        expect(result.token).toBeNull()
    })
  
    // 作成失敗（createVerificationToken で例外発生）
    it('should return failure when create verification token exception occurs', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockBcryptHash = await getBcryptHash()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))
        mockBcryptHash.mockResolvedValue('hashed_password')

        mockCreateVerificationToken.mockRejectedValue(new Error('Database error'))
    
        const result = await createVerificationTokenWithPassword(commonUserData)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(mockBcryptHash).toHaveBeenCalledWith('plain_password', expect.any(Number))
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.token).toBeNull()
    })

    // 作成失敗（bcrypt hash で例外発生）
    it('should return failure when bcrypt hash exception occurs', async () => {
        const mockBcryptHash = await getBcryptHash()

        mockBcryptHash.mockRejectedValue(new Error('Hash error'))

        const result = await createVerificationTokenWithPassword(commonUserData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Hash error')
        expect(result.token).toBeNull()
    })
})

/* ==================================== 
    Verify Email Token Test
==================================== */
describe('verifyEmailToken', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 認証成功（verifyEmailType === VERIFY_CREATE_ACCOUNT の場合）
    it('should verify email token successfully when verifyEmailType is VERIFY_CREATE_ACCOUNT', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockCreateUserStripeCustomerId = await getMockCreateUserStripeCustomerId()
        
        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockCreateUserStripeCustomerId.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(mockGetVerificationTokenAndVerify).toHaveBeenCalledWith({
            token: mockVerificationToken.token,
            notFoundErrorMessage: NOT_FOUND_EMAIL_TOKEN,
            expiredErrorMessage: EXPIRED_EMAIL_TOKEN
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.expires).toEqual(mockVerificationToken.expires)
        
        registerUserWithChatSpy.mockRestore()
    })

    // 認証成功（verifyEmailType !== VERIFY_CREATE_ACCOUNT の場合）
    it('should verify email token successfully when verifyEmailType is not VERIFY_CREATE_ACCOUNT', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserEmail = await getMockUpdateUserEmail()

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: mockUserData.id
        })

        mockUpdateUserEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(mockActionAuth).toHaveBeenCalledWith(AUTH_ERROR.SESSION_NOT_FOUND)
        expect(mockUpdateUserEmail).toHaveBeenCalledWith({
            userId: mockUserData.id,
            email: mockVerificationToken.identifier
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.expires).toEqual(mockVerificationToken.expires)
    })

    // 認証失敗（getVerificationTokenAndVerify が失敗した場合）
    it('should return failure when get verification token and verify fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: false,
            error: VERIFY_TOKEN_FAILED,
            data: null
        })
    
        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe(VERIFY_TOKEN_FAILED)
        expect(result.expires).toBeNull()
    })

    // 認証失敗（hashedPassword が null の場合）
    it('should return failure when hashedPassword is null', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        const verificationTokenWithoutPassword = {
            ...mockVerificationToken,
            password: null as unknown as string
        }

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: verificationTokenWithoutPassword
        })

        const result = await verifyEmailToken(verificationTokenWithoutPassword.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe(PASSWORD_NOT_FOUND)
        expect(result.expires).toBeNull()
    })

    // 認証失敗（registerUserWithChat が失敗した場合）
    it('should return failure when register user with chat fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockCreateUserStripeCustomerId = await getMockCreateUserStripeCustomerId()
        
        // registerUserWithChat 内で使用される関数のモック
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        mockDeleteVerificationToken.mockRejectedValue(new Error(
            CREATE_ACCOUNT_PROCESS_FAILED
        ))

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: false,
            error: CREATE_ACCOUNT_PROCESS_FAILED,
            data: null
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockCreateUserStripeCustomerId.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ACCOUNT_PROCESS_FAILED)
        expect(result.expires).toBeNull()

        registerUserWithChatSpy.mockRestore()
    })

    // 認証失敗（verificationToken.identifier が null の場合）
    it('should return failure when verificationToken.identifier is null', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        // registerUserWithChat 内で使用される関数のモック設定
        const mockCreateUser = await getMockCreateUser()
        
        const verificationTokenWithNullIdentifier = {
            ...mockVerificationToken,
            identifier: null as unknown as string
        }

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: verificationTokenWithNullIdentifier
        })

        mockCreateUser.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyEmailToken(verificationTokenWithNullIdentifier.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.expires).toBeNull()
    })

    // 認証失敗（verificationToken.userData が null の場合）
    it('should handle when verificationToken.userData is null', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        
        const verificationTokenWithNullUserData = {
            ...mockVerificationToken,
            userData: null as unknown as string
        }

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: verificationTokenWithNullUserData
        })

        // registerUserWithChat 内で使用される関数のモック設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()

        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyEmailToken(verificationTokenWithNullUserData.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe("Cannot read properties of null (reading 'lastname')")
        expect(result.expires).toBeNull()
    })

    // 認証失敗（createStripeCustomer が失敗した場合）
    it('should return failure when create stripe customer fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockDeleteUser = await getMockDeleteUser()
        
        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: false,
            error: CUSTOMER_CREATE_FAILED,
            data: null
        })

        mockDeleteUser.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_CREATE_FAILED)
        expect(result.expires).toBeNull()

        registerUserWithChatSpy.mockRestore()
    })

    // 認証成功（deleteUser が失敗した場合）
    it('should return failure when delete user fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockDeleteUser = await getMockDeleteUser()
        
        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockDeleteUser.mockResolvedValue({
            success: false,
            error: USER_ERROR.DELETE_FAILED
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.expires).toEqual(mockVerificationToken.expires)

        registerUserWithChatSpy.mockRestore()
    })

    // 認証失敗（createUserStripeCustomerId が失敗した場合）
    it('should return failure when create user stripe customer id fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockCreateUserStripeCustomerId = await getMockCreateUserStripeCustomerId()
        const mockDeleteUser = await getMockDeleteUser()
        const mockDeleteStripeCustomer = await getMockDeleteStripeCustomer()

        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockCreateUserStripeCustomerId.mockResolvedValue({
            success: false,
            error: CUSTOMER_ID_UPDATE_FAILED
        })

        mockDeleteUser.mockResolvedValue({
            success: true,
            error: null
        })

        mockDeleteStripeCustomer.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_ID_UPDATE_FAILED)
        expect(result.expires).toBeNull()

        registerUserWithChatSpy.mockRestore()
    })

    // 認証成功（deleteStripeCustomer が失敗した場合）
    it('should return failure when delete stripe customer fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockCreateUserStripeCustomerId = await getMockCreateUserStripeCustomerId()
        const mockDeleteUser = await getMockDeleteUser()
        const mockDeleteStripeCustomer = await getMockDeleteStripeCustomer()

        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockCreateUserStripeCustomerId.mockResolvedValue({
            success: true,
            error: null
        })

        mockDeleteUser.mockResolvedValue({
            success: true,
            error: null
        })

        mockDeleteStripeCustomer.mockResolvedValue({
            success: false,
            error: CUSTOMER_DELETE_FAILED,
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.expires).toEqual(mockVerificationToken.expires)

        registerUserWithChatSpy.mockRestore()
    })

    // 認証失敗（actionAuth が失敗した場合）
    it('should return failure when actionAuth fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockActionAuth = await getMockActionAuth()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })

        mockActionAuth.mockResolvedValue({
            success: false,
            error: SESSION_NOT_FOUND,
            userId: mockUserData.id
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe(SESSION_NOT_FOUND)
        expect(result.expires).toBeUndefined()
    })

    // 認証失敗（updateUserEmail が失敗した場合）
    it('should return failure when update user email fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserEmail = await getMockUpdateUserEmail()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: mockUserData.id
        })

        mockUpdateUserEmail.mockResolvedValue({
            success: false,
            error: MAIL_UPDATE_FAILED,
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe(MAIL_UPDATE_FAILED)
        expect(result.expires).toBeNull()
    })

    // 認証失敗（userId が null の場合）
    it('should return failure when userId is null', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserEmail = await getMockUpdateUserEmail()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: null as unknown as UserId
        })

        mockUpdateUserEmail.mockResolvedValue({
            success: false,
            error: MAIL_UPDATE_FAILED,
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe(MAIL_UPDATE_FAILED)
        expect(result.expires).toBeNull()
        expect(mockUpdateUserEmail).toHaveBeenCalledWith({
            userId: null,
            email: mockVerificationToken.identifier
        })
    })

    // 認証失敗（getVerificationTokenAndVerify が例外の場合）
    it('should return failure when get verification token and verify throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        mockGetVerificationTokenAndVerify.mockRejectedValue(
            new Error('Database error')
        )
    
        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.expires).toBeNull()
    })

    // 認証失敗（createStripeCustomer が例外の場合）
    it('should return failure when create stripe customer throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockDeleteUser = await getMockDeleteUser()
        
        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockRejectedValue(
            new Error('Database error')
        )

        mockDeleteUser.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.expires).toBeNull()

        registerUserWithChatSpy.mockRestore()
    })

    // 認証成功（deleteUser が例外の場合）
    it('should return failure when delete user throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockDeleteUser = await getMockDeleteUser()
        
        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockDeleteUser.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(true)
        expect(result.error).toBe(null)
        expect(result.expires).toEqual(mockVerificationToken.expires)

        registerUserWithChatSpy.mockRestore()
    })

    // 認証失敗（createUserStripeCustomerId が例外の場合）
    it('should return failure when create user stripe customer id throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockCreateUserStripeCustomerId = await getMockCreateUserStripeCustomerId()
        const mockDeleteUser = await getMockDeleteUser()
        const mockDeleteStripeCustomer = await getMockDeleteStripeCustomer()

        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockCreateUserStripeCustomerId.mockRejectedValue(
            new Error('Database error')
        )

        mockDeleteUser.mockResolvedValue({
            success: true,
            error: null
        })

        mockDeleteStripeCustomer.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.expires).toBeNull()

        registerUserWithChatSpy.mockRestore()
    })

    // 認証成功（deleteStripeCustomer が例外の場合）
    it('should return failure when delete stripe customer throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockCreateStripeCustomer = await getMockCreateStripeCustomer()
        const mockCreateUserStripeCustomerId = await getMockCreateUserStripeCustomerId()
        const mockDeleteUser = await getMockDeleteUser()
        const mockDeleteStripeCustomer = await getMockDeleteStripeCustomer()

        // registerUserWithChat 内で使用される関数のモックも設定
        const mockCreateUser = await getMockCreateUser()
        const mockCreateUserProfile = await getMockCreateUserProfile()
        const mockCreateUserImage = await getMockCreateUserImage()
        const mockCreateChatRoom = await getMockCreateChatRoom()
        const mockCreateInitialChat = await getMockCreateInitialChat()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        // registerUserWithChat のスパイを設定
        const authActionsModule = await import('@/services/auth/actions')
        const registerUserWithChatSpy = vi.spyOn(
            authActionsModule,
            'registerUserWithChat'
        )

        // registerUserWithChat 内で使用される関数のモック設定
        mockCreateUser.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockUserData 
        })

        mockCreateUserProfile.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateUserImage.mockResolvedValue({ 
            success: true, 
            error: null
        })

        mockCreateChatRoom.mockResolvedValue({ 
            success: true, 
            error: null, 
            data: mockChatRoom
        })

        mockCreateInitialChat.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockDeleteVerificationToken.mockResolvedValue({ 
            success: true, 
            error: null 
        })

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })
    
        registerUserWithChatSpy.mockResolvedValue({
            success: true,
            error: null,
            data: { 
                success: true, 
                error: null, 
                data: mockUserData 
            }
        })

        mockCreateStripeCustomer.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockCreateUserStripeCustomerId.mockResolvedValue({
            success: true,
            error: null
        })

        mockDeleteUser.mockResolvedValue({
            success: true,
            error: null
        })

        mockDeleteStripeCustomer.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_CREATE_ACCOUNT)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.expires).toEqual(mockVerificationToken.expires)

        registerUserWithChatSpy.mockRestore()
    })

    // 認証失敗（actionAuth が例外の場合）
    it('should return failure when actionAuth throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockActionAuth = await getMockActionAuth()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })

        mockActionAuth.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.expires).toBeNull()
    })

    // 認証失敗（updateUserEmail が例外の場合）
    it('should return failure when update user email throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserEmail = await getMockUpdateUserEmail()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })

        mockActionAuth.mockResolvedValue({
            success: true,
            error: undefined,
            userId: mockUserData.id
        })

        mockUpdateUserEmail.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyEmailToken(mockVerificationToken.token, VERIFY_UPDATE_EMAIL)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.expires).toBeNull()
    })
})

/* ==================================== 
    Create Verification Token With Email Test
==================================== */
describe('createVerificationTokenWithEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    const commonEmail = 'test@example.com'

    // 作成成功
    it('should create verification token with email successfully', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))

        mockCreateVerificationToken.mockResolvedValue({
            success: true,
            error: null,
            data: 'test_token_123',
        })
    
        const result = await createVerificationTokenWithEmail(commonEmail)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(mockCreateVerificationToken).toHaveBeenCalledWith({
            verificationData: expect.objectContaining({
                identifier: commonEmail,
                token: expect.any(String),
                expires: expect.any(Date),
            }),
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.token).toBe('test_token_123')
    })

    // 作成失敗（createVerificationToken で失敗失敗）
    it('should return failure when create verification token repository fails', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))

        mockCreateVerificationToken.mockResolvedValue({
            success: false,
            error: VERIFICATION_TOKEN_ERROR.CREATE_FAILED,
            data: null,
        })
    
        const result = await createVerificationTokenWithEmail(commonEmail)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(result.success).toBe(false)
        expect(result.error).toBe(VERIFICATION_TOKEN_ERROR.CREATE_FAILED)
        expect(result.token).toBeNull()
    })

    // 作成失敗（createVerificationToken の data が null の場合）
    it('should return failure when create verification token returns null data', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))

        mockCreateVerificationToken.mockResolvedValue({
            success: true,
            error: null,
            data: null as unknown as string,
        })
    
        const result = await createVerificationTokenWithEmail(commonEmail)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(result.success).toBe(false)
        expect(result.error).toBeNull()
        expect(result.token).toBeNull()
    })

    // 作成失敗（createVerificationToken で例外発生）
    it('should return failure when create verification token exception occurs', async () => {
        const mockCryptoRandomBytes = await getCryptoRandomBytes()
        const mockCreateVerificationToken = await getMockCreateVerificationToken()

        mockCryptoRandomBytes.mockReturnValue(Buffer.from('test_token_123'))

        mockCreateVerificationToken.mockRejectedValue(new Error('Database error'))
    
        const result = await createVerificationTokenWithEmail(commonEmail)
    
        expect(mockCryptoRandomBytes).toHaveBeenCalledWith(expect.any(Number))
        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_VERIFICATION_TOKEN_PROCESS_FAILED)
        expect(result.token).toBeNull()
    })
})

/* ==================================== 
    Reset Password Test
==================================== */
describe('resetPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    const commonVerificationToken = {
        token: 'test_token',
        identifier: 'test@example.com',
        expires: new Date(),
        password: null,
        userData: null
    }

    const commonPassword = 'new_password'

    // リセット成功
    it('should reset password successfully', async () => {
        const mockUpdateUserPasswordWithTransaction = await getMockUpdateUserPasswordWithTransaction()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        mockUpdateUserPasswordWithTransaction.mockResolvedValue({
            success: true,
            error: null,
            data: mockUserData
        })

        mockDeleteVerificationToken.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await resetPassword(commonVerificationToken, commonPassword)

        expect(mockUpdateUserPasswordWithTransaction).toHaveBeenCalledWith({
            tx: expect.any(Object),
            verificationToken: commonVerificationToken,
            password: commonPassword
        })
        expect(mockDeleteVerificationToken).toHaveBeenCalledWith({
            tx: expect.any(Object),
            token: commonVerificationToken.token
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toEqual(mockUserData)
    })

    // リセット失敗（updateUserPasswordWithTransaction が失敗した場合）
    it('should return failure when update user password fails', async () => {
        const mockUpdateUserPasswordWithTransaction = await getMockUpdateUserPasswordWithTransaction()

        mockUpdateUserPasswordWithTransaction.mockResolvedValue({
            success: false,
            error: USER_ERROR.PASSWORD_UPDATE_FAILED,
            data: null
        })

        const result = await resetPassword(commonVerificationToken, commonPassword)

        expect(mockUpdateUserPasswordWithTransaction).toHaveBeenCalledWith({
            tx: expect.any(Object),
            verificationToken: commonVerificationToken,
            password: commonPassword
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe(USER_ERROR.PASSWORD_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })

    // リセット失敗（updateUserPasswordWithTransaction の data が null の場合）
    it('should return failure when update user password returns null data', async () => {
        const mockUpdateUserPasswordWithTransaction = await getMockUpdateUserPasswordWithTransaction()

        mockUpdateUserPasswordWithTransaction.mockResolvedValue({
            success: true,
            error: null,
            data: null as unknown as { 
                password: string; 
                id: string; 
                email: string; 
                emailVerified: Date | null; 
                created_at: Date; 
                updated_at: Date; 
            }
        })

        const result = await resetPassword(commonVerificationToken, commonPassword)

        expect(mockUpdateUserPasswordWithTransaction).toHaveBeenCalledWith({
            tx: expect.any(Object),
            verificationToken: commonVerificationToken,
            password: commonPassword
        })
        expect(result.success).toBe(false)
        expect(result.error).toBeNull()
        expect(result.data).toBeNull()
    })

    // リセット失敗（updateUserPasswordWithTransaction で例外発生）
    it('should return failure when update user password throws an exception', async () => {
        const mockUpdateUserPasswordWithTransaction = await getMockUpdateUserPasswordWithTransaction()

        mockUpdateUserPasswordWithTransaction.mockRejectedValue(
            new Error('Database error')
        )

        const result = await resetPassword(commonVerificationToken, commonPassword)

        expect(mockUpdateUserPasswordWithTransaction).toHaveBeenCalledWith({
            tx: expect.any(Object),
            verificationToken: commonVerificationToken,
            password: commonPassword
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // リセット失敗（deleteVerificationToken が例外の場合）
    it('should return failure when delete verification token throws an exception', async () => {
        const mockUpdateUserPasswordWithTransaction = await getMockUpdateUserPasswordWithTransaction()
        const mockDeleteVerificationToken = await getMockDeleteVerificationToken()

        mockUpdateUserPasswordWithTransaction.mockResolvedValue({
            success: true,
            error: null,
            data: mockUserData
        })

        mockDeleteVerificationToken.mockRejectedValue(
            new Error('Database error')
        )

        const result = await resetPassword(commonVerificationToken, commonPassword)

        expect(mockUpdateUserPasswordWithTransaction).toHaveBeenCalledWith({
            tx: expect.any(Object),
            verificationToken: commonVerificationToken,
            password: commonPassword
        })
        expect(mockDeleteVerificationToken).toHaveBeenCalledWith({
            tx: expect.any(Object),
            token: commonVerificationToken.token
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Verify Reset Password Token Test
==================================== */
describe('verifyResetPasswordToken', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonToken = 'test_token'

    // 認証成功
    it('should verify reset password token successfully', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: mockVerificationToken
        })

        const result = await verifyResetPasswordToken(commonToken)

        expect(mockGetVerificationTokenAndVerify).toHaveBeenCalledWith({
            token: commonToken,
            notFoundErrorMessage: NOT_FOUND_PASSWORD_TOKEN,
            expiredErrorMessage: EXPIRED_PASSWORD_TOKEN
        })
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.expires).toEqual(mockVerificationToken.expires)
    })

    // 認証失敗（getVerificationTokenAndVerify が失敗した場合）
    it('should return failure when get verification token and verify fails', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: false,
            error: NOT_FOUND_PASSWORD_TOKEN,
            data: null
        })

        const result = await verifyResetPasswordToken(commonToken)

        expect(result.success).toBe(false)
        expect(result.error).toBe(NOT_FOUND_PASSWORD_TOKEN)
        expect(result.expires).toBeNull()
    })

    // 認証失敗（getVerificationTokenAndVerify の data が null の場合）
    it('should return failure when get verification token and verify returns null data', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        mockGetVerificationTokenAndVerify.mockResolvedValue({
            success: true,
            error: null,
            data: null as unknown as {
                token: string;
                id: string;
                identifier: string;
                expires: Date;
                password: string | null;
                userData: string | null;
                created_at: Date;
                updated_at: Date;
            }
        })

        const result = await verifyResetPasswordToken(commonToken)

        expect(result.success).toBe(false)
        expect(result.error).toBeNull()
        expect(result.expires).toBeNull()
    })

    // 認証失敗（getVerificationTokenAndVerify が例外の場合）
    it('should return failure when get verification token and verify throws an exception', async () => {
        const mockGetVerificationTokenAndVerify = await getMockGetVerificationTokenAndVerify()

        mockGetVerificationTokenAndVerify.mockRejectedValue(
            new Error('Database error')
        )

        const result = await verifyResetPasswordToken(commonToken)

        expect(result.success).toBe(false)
        expect(result.error).toBe(VERIFY_TOKEN_FAILED)
        expect(result.expires).toBeNull()
    })
})