import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createUser,
    getUser,
    updateUserEmail,
    updateUserPassword,
    updateUserPasswordWithTransaction,
    deleteUser,
    deleteUserAccount
} from "@/services/user/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CLOUDFLARE_ERROR, USER_ERROR, USER_IMAGE_ERROR } = ERROR_MESSAGES;
const { FILE_PATH_NOT_FOUND } = USER_IMAGE_ERROR;
const { DELETE_FAILED } = USER_ERROR;

const mockCreateUserWithTransaction = vi.fn()
const mockGetUser = vi.fn()
const mockUpdateUserEmail = vi.fn()
const mockUpdateUserPassword = vi.fn()
const mockUpdateUserPasswordWithTransaction = vi.fn()
const mockDeleteUser = vi.fn()
const mockDeleteUserAccount = vi.fn()

vi.mock('@/repository/user', () => ({
    createUserRepository: () => ({
        createUserWithTransaction: mockCreateUserWithTransaction
    }),
    getUserRepository: () => ({
        getUser: mockGetUser
    }),
    updateUserRepository: () => ({
        updateUserEmail: mockUpdateUserEmail,
        updateUserPassword: mockUpdateUserPassword,
        updateUserPasswordWithTransaction: mockUpdateUserPasswordWithTransaction
    }),
    deleteUserRepository: () => ({
        deleteUser: mockDeleteUser,
        deleteUserWithTransaction: mockDeleteUserAccount
    })
}))

vi.mock('@/services/user-image/actions', () => ({
    getUserImageFilePathWithTransaction: vi.fn()
}))

vi.mock('@/services/cloudflare/actions', () => ({
    deleteObjectFromR2: vi.fn()
}))

const getMockGetUserImageFilePathWithTransaction = async () => {
    const { getUserImageFilePathWithTransaction } = await import('@/services/user-image/actions')
    return vi.mocked(getUserImageFilePathWithTransaction)
}

const getMockDeleteObjectFromR2 = async () => {
    const { deleteObjectFromR2 } = await import('@/services/cloudflare/actions')
    return vi.mocked(deleteObjectFromR2)
}

