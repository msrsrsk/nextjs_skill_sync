import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createUserImage,
    updateUserImageFilePath,
    getUserImageFilePathWithTransaction,
    deleteExistingImage
} from "@/services/user-image/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_IMAGE_ERROR } = ERROR_MESSAGES;

const { USER_REQUIRED_DATA_NOT_FOUND } = USER_IMAGE_ERROR;

const mockCreateUserImageWithTransaction = vi.fn()
const mockUpdateUserImageFilePath = vi.fn()
const mockGetUserImageFilePathWithTransaction = vi.fn()
const mockGetUserImageId = vi.fn()
const mockDeleteProfileImage = vi.fn()

vi.mock('@/repository/userImage', () => ({
    createUserImageRepository: () => ({
        createUserImageWithTransaction: mockCreateUserImageWithTransaction
    }),
    getUserImageRepository: () => ({
        getUserImageFilePathWithTransaction: mockGetUserImageFilePathWithTransaction,
        getUserImageId: mockGetUserImageId,
    }),
    updateUserImageRepository: () => ({
        updateUserImageFilePath: mockUpdateUserImageFilePath
    })
}))

vi.mock('@/services/cloudflare/actions', () => ({
    deleteProfileImage: vi.fn()
}))

const getMockDeleteProfileImage = async () => {
    const { deleteProfileImage } = await import('@/services/cloudflare/actions')
    return vi.mocked(deleteProfileImage)
}

/* ==================================== 
    Create User Image Test
==================================== */
describe('createUserImage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        tx: {} as unknown as TransactionClient,
    }

    // 作成成功
    it('should create user profile successfully', async () => {
        mockCreateUserImageWithTransaction.mockResolvedValue({ success: true })

        const result = await createUserImage({
            ...commonParams,
            userId: 'test-user-id'
        })

        expect(result.success).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateUserImageWithTransaction.mockResolvedValue(null)

        const result = await createUserImage({
            ...commonParams,
            userId: ''
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Get User Image File Path With Transaction Test
==================================== */
describe('getUserImageFilePathWithTransaction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        tx: {} as unknown as TransactionClient,
    }

    // 取得成功
    it('should get user image file path successfully', async () => {
        mockGetUserImageFilePathWithTransaction.mockResolvedValue({ file_path: 'test-file-path' })

        const result = await getUserImageFilePathWithTransaction({
            ...commonParams,
            userId: 'test-user-id'
        })

        expect(result.data).toBe('test-file-path')
    })

    // 取得失敗
    it('should return failure when repository fails', async () => {
        mockGetUserImageFilePathWithTransaction.mockResolvedValue(undefined)

        const result = await getUserImageFilePathWithTransaction({
            ...commonParams,
            userId: '',
        })

        expect(result.data).toBeUndefined()
    })
})

/* ==================================== 
    Update User Image File Path Test
==================================== */
describe('updateUserImageFilePath', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update user image file path successfully', async () => {
        mockUpdateUserImageFilePath.mockResolvedValue({ success: true })

        const result = await updateUserImageFilePath({
            userId: 'test-user-id',
            filePath: 'test-file-path'
        })

        expect(result.success).toBe(true)
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateUserImageFilePath.mockResolvedValue(null)

        const result = await updateUserImageFilePath({
            userId: '',
            filePath: ''
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Delete Existing Image Test
==================================== */
describe('deleteExistingImage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        userId: 'test-user-id',
        isDefault: false
    }

    // デフォルトアイコンの場合
    it('should do nothing for default icons', async () => {
        await deleteExistingImage({
            userId: 'test-user-id',
            isDefault: true
        })

        expect(mockGetUserImageId).not.toHaveBeenCalled()
    })

    // 削除成功
    it('should delete existing image successfully', async () => {
        const mockDeleteProfileImage = await getMockDeleteProfileImage()

        mockGetUserImageId.mockResolvedValue({ id: 'test-user-image-id' })
        mockDeleteProfileImage.mockResolvedValue({ success: true, error: null })

        await deleteExistingImage(commonParams)

        expect(mockGetUserImageId).toHaveBeenCalledWith({ userId: commonParams.userId })
        expect(mockDeleteProfileImage).toHaveBeenCalledWith({ userImageId: 'test-user-image-id' })
    })

    // 削除失敗（ユーザー画像のIDの取得失敗）
    it('should return failure when user image id is not found', async () => {
        mockGetUserImageId.mockResolvedValue(null)

        await expect(deleteExistingImage(commonParams))
            .rejects.toThrow(USER_REQUIRED_DATA_NOT_FOUND)

        expect(mockGetUserImageId).toHaveBeenCalledWith({ userId: commonParams.userId })
    })

    // 削除失敗（ユーザー画像の削除失敗）
    it('should handle delete profile image failure gracefully', async () => {
        const mockDeleteProfileImage = await getMockDeleteProfileImage()

        mockGetUserImageId.mockResolvedValue({ id: 'test-user-image-id' })
        mockDeleteProfileImage.mockResolvedValue({ 
            success: false, 
            error: 'test-error' 
        })

        await expect(deleteExistingImage(commonParams))
            .resolves.toBeUndefined()

        expect(mockGetUserImageId).toHaveBeenCalledWith({ userId: commonParams.userId })
        expect(mockDeleteProfileImage).toHaveBeenCalledWith({ userImageId: 'test-user-image-id' })
    })
})