import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createUserProfile,
    updateUserProfileIconUrl,
    updateUserProfileName,
    updateUserProfileTel
} from "@/services/user-profile/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_PROFILE_ERROR } = ERROR_MESSAGES;

const { CREATE_PROFILE_FAILED, ICON_UPDATE_FAILED, NAME_UPDATE_FAILED, TEL_UPDATE_FAILED } = USER_PROFILE_ERROR;

const mockCreateUserProfileWithTransaction = vi.fn()
const mockUpdateUserProfileIconUrl = vi.fn()
const mockUpdateUserProfileName = vi.fn()
const mockUpdateUserProfileTel = vi.fn()

vi.mock('@/repository/userProfile', () => ({
    createUserProfileRepository: () => ({
        createUserProfileWithTransaction: mockCreateUserProfileWithTransaction
    }),
    updateUserProfileRepository: () => ({
        updateUserProfileIconUrl: mockUpdateUserProfileIconUrl,
        updateUserProfileName: mockUpdateUserProfileName,
        updateUserProfileTel: mockUpdateUserProfileTel
    })
}))

/* ==================================== 
    Create User Profile Test
==================================== */
describe('createUserProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        tx: {
            userProfile: {
                create: mockCreateUserProfileWithTransaction
            }
        } as unknown as TransactionClient,
    }

    // 作成成功
    it('should create user profile successfully', async () => {
        mockCreateUserProfileWithTransaction.mockResolvedValue(true)

        const result = await createUserProfile({
            ...commonParams,
            userId: 'test-user-id',
            userProfileData: {
                lastname: 'test-lastname',
                firstname: 'test-firstname',
                icon_url: 'test-icon-url'
            }
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when create user profile repository fails', async () => {
        mockCreateUserProfileWithTransaction.mockResolvedValue(false)

        const result = await createUserProfile({
            ...commonParams,
            userId: '',
            userProfileData: {
                lastname: '',
                firstname: '',
                icon_url: ''
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_PROFILE_FAILED)
    })

    // 作成失敗(例外発生)
    it('should return failure when create user profile repository exception occurs', async () => {
        mockCreateUserProfileWithTransaction.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createUserProfile({
            ...commonParams,
            userId: '',
            userProfileData: {
                lastname: '',
                firstname: '',
                icon_url: ''
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_PROFILE_FAILED)
    })
})

/* ==================================== 
    Update User Profile Icon URL Test
==================================== */
describe('updateUserProfileIconUrl', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update user profile icon url successfully', async () => {
        mockUpdateUserProfileIconUrl.mockResolvedValue(true)

        const result = await updateUserProfileIconUrl({
            userId: 'test-user-id',
            iconUrl: 'test-icon-url'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 更新失敗
    it('should return failure when update user profile icon url repository fails', async () => {
        mockUpdateUserProfileIconUrl.mockResolvedValue(false)

        const result = await updateUserProfileIconUrl({
            userId: '',
            iconUrl: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(ICON_UPDATE_FAILED)
    })

    // 更新失敗(例外発生)
    it('should return failure when update user profile icon url repository exception occurs', async () => {
        mockUpdateUserProfileIconUrl.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateUserProfileIconUrl({
            userId: '',
            iconUrl: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(ICON_UPDATE_FAILED)
    })
})

/* ==================================== 
    Update User Profile Name Test
==================================== */
describe('updateUserProfileName', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update user profile name successfully', async () => {
        mockUpdateUserProfileName.mockResolvedValue({ 
            success: true, 
            data: { 
                lastname: 'test-lastname', 
                firstname: 'test-firstname' 
            } 
        })

        const result = await updateUserProfileName({
            userId: 'test-user-id',
            lastname: 'test-lastname', 
            firstname: 'test-firstname'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when update user profile name repository fails', async () => {
        mockUpdateUserProfileName.mockResolvedValue(false)

        const result = await updateUserProfileName({
            userId: '',
            lastname: '',
            firstname: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NAME_UPDATE_FAILED)
        expect(result.data).toBeUndefined()
    })

    // 更新失敗(例外発生)
    it('should return failure when update user profile name repository exception occurs', async () => {
        mockUpdateUserProfileName.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateUserProfileName({
            userId: '',
            lastname: '',
            firstname: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NAME_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update User Profile Tel Test
==================================== */
describe('updateUserProfileTel', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update user profile tel successfully', async () => {
        mockUpdateUserProfileTel.mockResolvedValue({ 
            success: true, 
            data: { tel: 'test-tel' } 
        })

        const result = await updateUserProfileTel({
            userId: 'test-user-id',
            tel: 'test-tel'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when update user profile tel database update fails', async () => {
        mockUpdateUserProfileTel.mockResolvedValue(false)

        const result = await updateUserProfileTel({
            userId: '',
            tel: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(TEL_UPDATE_FAILED)
        expect(result.data).toBeUndefined()
    })

    // 更新失敗(例外発生)
    it('should return failure when update user profile tel database update exception occurs', async () => {
        mockUpdateUserProfileTel.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateUserProfileTel({
            userId: '',
            tel: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(TEL_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })
})