/* ==================================== 
    Create User Test
==================================== */
describe('createUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        tx: {} as unknown as TransactionClient,
    }

    // 作成成功
    it('should create user successfully', async () => {
        mockCreateUserWithTransaction.mockResolvedValue({ success: true })

        const result = await createUser({
            ...commonParams,
            userData: {
                email: 'test@example.com',
                password: 'test-password',
                emailVerified: new Date()
            }
        })

        expect(result.success).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateUserWithTransaction.mockResolvedValue(null)

        const result = await createUser({
            ...commonParams,
            userData: {
                email: '',
                password: '',
                emailVerified: new Date()
            }
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Get User Test
==================================== */
describe('getUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get user successfully', async () => {
        mockGetUser.mockResolvedValue({ success: true })

        const result = await getUser({
            userId: 'test-user-id',
            errorMessage: 'test-error-message'
        })

        expect(result).toBeDefined()
    })

    // 取得失敗
    it('should return failure when repository fails', async () => {
        mockGetUser.mockResolvedValue(null)

        await expect(getUser({
            userId: '',
            errorMessage: 'test-error-message'
        })).rejects.toThrow('test-error-message')
    })
})

/* ==================================== 
    Update User Email Test
==================================== */
describe('updateUserEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update user email successfully', async () => {
        mockUpdateUserEmail.mockResolvedValue({ success: true })

        const result = await updateUserEmail({
            userId: 'test-user-id',
            email: 'test@example.com'
        })

        expect(result.success).toBe(true)
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserEmail.mockResolvedValue(null)

        const result = await updateUserEmail({
            userId: '',
            email: ''
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Update User Password Test
==================================== */
describe('updateUserPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update user password successfully', async () => {
        mockUpdateUserPassword.mockResolvedValue({ success: true })

        const result = await updateUserPassword({
            userId: 'test-user-id',
            password: 'test-password'
        })

        expect(result.success).toBe(true)
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserPassword.mockResolvedValue(null)

        const result = await updateUserPassword({
            userId: '',
            password: ''
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Update User Password With Transaction Test
==================================== */
describe('updateUserPasswordWithTransaction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        tx: {} as unknown as TransactionClient
    }

    // 更新成功
    it('should update user password with transaction successfully', async () => {
        mockUpdateUserPasswordWithTransaction.mockResolvedValue({ success: true })

        const result = await updateUserPasswordWithTransaction({
            ...commonParams,
            verificationToken: {
                token: 'test-token',
                identifier: 'test@example.com',
                expires: new Date()
            },
            password: 'hashed_password'
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserPasswordWithTransaction.mockResolvedValue(null)

        const result = await updateUserPasswordWithTransaction({
            ...commonParams,
            verificationToken: {
                token: '',
                identifier: '',
                expires: new Date()
            },
            password: ''
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Delete User Test
==================================== */
describe('deleteUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 削除成功
    it('should delete user successfully', async () => {
        mockDeleteUser.mockResolvedValue({ success: true })

        const result = await deleteUser({
            userId: 'test-user-id'
        })

        expect(result.success).toBe(true)
    })

    // 削除失敗
    it('should return failure when repository fails', async () => {
        mockDeleteUser.mockResolvedValue(null)

        const result = await deleteUser({
            userId: ''
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Delete User Account Test
==================================== */
describe('deleteUserAccount', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 削除成功
    it('should delete user account successfully', async () => {
        const mockGetUserImageFilePathWithTransaction = await getMockGetUserImageFilePathWithTransaction()
        const mockDeleteObjectFromR2 = await getMockDeleteObjectFromR2()

        mockGetUserImageFilePathWithTransaction.mockResolvedValue({ 
            data: 'test-user-image-path' 
        })
        mockDeleteUser.mockResolvedValue({ success: true })
        mockDeleteObjectFromR2.mockResolvedValue({ success: true, error: null })

        const result = await deleteUserAccount({ userId: 'test-user-id' })

        expect(result).toBeDefined()
    })

    // 削除失敗(ユーザー画像の取得失敗)
    it('should return failure when user image file path is not found', async () => {
        const mockGetUserImageFilePathWithTransaction = await getMockGetUserImageFilePathWithTransaction()

        mockGetUserImageFilePathWithTransaction.mockResolvedValue({ data: null })

        const result = await deleteUserAccount({ userId: 'test-user-id' })

        expect(result.success).toBe(false)
        expect(result.error).toBe(FILE_PATH_NOT_FOUND)
    })

    // 削除失敗(ユーザーの削除失敗)
    it('should return failure when delete user with transaction fails', async () => {
        const mockGetUserImageFilePathWithTransaction = await getMockGetUserImageFilePathWithTransaction()

        mockGetUserImageFilePathWithTransaction.mockResolvedValue({ 
            data: 'test-user-image-path' 
        })
        mockDeleteUser.mockResolvedValue(null)

        const result = await deleteUserAccount({ userId: 'test-user-id' })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 削除失敗(Cloudflare R2の削除失敗)
    it('should return failure when cloudflare r2 delete fails', async () => {
        const mockGetUserImageFilePathWithTransaction = await getMockGetUserImageFilePathWithTransaction()
        const mockDeleteObjectFromR2 = await getMockDeleteObjectFromR2()

        mockGetUserImageFilePathWithTransaction.mockResolvedValue({ 
            data: 'test-user-image-path' 
        })
        mockDeleteUser.mockResolvedValue({ success: true })
        mockDeleteObjectFromR2.mockResolvedValue({ 
            success: false, 
            error: CLOUDFLARE_ERROR.DELETE_FAILED
        })

        const result = await deleteUserAccount({ userId: 'test-user-id' })

        expect(result).toBeDefined()
    })
})