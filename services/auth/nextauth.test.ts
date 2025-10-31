import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    authenticateUser, 
    createAccessControlCallback 
} from "@/services/auth/nextauth"
import { mockUserData, mockUserProfileData } from "@/__tests__/mocks/domain-mocks"
import { LoginCredentials } from "next-auth"
import { SITE_MAP } from "@/constants/index"

const { LOGIN_PATH, ACCOUNT_PATH, CART_PATH, CREATE_ACCOUNT_PATH, CREATE_ACCOUNT_VERIFY_PATH, RESET_PASSWORD_PATH, RESET_PASSWORD_NEW_PASSWORD_PATH, HOME_PATH } = SITE_MAP;

const mockGetUserByEmail = vi.fn()

vi.mock('bcryptjs', () => ({
    default: { compare: vi.fn() },
}))

vi.mock('@/repository/user', () => ({
    getUserRepository: () => ({
        getUserByEmail: mockGetUserByEmail
    })
}))

const getMockBcryptCompare = async () => {
    const { default: bcrypt } = await import('bcryptjs')
    return vi.mocked(bcrypt.compare) as ReturnType<typeof vi.fn>
}

/* ==================================== 
    authenticateUser Test
==================================== */
describe('authenticateUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonCredentials = {
        email: 'test@example.com',
        password: 'plain_password'
    }

    // 認証成功
    it('should authenticate user successfully', async () => {
        const mockBcryptCompare = await getMockBcryptCompare()

        const userWithProfile = {
            ...mockUserData,
            password: 'hashed_password',
            user_profiles: mockUserProfileData
        }

        mockGetUserByEmail.mockResolvedValue(userWithProfile)
        mockBcryptCompare.mockResolvedValue(true)

        const result = await authenticateUser(commonCredentials)

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonCredentials.email
        })
        expect(mockBcryptCompare).toHaveBeenCalledWith(
            commonCredentials.password,
            'hashed_password'
        )
        expect(result).toEqual({
            id: mockUserData.id,
            email: mockUserData.email,
            name: `${mockUserProfileData.lastname} ${mockUserProfileData.firstname}`
        })
    })

    // 認証成功（user_profiles が null の場合）
    it('should authenticate user successfully when user_profiles is null', async () => {
        const mockBcryptCompare = await getMockBcryptCompare()

        const userWithoutProfile = {
            ...mockUserData,
            password: 'hashed_password',
            user_profiles: null
        }

        mockGetUserByEmail.mockResolvedValue(userWithoutProfile)
        mockBcryptCompare.mockResolvedValue(true)

        const result = await authenticateUser(commonCredentials)

        expect(result).toEqual({
            id: mockUserData.id,
            email: mockUserData.email,
            name: 'undefined undefined'
        })
    })

    // 認証失敗（credentials が null の場合）
    it('should return null when credentials is null', async () => {
        const result = await authenticateUser(null as unknown as LoginCredentials)

        expect(result).toBeNull()
    })

    // 認証失敗（credentials が undefined の場合）
    it('should return null when credentials is undefined', async () => {
        const result = await authenticateUser(undefined as unknown as LoginCredentials)

        expect(result).toBeNull()
    })

    // 認証失敗（ユーザーが存在しない場合）
    it('should return null when user does not exist', async () => {
        mockGetUserByEmail.mockResolvedValue(null)

        const result = await authenticateUser(commonCredentials)

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonCredentials.email
        })
        expect(result).toBeNull()
    })

    // 認証失敗（user.password が null の場合）
    it('should return null when user.password is null', async () => {
        const mockBcryptCompare = await getMockBcryptCompare()

        const userWithoutPassword = {
            ...mockUserData,
            password: null as unknown as string,
            user_profiles: mockUserProfileData
        }

        mockGetUserByEmail.mockResolvedValue(userWithoutPassword)

        const result = await authenticateUser(commonCredentials)

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonCredentials.email
        })
        expect(result).toBeNull()
    })

    // 認証失敗（パスワードが無効な場合）
    it('should return null when password is invalid', async () => {
        const mockBcryptCompare = await getMockBcryptCompare()

        const userWithProfile = {
            ...mockUserData,
            password: 'hashed_password',
            user_profiles: mockUserProfileData
        }

        mockGetUserByEmail.mockResolvedValue(userWithProfile)
        mockBcryptCompare.mockResolvedValue(false)

        const result = await authenticateUser(commonCredentials)

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonCredentials.email
        })
        expect(mockBcryptCompare).toHaveBeenCalledWith(
            commonCredentials.password,
            'hashed_password'
        )
        expect(result).toBeNull()
    })

    // 認証失敗（getUserByEmail で例外発生）
    it('should throw error when getUserByEmail throws an exception', async () => {
        mockGetUserByEmail.mockRejectedValue(new Error('Database error'))

        await expect(authenticateUser(commonCredentials)).rejects.toThrow('Database error')

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonCredentials.email
        })
    })

    // 認証失敗（bcrypt.compare で例外発生）
    it('should throw error when bcrypt.compare throws an exception', async () => {
        const mockBcryptCompare = await getMockBcryptCompare()

        const userWithProfile = {
            ...mockUserData,
            password: 'hashed_password',
            user_profiles: mockUserProfileData
        }

        mockGetUserByEmail.mockResolvedValue(userWithProfile)
        mockBcryptCompare.mockRejectedValue(new Error('Bcrypt error'))

        await expect(authenticateUser(commonCredentials))
            .rejects.toThrow('Bcrypt error')

        expect(mockGetUserByEmail).toHaveBeenCalledWith({
            email: commonCredentials.email
        })
        expect(mockBcryptCompare).toHaveBeenCalledWith(
            commonCredentials.password,
            'hashed_password'
        )
    })
})

