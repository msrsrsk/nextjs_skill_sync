import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

import { uploadImageToR2 } from "@/services/cloudflare/internal-actions"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_REVIEW, BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { CLOUDFLARE_ERROR, USER_IMAGE_ERROR } = ERROR_MESSAGES;

const { R2_UPLOAD_PROCESS_FAILED, MISSING_DATA, AUTHENTICATION_FAILED } = CLOUDFLARE_ERROR;
const { USER_REQUIRED_DATA_NOT_FOUND } = USER_IMAGE_ERROR;

const mockUserId = 'user-123'
const mockUserImageId = 'image-456'

type MockGetObjectBody = {
    transformToByteArray: () => Promise<Uint8Array>
}

type MockGetObjectOutput = {
    Body: MockGetObjectBody
    ContentType?: string
}

const mockS3Client = {
    send: vi.fn<(cmd: unknown) => Promise<unknown>>(),
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

vi.mock('@/lib/clients/cloudflare/client', () => ({
    createR2Client: vi.fn()
}))

vi.mock('@/services/user-image/actions', () => ({
    updateUserImageFilePath: vi.fn()
}))

vi.mock('@/services/cloudflare/actions', async (importOriginal) => {
    const actual = await importOriginal()
    return {
      ...(actual as Record<string, unknown>),
      authenticateAndAuthorizeUserImage: vi.fn(),
    }
})

vi.mock('@/repository/userImage', () => ({
    getUserImageRepository: () => ({
        getUserImageId: mockGetUserImageId,
        getUserImageByImageId: mockGetUserImageByImageId,
        getUserImageFilePathWithTransaction: mockGetUserImageFilePathWithTransaction
    })
}))

const getCreateR2Client = async () => {
    const { createR2Client } = await import('@/lib/clients/cloudflare/client')
    return createR2Client
}

const getUpdateUserImageFilePath = async () => {
    const { updateUserImageFilePath } = await import('@/services/user-image/actions')
    return updateUserImageFilePath
}

const getGetAuthenticatedProfileImageUrl = async () => {
    const { getAuthenticatedProfileImageUrl } = await import('@/services/cloudflare/internal-actions')
    return getAuthenticatedProfileImageUrl
}

const getAuthenticateAndAuthorizeUserImage = async () => {
    const { authenticateAndAuthorizeUserImage } = await import('@/services/cloudflare/actions')
    return authenticateAndAuthorizeUserImage
}

/* ==================================== 
    Upload Image To R2 Test
==================================== */
describe('uploadImageToR2', () => {
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

    const mockFiles = [
        {
            name: 'test-image-1.jpg',
            type: 'image/jpeg',
            arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8))
        },
        {
            name: 'test-image-2.jpg',
            type: 'image/jpeg',
            arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8))
        }
    ] as unknown as File[]

    // アップロード成功（複数ファイル）
    it('should upload multiple files successfully', async () => {
        mockGetUserImageId.mockResolvedValue({ id: mockUserImageId })
        
        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: true,
            error: null,
            data: expect.arrayContaining([
                expect.stringContaining('https://example.com/review/image-456/'),
                expect.stringContaining('https://example.com/review/image-456/')
            ])
        })
    
        expect(mockS3Client.send).toHaveBeenCalledTimes(2)
    })

    // アップロード成功（プロフィール画像の場合）
    it('should upload profile images successfully', async () => {
        mockGetUserImageId.mockResolvedValue({ id: mockUserImageId })
    
        const updateUserImageFilePath = await getUpdateUserImageFilePath()
        vi.mocked(updateUserImageFilePath).mockResolvedValue({
            success: true,
            error: null
        })
        
        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_PROFILE,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: true,
            error: null,
            data: [mockUserImageId, mockUserImageId]  // URLではなくuserImageIdの配列を返す
        })
    
        expect(mockS3Client.send).toHaveBeenCalledTimes(2)
        expect(updateUserImageFilePath).toHaveBeenCalledTimes(2)
    })

    // アップロード失敗（ユーザー ID 無し）
    it('should handle user image not found', async () => {
        mockGetUserImageId.mockResolvedValue(null)
        
        vi.mocked(mockS3Client.send).mockResolvedValue()
    
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        })
    })

    // アップロード失敗（ファイルアップロードエラー）
    it('should handle file upload failure', async () => {
        mockGetUserImageId.mockResolvedValue({ id: mockUserImageId })
        
        vi.mocked(mockS3Client.send).mockRejectedValue(new Error('Upload failed'))
    
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: 'Upload failed',
            data: null
        })
    })

    // アップロード失敗（データベースエラー）
    it('should handle database error', async () => {
        mockGetUserImageId.mockResolvedValue({ id: mockUserImageId })
        
        vi.mocked(mockS3Client.send).mockRejectedValue({
            getUserImageId: vi.fn().mockRejectedValue(new Error('Database error')),
            getUserImageByImageId: vi.fn(),
            getUserImageFilePathWithTransaction: vi.fn()
        })
    
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: R2_UPLOAD_PROCESS_FAILED,
            data: null
        })
    })

    // アップロード失敗（updateUserImageFilePath エラー）
    it('should handle updateUserImageFilePath error', async () => {
        mockGetUserImageId.mockResolvedValue({ id: mockUserImageId })
    
        const updateUserImageFilePath = await getUpdateUserImageFilePath()
        vi.mocked(updateUserImageFilePath).mockResolvedValue({
            success: false,
            error: R2_UPLOAD_PROCESS_FAILED
        })
        
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_PROFILE,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: R2_UPLOAD_PROCESS_FAILED,
            data: null
        })
    })

    // アップロード失敗（CLOUDFLARE_R2_PUBLIC_DOMAIN が未設定）
    it('should handle CLOUDFLARE_R2_PUBLIC_DOMAIN not set', async () => {
        vi.stubEnv('CLOUDFLARE_R2_PUBLIC_DOMAIN', '')
        
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: R2_UPLOAD_PROCESS_FAILED,
            data: null
        })
    })

    // アップロード失敗（ファイルが空の場合）
    it('should handle files are empty', async () => {
        const result = await uploadImageToR2({
            files: [],
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: MISSING_DATA,
            data: null
        })
    })

    // アップロード失敗（部分的なファイルアップロードエラー）
    it('should handle partial file upload failure', async () => {
        mockGetUserImageId.mockResolvedValue({ id: mockUserImageId })
        
        vi.mocked(mockS3Client.send)
            .mockResolvedValueOnce()
            .mockRejectedValueOnce(new Error('Second file failed'))
        
        const result = await uploadImageToR2({
            files: mockFiles,
            bucketType: BUCKET_REVIEW,
            userId: mockUserId
        })
    
        expect(result).toEqual({
            success: false,
            error: 'Second file failed',
            data: null
        })
    })
})

