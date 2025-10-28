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
const { DELETE_FAILED, CREATE_ACCOUNT_FAILED, MAIL_UPDATE_FAILED, PASSWORD_UPDATE_FAILED } = USER_ERROR;

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
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when create user repository fails', async () => {
        mockCreateUserWithTransaction.mockResolvedValue(false)

        const result = await createUser({
            ...commonParams,
            userData: {
                email: '',
                password: '',
                emailVerified: new Date()
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ACCOUNT_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗(例外発生)
    it('should return failure when create user exception occurs', async () => {
        mockCreateUserWithTransaction.mockRejectedValue(new Error('Database error'))

        const result = await createUser({
            ...commonParams,
            userData: {
                email: '',
                password: '',
                emailVerified: new Date()
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ACCOUNT_FAILED)
        expect(result.data).toBeNull()
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
        })

        expect(result).toBeDefined()
    })

    // 取得失敗
    it('should return null when repository fails', async () => {
        mockGetUser.mockResolvedValue(null)
    
        const result = await getUser({
            userId: '',
        })
    
        expect(result).toBeNull()
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
        mockUpdateUserEmail.mockResolvedValue(true)

        const result = await updateUserEmail({
            userId: 'test-user-id',
            email: 'test@example.com'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 更新失敗
    it('should return failure when update user email repository fails', async () => {
        mockUpdateUserEmail.mockResolvedValue(false)

        const result = await updateUserEmail({
            userId: '',
            email: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MAIL_UPDATE_FAILED)
    })

    // 更新失敗(例外発生)
    it('should return failure when update user email exception occurs', async () => {
        mockUpdateUserEmail.mockRejectedValue(new Error('Database error'))

        const result = await updateUserEmail({
            userId: '',
            email: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MAIL_UPDATE_FAILED)
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
        mockUpdateUserPassword.mockResolvedValue(true)

        const result = await updateUserPassword({
            userId: 'test-user-id',
            password: 'test-password'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 更新失敗
    it('should return failure when update user password repository fails', async () => {
        mockUpdateUserPassword.mockResolvedValue(false)

        const result = await updateUserPassword({
            userId: '',
            password: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PASSWORD_UPDATE_FAILED)
    })

    // 更新失敗(例外発生)
    it('should return failure when update user password exception occurs', async () => {
        mockUpdateUserPassword.mockRejectedValue(new Error('Database error'))

        const result = await updateUserPassword({
            userId: '',
            password: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PASSWORD_UPDATE_FAILED)
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
        mockUpdateUserPasswordWithTransaction.mockResolvedValue(true)

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
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when update user password with transaction repository fails', async () => {
        mockUpdateUserPasswordWithTransaction.mockResolvedValue(false)

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
        expect(result.error).toBe(PASSWORD_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 更新失敗(例外発生)
    it('should return failure when update user password with transaction exception occurs', async () => {
        mockUpdateUserPasswordWithTransaction.mockRejectedValue(
            new Error('Database error')
        )

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
        expect(result.error).toBe(PASSWORD_UPDATE_FAILED)
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
        mockDeleteUser.mockResolvedValue(true)

        const result = await deleteUser({
            userId: 'test-user-id'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 削除失敗
    it('should return failure when delete user repository fails', async () => {
        mockDeleteUser.mockResolvedValue(false)

        const result = await deleteUser({
            userId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 削除失敗(例外発生)
    it('should return failure when delete user exception occurs', async () => {
        mockDeleteUser.mockRejectedValue(new Error('Database error'))

        const result = await deleteUser({
            userId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
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