/* ==================================== 
    createAccessControlCallback Test
==================================== */
describe('createAccessControlCallback', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createCallback = createAccessControlCallback()
    const baseUrl = 'https://example.com'

    const mockAuthLoggedIn = {
        user: {
            id: 'user_1',
            email: 'test@example.com',
            name: 'Test User'
        }
    }

    const mockAuthLoggedOut = {
        user: null
    }

    // 未ログイン状態 & /account にアクセスした場合
    it('should redirect to login page when not logged in and accessing /account', () => {
        const nextUrl = new URL(`${baseUrl}${ACCOUNT_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedOut,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${LOGIN_PATH}?redirectTo=%2Faccount`)
    })

    // 未ログイン状態 & /account/something にアクセス
    it('should redirect to login page when not logged in and accessing /account/something', () => {
        const nextUrl = new URL(`${baseUrl}${ACCOUNT_PATH}/something`)
        const result = createCallback({
            auth: mockAuthLoggedOut,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${LOGIN_PATH}?redirectTo=%2Faccount%2Fsomething`)
    })

    // 未ログイン状態 & /cart にアクセスした場合
    it('should redirect to login page when not logged in and accessing /cart', () => {
        const nextUrl = new URL(`${baseUrl}/cart`)
        const result = createCallback({
            auth: mockAuthLoggedOut,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${LOGIN_PATH}?redirectTo=%2Fcart`)
    })

    // 未ログイン状態 & その他のパスにアクセスした場合
    it('should return true when not logged in and accessing other paths', () => {
        const nextUrl = new URL(`${baseUrl}/`)
        const result = createCallback({
            auth: mockAuthLoggedOut,
            request: { nextUrl }
        })

        expect(result).toBe(true)
    })

    // ログイン状態 & /login にアクセスした場合
    it('should redirect to account page when logged in and accessing /login', () => {
        const nextUrl = new URL(`${baseUrl}${LOGIN_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${ACCOUNT_PATH}`)
    })

    // ログイン状態 & /create-account にアクセスした場合
    it('should redirect to account page when logged in and accessing /create-account', () => {
        const nextUrl = new URL(`${baseUrl}${CREATE_ACCOUNT_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${ACCOUNT_PATH}`)
    })

    // ログイン状態 & /create-account/verify にアクセスした場合
    it('should redirect to account page when logged in and accessing /create-account/verify', () => {
        const nextUrl = new URL(`${baseUrl}${CREATE_ACCOUNT_VERIFY_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${ACCOUNT_PATH}`)
    })

    // ログイン状態 & /reset-password にアクセスした場合
    it('should redirect to account page when logged in and accessing /reset-password', () => {
        const nextUrl = new URL(`${baseUrl}${RESET_PASSWORD_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${ACCOUNT_PATH}`)
    })

    // ログイン状態 & /reset-password/new-password にアクセスした場合
    it('should redirect to account page when logged in and accessing /reset-password/new-password', () => {
        const nextUrl = new URL(`${baseUrl}${RESET_PASSWORD_NEW_PASSWORD_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${ACCOUNT_PATH}`)
    })

    // ログイン状態 & /account にアクセスした場合
    it('should return true when logged in and accessing /account', () => {
        const nextUrl = new URL(`${baseUrl}${ACCOUNT_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBe(true)
    })

    // ログイン状態 & /cart にアクセスした場合
    it('should return true when logged in and accessing /cart', () => {
        const nextUrl = new URL(`${baseUrl}${CART_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBe(true)
    })

    // ログイン状態 & その他のパスにアクセスした場合
    it('should return true when logged in and accessing other paths', () => {
        const nextUrl = new URL(`${baseUrl}${HOME_PATH}`)
        const result = createCallback({
            auth: mockAuthLoggedIn,
            request: { nextUrl }
        })

        expect(result).toBe(true)
    })

    // auth が null の場合
    it('should redirect to login page when auth is null and accessing /account', () => {
        const nextUrl = new URL(`${baseUrl}${ACCOUNT_PATH}`)
        const result = createCallback({
            auth: null,
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${LOGIN_PATH}?redirectTo=%2Faccount`)
    })

    // auth.user が undefined の場合
    it('should redirect to login page when auth.user is undefined and accessing /account', () => {
        const nextUrl = new URL(`${baseUrl}${ACCOUNT_PATH}`)
        const result = createCallback({
            auth: { user: undefined },
            request: { nextUrl }
        })

        expect(result).toBeInstanceOf(Response)
        const location = (result as Response).headers.get('location')
        expect(location).toBe(`${baseUrl}${LOGIN_PATH}?redirectTo=%2Faccount`)
    })
})