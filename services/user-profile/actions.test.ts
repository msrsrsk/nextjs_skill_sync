import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createUserProfile,
    updateUserProfileIconUrl,
    updateUserProfileName,
    updateUserProfileTel
} from "@/services/user-profile/actions"

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
        mockCreateUserProfileWithTransaction.mockResolvedValue({ success: true })

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
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateUserProfileWithTransaction.mockResolvedValue(null)

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
        mockUpdateUserProfileIconUrl.mockResolvedValue({ success: true })

        const result = await updateUserProfileIconUrl({
            userId: 'test-user-id',
            iconUrl: 'test-icon-url'
        })

        expect(result.success).toBe(true)
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserProfileIconUrl.mockResolvedValue(null)

        const result = await updateUserProfileIconUrl({
            userId: '',
            iconUrl: ''
        })

        expect(result.success).toBe(false)
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
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserProfileName.mockResolvedValue(null)

        const result = await updateUserProfileName({
            userId: '',
            lastname: '',
            firstname: ''
        })

        expect(result.success).toBe(false)
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
        mockUpdateUserProfileTel.mockResolvedValue({ success: true })

        const result = await updateUserProfileTel({
            userId: 'test-user-id',
            tel: 'test-tel'
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserProfileTel.mockResolvedValue(null)

        const result = await updateUserProfileTel({
            userId: '',
            tel: ''
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})