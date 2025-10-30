import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { S3Client } from "@aws-sdk/client-s3"

import {
    uploadSingleFile,
    uploadImageIfNeeded,
    authenticateAndAuthorizeUserImage,
    deleteObjectFromR2,
    deleteProfileImage,
    deleteReviewImage
} from "@/services/cloudflare/actions"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_REVIEW, BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { CLOUDFLARE_ERROR, USER_IMAGE_ERROR, USER_PROFILE_ERROR } = ERROR_MESSAGES;

const { R2_UPLOAD_FAILED, FETCH_FAILED, PROFILE_ACCESS_DENIED, DELETE_FAILED } = CLOUDFLARE_ERROR;
const { FILE_PATH_UPDATE_FAILED, USER_REQUIRED_DATA_NOT_FOUND } = USER_IMAGE_ERROR;
const { CONVERT_FAILED } = USER_PROFILE_ERROR;

const mockFile = {
    name: 'test-image.jpg',
    type: 'image/jpeg',
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8))
} as unknown as File

const mockUserId = 'user-123'
const mockUserImageId = 'image-456'
const mockAuthenticatedUrl = 'data:image/jpeg;base64,abc123'

const mockSession = {
    session: {
        user: {
          id: mockUserId,
          email: 'test@example.com',
          name: 'Test User',
        },
        expires: new Date().toISOString(),
    },
    user: {
    id: mockUserId,
    email: 'test@example.com',
    name: 'Test User',
    },
    userId: mockUserId,
}

const mockS3Client = {
    send: vi.fn(),
    config: {},
    destroy: vi.fn(),
    middlewareStack: {
        add: vi.fn(),
        addRelativeTo: vi.fn(),
        clone: vi.fn(),
        concat: vi.fn(),
        remove: vi.fn(),
        removeByTag: vi.fn(),
        use: vi.fn()
    }
} as unknown as S3Client

const mockGetUserImageId = vi.fn()
const mockGetUserImageByImageId = vi.fn()
const mockGetUserImageFilePathWithTransaction = vi.fn()

vi.mock('@/lib/middleware/auth', () => ({
    requireUser: vi.fn()
}))

vi.mock('@/lib/clients/cloudflare/client', () => ({
    createR2Client: vi.fn()
}))

vi.mock('@/services/user-image/actions', () => ({
    updateUserImageFilePath: vi.fn()
}))

vi.mock('@/services/file/actions', () => ({
    urlToFile: vi.fn()
}))

vi.mock('@/repository/userImage', () => ({
    getUserImageRepository: () => ({
        getUserImageId: mockGetUserImageId,
        getUserImageByImageId: mockGetUserImageByImageId,
        getUserImageFilePathWithTransaction: mockGetUserImageFilePathWithTransaction
    })
}))

vi.mock('@/services/cloudflare/internal-actions', () => ({
    uploadImageToR2: vi.fn(),
    getAuthenticatedProfileImageUrl: vi.fn(),
}))

const getRequireUser = async () => {
    const { requireUser } = await import('@/lib/middleware/auth')
    return requireUser
}

const getCreateR2Client = async () => {
    const { createR2Client } = await import('@/lib/clients/cloudflare/client')
    return createR2Client
}

const getUpdateUserImageFilePath = async () => {
    const { updateUserImageFilePath } = await import('@/services/user-image/actions')
    return updateUserImageFilePath
}

const getUrlToFile = async () => {
    const { urlToFile } = await import('@/services/file/actions')
    return urlToFile
}

const getUploadImageToR2 = async () => {
    const { uploadImageToR2 } = await import('@/services/cloudflare/internal-actions')
    return uploadImageToR2
}

const getGetAuthenticatedProfileImageUrl = async () => {
    const { getAuthenticatedProfileImageUrl } = await import('@/services/cloudflare/internal-actions')
    return getAuthenticatedProfileImageUrl
}