/* ==================================== 
    Get Authenticated Profile Image Url Test
==================================== */
describe('getAuthenticatedProfileImageUrl', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const createR2Client = await getCreateR2Client()
        vi.mocked(createR2Client).mockReturnValue({ 
            client: mockS3Client, 
            bucketName: 'test-bucket' 
        })
    })
  
    // 取得成功
    it('should get authenticated profile image url successfully', async () => {
        const getAuthenticatedProfileImageUrl = await getGetAuthenticatedProfileImageUrl()
        const authenticateAndAuthorizeUserImage = await getAuthenticateAndAuthorizeUserImage()
  
        vi.mocked(authenticateAndAuthorizeUserImage).mockResolvedValue({
            success: true, 
            error: null, 
            data: { 
                fileOwnerId: mockUserId, 
                filePath: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg` 
            }
        })

        const getObjectOutput: MockGetObjectOutput = {
            Body: { transformToByteArray: async () => Buffer.from('abc123', 'base64') },
            ContentType: 'image/jpeg'
        }
    
        vi.mocked(mockS3Client.send).mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return getObjectOutput
            return undefined
        })
    
        const result = await getAuthenticatedProfileImageUrl({ 
            userImageId: mockUserImageId 
        })

        const expectedBase64 = Buffer.from('abc123', 'base64').toString('base64')

        expect(result).toEqual({
            success: true,
            error: null,
            data: `data:image/jpeg;base64,${expectedBase64}`
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
  
    // 取得失敗（認証失敗）
    it('should handle authentication failure', async () => {
        const authenticateAndAuthorizeUserImage = await getAuthenticateAndAuthorizeUserImage()
    
        vi.mocked(authenticateAndAuthorizeUserImage).mockResolvedValue({
            success: false, 
            error: AUTHENTICATION_FAILED, 
            data: null
        })
    })

    // 取得失敗（filePath が null）
    it('should handle file path not found error', async () => {
        const getAuthenticatedProfileImageUrl = await getGetAuthenticatedProfileImageUrl()
        const authenticateAndAuthorizeUserImage = await getAuthenticateAndAuthorizeUserImage()

        vi.mocked(authenticateAndAuthorizeUserImage).mockResolvedValue({
            success: true, 
            error: null, 
            data: { 
                fileOwnerId: mockUserId, 
                filePath: null as unknown as string 
            }
        })

        const result = await getAuthenticatedProfileImageUrl({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        })
    })
  
    // 取得失敗（GetObject で例外発生）
    it('should handle get object exception error', async () => {
        const getAuthenticatedProfileImageUrl = await getGetAuthenticatedProfileImageUrl()
        const authenticateAndAuthorizeUserImage = await getAuthenticateAndAuthorizeUserImage()

        vi.mocked(authenticateAndAuthorizeUserImage).mockResolvedValue({
            success: true, 
            error: null, 
            data: { 
                fileOwnerId: mockUserId, 
                filePath: `${BUCKET_PROFILE}/${mockUserImageId}/foo.jpg` 
            }
        })

        vi.mocked(mockS3Client.send).mockRejectedValue(new Error('Cloudflare R2 error'))

        const result = await getAuthenticatedProfileImageUrl({ 
            userImageId: mockUserImageId 
        })

        expect(result).toEqual({
            success: false,
            error: 'Cloudflare R2 error',
            data: null
        })
    })
})