/* ==================================== 
    Upload Single File Test
==================================== */
describe('uploadSingleFile', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        vi.stubEnv('CLOUDFLARE_R2_PUBLIC_DOMAIN', 'https://example.com')
        vi.stubEnv('REVIEW_BUCKET_NAME', 'review-bucket')
        vi.stubEnv('PROFILE_BUCKET_NAME', 'profile-bucket')
        vi.stubEnv('REVIEW_R2_ACCESS_KEY_ID', 'review-key')
        vi.stubEnv('REVIEW_R2_SECRET_ACCESS_KEY', 'review-secret')
        vi.stubEnv('PROFILE_R2_ACCESS_KEY_ID', 'profile-key')
        vi.stubEnv('PROFILE_R2_SECRET_ACCESS_KEY', 'profile-secret')
        vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'account-123')

        const createR2Client = await getCreateR2Client()
        vi.mocked(createR2Client).mockReturnValue({
            client: mockS3Client,
            bucketName: 'test-bucket'
        })
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    // アップロード成功（レビュー画像の場合）
    it('should upload review image successfully', async () => {
        const createR2Client = await getCreateR2Client()
        const updateUserImageFilePath = await getUpdateUserImageFilePath()
    
        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const result = await uploadSingleFile({
            file: mockFile,
            userImageId: mockUserImageId,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: true,
            error: null,
            data: expect.stringContaining(`https://example.com/${BUCKET_REVIEW}/${mockUserImageId}/`)
        })
    
        expect(createR2Client).toHaveBeenCalledWith(BUCKET_REVIEW)
        expect(mockS3Client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                input: expect.objectContaining({
                    Bucket: 'test-bucket',
                    Key: expect.stringContaining(`${BUCKET_REVIEW}/${mockUserImageId}/`),
                    Body: expect.any(Buffer),
                    ContentType: 'image/jpeg',
                    Metadata: expect.objectContaining({
                        'user-image-id': mockUserImageId,
                        'bucket-type': BUCKET_REVIEW,
                        'uploaded-at': expect.any(String)
                    })
                })
            })
        )
        expect(updateUserImageFilePath).not.toHaveBeenCalled()
    })

    // アップロード成功（プロフィール画像の場合）
    it('should upload profile image successfully', async () => {
        const createR2Client = await getCreateR2Client()
        const updateUserImageFilePath = await getUpdateUserImageFilePath()
    
        vi.mocked(mockS3Client.send).mockResolvedValue()
        vi.mocked(updateUserImageFilePath).mockResolvedValue({
            success: true,
            error: null
        })
    
        const result = await uploadSingleFile({
            file: mockFile,
            userImageId: mockUserImageId,
            bucketType: BUCKET_PROFILE,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: true,
            error: null,
            data: mockUserImageId
        })
    
        expect(createR2Client).toHaveBeenCalledWith(BUCKET_PROFILE)
        expect(updateUserImageFilePath).toHaveBeenCalledWith({
            userId: mockUserId,
            filePath: expect.stringContaining(`${BUCKET_PROFILE}/${mockUserImageId}/`)
        })
    })

    // アップロード失敗（R2 アップロードエラー）
    it('should handle R2 upload error', async () => {
        vi.mocked(mockS3Client.send).mockRejectedValue(new Error('R2 upload failed'))

        const result = await uploadSingleFile({
            file: mockFile,
            userImageId: mockUserImageId,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })

        expect(result).toEqual({
            success: false,
            error: 'R2 upload failed',
            data: null
        })
    })

    // アップロード失敗（プロフィール画像の更新エラー）
    it('should handle profile image database update error', async () => {
        const updateUserImageFilePath = await getUpdateUserImageFilePath()

        vi.mocked(mockS3Client.send).mockResolvedValue()
        vi.mocked(updateUserImageFilePath).mockResolvedValue({
            success: false,
            error: FILE_PATH_UPDATE_FAILED
        })

        const result = await uploadSingleFile({
            file: mockFile,
            userImageId: mockUserImageId,
            bucketType: BUCKET_PROFILE,
            userId: mockUserId
        })

        expect(result).toEqual({
            success: false,
            error: FILE_PATH_UPDATE_FAILED,
            data: null
        })
    })

    // アップロード失敗（ファイルの arrayBuffer エラー）
    it('should handle file arrayBuffer error', async () => {
        const fileWithError = {
            ...mockFile,
            arrayBuffer: vi.fn().mockRejectedValue(new Error('File read error'))
        } as unknown as File

        const result = await uploadSingleFile({
            file: fileWithError,
            userImageId: mockUserImageId,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })

        expect(result).toEqual({
            success: false,
            error: 'File read error',
            data: null
        })
    })

    // アップロード失敗（createR2Client エラー）
    it('should handle createR2Client error', async () => {
        const createR2Client = await getCreateR2Client()

        vi.mocked(createR2Client).mockImplementation(() => {
            throw new Error('R2 client creation failed')
        })

        const result = await uploadSingleFile({
            file: mockFile,
            userImageId: mockUserImageId,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })

        expect(result).toEqual({
            success: false,
            error: 'R2 client creation failed',
            data: null
        })
    })
})

/* ==================================== 
    Upload Image If Needed Test
==================================== */
describe('uploadImageIfNeeded', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        vi.stubEnv('CLOUDFLARE_R2_PUBLIC_DOMAIN', 'https://example.com')
        vi.stubEnv('REVIEW_BUCKET_NAME', 'review-bucket')
        vi.stubEnv('PROFILE_BUCKET_NAME', 'profile-bucket')
        vi.stubEnv('REVIEW_R2_ACCESS_KEY_ID', 'review-key')
        vi.stubEnv('REVIEW_R2_SECRET_ACCESS_KEY', 'review-secret')
        vi.stubEnv('PROFILE_R2_ACCESS_KEY_ID', 'profile-key')
        vi.stubEnv('PROFILE_R2_SECRET_ACCESS_KEY', 'profile-secret')
        vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'account-123')
    })

    // アップロード成功（iconUrl が data: から始まらない場合）
    it('should return original URL when not a data URL', async () => {
        const result = await uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: 'https://example.com/image.jpg',
            bucketType: BUCKET_PROFILE
        })
        
        expect(result).toBe('https://example.com/image.jpg')
    })

    // アップロード成功（iconUrl が data: から始まる場合）
    it('should upload data URL and return authenticated URL', async () => {
        const uploadImageToR2 = await getUploadImageToR2()
        const getAuthenticatedProfileImageUrl = await getGetAuthenticatedProfileImageUrl()

        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockResolvedValue({
            success: true,
            error: null,
            data: mockFile
        })

        vi.mocked(uploadImageToR2).mockResolvedValue({
            success: true,
            error: null,
            data: ['image-123']
        })

        vi.mocked(getAuthenticatedProfileImageUrl).mockResolvedValue({
            success: true,
            error: null,
            data: mockAuthenticatedUrl
        })

        const result = await uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })

        expect(result).toBe(mockAuthenticatedUrl)
    })

    // アップロード失敗（urlToFile が失敗の場合）
    it('should handle urlToFile error', async () => {
        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockResolvedValue({
            success: false,
            error: CONVERT_FAILED,
            data: null
        })

        await expect(uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })).rejects.toThrow(CONVERT_FAILED)
    })

    // アップロード失敗（uploadImageToR2 が失敗の場合）
    it('should handle uploadImageToR2 error', async () => {
        const uploadImageToR2 = await getUploadImageToR2()

        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockResolvedValue({
            success: true,
            error: null,
            data: mockFile
        })

        vi.mocked(uploadImageToR2).mockResolvedValue({
            success: false,
            error: R2_UPLOAD_FAILED,
            data: null
        })

        await expect(uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })).rejects.toThrow(R2_UPLOAD_FAILED)
    })

    // アップロード失敗（getAuthenticatedProfileImageUrl が失敗の場合）
    it('should handle getAuthenticatedProfileImageUrl error', async () => {
        const uploadImageToR2 = await getUploadImageToR2()
        const getAuthenticatedProfileImageUrl = await getGetAuthenticatedProfileImageUrl()

        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockResolvedValue({
            success: true,
            error: null,
            data: mockFile
        })

        vi.mocked(uploadImageToR2).mockResolvedValue({
            success: true,
            error: null,
            data: ['image-123']
        })

        vi.mocked(getAuthenticatedProfileImageUrl).mockResolvedValue({
            success: false,
            error: FETCH_FAILED,
            data: null
        })

        await expect(uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })).rejects.toThrow(FETCH_FAILED)
    })

    // アップロード失敗（urlToFile が例外の場合）
    it('should handle urlToFile exception error', async () => {
        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockRejectedValue(new Error('Unexpected error'))
        
        await expect(uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })).rejects.toThrow('Unexpected error')
    })

    // アップロード失敗（uploadImageToR2 が例外の場合）
    it('should handle uploadImageToR2 exception error', async () => {
        const uploadImageToR2 = await getUploadImageToR2()

        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockResolvedValue({
            success: true,
            error: null,
            data: mockFile
        })

        vi.mocked(uploadImageToR2).mockRejectedValue(new Error('Unexpected error'))

        await expect(uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })).rejects.toThrow('Unexpected error')
    })

    // アップロード失敗（getAuthenticatedProfileImageUrl が例外の場合）
    it('should handle getAuthenticatedProfileImageUrl exception error', async () => {
        const uploadImageToR2 = await getUploadImageToR2()
        const getAuthenticatedProfileImageUrl = await getGetAuthenticatedProfileImageUrl()

        const urlToFile = await getUrlToFile()
        
        vi.mocked(urlToFile).mockResolvedValue({
            success: true,
            error: null,
            data: mockFile
        })

        vi.mocked(uploadImageToR2).mockResolvedValue({
            success: true,
            error: null,
            data: ['image-123']
        })

        vi.mocked(getAuthenticatedProfileImageUrl).mockRejectedValue(new Error('Unexpected error'))

        await expect(uploadImageIfNeeded({
            userId: mockUserId,
            iconUrl: mockAuthenticatedUrl,
            bucketType: BUCKET_PROFILE
        })).rejects.toThrow('Unexpected error')
    })
})

/* ==================================== 
    Authenticate And Authorize User Image Test
==================================== */
describe('authenticateAndAuthorizeUserImage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
  
    afterEach(() => {
        vi.unstubAllEnvs()
    })
  
    // 認証成功
    it('should authenticate and authorize user image successfully', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
        
        mockGetUserImageByImageId.mockResolvedValue({
            user_id: mockUserId,
            file_path: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg`
        })
    
        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: true,
            error: null,
            data: { 
                fileOwnerId: mockUserId, 
                filePath: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg` 
            }
        })
    })

    // 認証失敗（userImageId が null）
    it('should handle user image id not found error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
        
        mockGetUserImageByImageId.mockResolvedValue(null)
    
        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        })
    })

    // 認証失敗（fileOwnerId が null）
    it('should handle file owner id not found error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
        
        mockGetUserImageByImageId.mockResolvedValue({
            user_id: null,
            file_path: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg`
        })

        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        })
    })

    // 認証失敗（file_path が null）
    it('should handle file path not found error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
        
        mockGetUserImageByImageId.mockResolvedValue({
            user_id: mockUserId,
            file_path: null
        })

        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        })
    })

    // 認証失敗（fileOwnerId と userId が一致しない場合）
    it('should handle file owner id not match user id error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
        
        mockGetUserImageByImageId.mockResolvedValue({
            user_id: 'other-user',
            file_path: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg`
        })

        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: PROFILE_ACCESS_DENIED,
            data: null
        })
    })

    // 認証失敗（getRequireUser が例外の場合）
    it('should handle get require user error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockRejectedValue(new Error('Unexpected error'))
        
        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: 'Unexpected error',
            data: null
        })
    })
  
    // 認証失敗（mockGetUserImageByImageId が例外の場合）
    it('should handle exception error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
        
        mockGetUserImageByImageId.mockRejectedValue(new Error('Unexpected error'))
        
        const result = await authenticateAndAuthorizeUserImage({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: 'Unexpected error',
            data: null
        })
    })
})

/* ==================================== 
    Delete Object From R2 Test
==================================== */
describe('deleteObjectFromR2', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const createR2Client = await getCreateR2Client()
        vi.mocked(createR2Client).mockReturnValue({
            client: mockS3Client,
            bucketName: 'test-bucket',
        })
    })
  
    afterEach(() => {
        vi.unstubAllEnvs()
    })
  
    // 削除成功
    it('should delete object from R2 successfully', async () => {
        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const result = await deleteObjectFromR2({
            bucketType: BUCKET_REVIEW,
            filePath: `${BUCKET_REVIEW}/${mockUserImageId}/foo.jpg`,
        })
    
        expect(result).toEqual({ success: true, error: null })
        expect(mockS3Client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                input: expect.objectContaining({
                    Bucket: 'test-bucket',
                    Key: `${BUCKET_REVIEW}/${mockUserImageId}/foo.jpg`,
                }),
            }),
        )
    })
  
    // 削除失敗（client.send が例外の場合）
    it('should handle client.send exception error', async () => {
        vi.mocked(mockS3Client.send).mockRejectedValue(
            new Error('Unexpected error')
        )
    
        const result = await deleteObjectFromR2({
            bucketType: BUCKET_PROFILE,
            filePath: `${BUCKET_PROFILE}/${mockUserImageId}/bar.jpg`,
        })
    
        expect(result).toEqual({ 
            success: false, 
            error: DELETE_FAILED 
        })
    })
  
    // 削除失敗（createR2Client が例外の場合）
    it('should handle createR2Client exception error', async () => {
        const createR2Client = await getCreateR2Client()
        vi.mocked(createR2Client).mockImplementation(() => {
            throw new Error('Unexpected error')
        })
    
        const result = await deleteObjectFromR2({
            bucketType: BUCKET_REVIEW,
            filePath: `${BUCKET_REVIEW}/${mockUserImageId}/foo.jpg`,
        })
    
        expect(result).toEqual({ 
            success: false, 
            error: DELETE_FAILED
        })
    })
})

/* ==================================== 
    Delete Profile Image Test
==================================== */
describe('deleteProfileImage', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockResolvedValue(mockSession)
    
        const createR2Client = await getCreateR2Client()
        vi.mocked(createR2Client).mockReturnValue({
            client: mockS3Client,
            bucketName: 'test-bucket',
        })
    })
  
    afterEach(() => {
        vi.unstubAllEnvs()
    })
  
    // 削除成功
    it('should delete profile image successfully', async () => {
        mockGetUserImageByImageId.mockResolvedValue({ 
            user_id: mockUserId, 
            file_path: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg` 
        })

        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const result = await deleteProfileImage({ userImageId: mockUserImageId })

        expect(result).toEqual({ 
            success: true, 
            error: null 
        })
        expect(mockS3Client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                input: expect.objectContaining({ 
                    Bucket: 'test-bucket', 
                    Key: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg` 
                })
            })
        )
    })
  
    // 削除失敗（認証失敗）
    it('should handle authentication failed error', async () => {
        mockGetUserImageByImageId.mockResolvedValue(null)
  
        const result = await deleteProfileImage({ userImageId: mockUserImageId })

        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        })
    })
  
    // 削除失敗（filePath が null）
    it('should handle file path not found error', async () => {
        mockGetUserImageByImageId.mockResolvedValue({ 
            user_id: mockUserId, 
            file_path: null 
        })
    
        const result = await deleteProfileImage({ userImageId: mockUserImageId })

        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null,
        })
    })
  
    // 削除失敗（mockS3Client.send で例外発生）
    it('should handle mockS3Client.send exception error', async () => {
        mockGetUserImageByImageId.mockResolvedValue({ 
            user_id: mockUserId, 
            file_path: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg` 
        })
        vi.mocked(mockS3Client.send).mockRejectedValue(new Error('network error'))
    
        const result = await deleteProfileImage({ userImageId: mockUserImageId })
        
        expect(result).toEqual({
            success: false,
            error: DELETE_FAILED,
            data: null
        })
    })
  
    // 削除失敗（認証処理で例外発生）
    it('should handle require user exception error', async () => {
        const requireUser = await getRequireUser()
        vi.mocked(requireUser).mockRejectedValue(new Error('Auth failed'))
    
        const result = await deleteProfileImage({ userImageId: mockUserImageId })
        
        expect(result).toEqual({
            success: false,
            error: 'Auth failed',
            data: null
        })
    })
})

/* ==================================== 
    Delete Review Image Test
==================================== */
describe('deleteReviewImage', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const createR2Client = await getCreateR2Client()
        vi.mocked(createR2Client).mockReturnValue({
            client: mockS3Client,
            bucketName: 'test-bucket',
        })
    })
  
    afterEach(() => {
        vi.unstubAllEnvs()
    })
  
    // 削除成功（画像データが0件の場合）
    it('should delete review image successfully with no images', async () => {
        const result = await deleteReviewImage({ 
            image_urls: [] 
        } as unknown as Review)

        expect(result).toEqual({ 
            success: true, 
            error: undefined 
        })
        expect(mockS3Client.send).not.toHaveBeenCalled()
    })
  
    // 削除成功（複数の URL の削除の場合）
    it('should delete review image successfully with multiple images', async () => {
        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const urls = [
            'https://cdn.example.com/review/image-1/a.jpg',
            'https://cdn.example.com/review/image-2/b.png',
        ]
        const result = await deleteReviewImage({ 
            image_urls: urls 
        } as unknown as Review)

        expect(result).toEqual({ success: true, error: undefined })
        expect(mockS3Client.send).toHaveBeenCalledTimes(2)
        expect(mockS3Client.send).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
            input: expect.objectContaining({
                Bucket: 'test-bucket',
                Key: `${BUCKET_REVIEW}/image-1/a.jpg`,
            }),
            }),
        )
        expect(mockS3Client.send).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                input: expect.objectContaining({
                    Bucket: 'test-bucket',
                    Key: `${BUCKET_REVIEW}/image-2/b.png`,
                }),
            }),
        )
    })
  
    // 削除失敗
    it('どれかの削除で失敗したら DELETE_FAILED を返す', async () => {
      vi.mocked(mockS3Client.send)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error('R2 error'))
    
        const urls = [
            'https://cdn.example.com/review/image-1/a.jpg',
            'https://cdn.example.com/review/image-2/b.png',
        ]

        const result = await deleteReviewImage({ 
            image_urls: urls 
        } as unknown as Review)

        expect(result).toEqual({ 
            success: false, 
            error: DELETE_FAILED 
        })
    })
})