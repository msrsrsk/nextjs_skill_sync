import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest"

import {
    updateIconImageAction,
    updateNameAction,
    updateTelAction
} from "@/services/user-profile/form-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_PROFILE_ERROR } = ERROR_MESSAGES;

const { 
    ICON_UPDATE_MISSING_DATA, 
    ICON_UPDATE_UNAUTHORIZED,
    ICON_UPDATE_FAILED,
    NAME_UPDATE_UNAUTHORIZED,
    NAME_UPDATE_MISSING_DATA,
    NAME_UPDATE_FAILED,
    TEL_UPDATE_MISSING_DATA,
    TEL_UPDATE_UNAUTHORIZED,
    TEL_UPDATE_FAILED
} = USER_PROFILE_ERROR;

vi.mock('@/lib/auth/middleware', () => ({
    auth: vi.fn()
}))

vi.mock('@/lib/middleware/auth', () => ({
    actionAuth: vi.fn()
}))

vi.mock('@/services/user-image/actions', () => ({
    deleteExistingImage: vi.fn()
}))

vi.mock('@/services/cloudflare/actions', () => ({
    uploadImageIfNeeded: vi.fn()
}))

vi.mock('@/services/user-profile/actions', () => ({
    updateUserProfileIconUrl: vi.fn(),
    updateUserProfileName: vi.fn(),
    updateUserProfileTel: vi.fn()
}))

const getMockAuth = async () => {
    const { auth } = await import('@/lib/auth/middleware')
    return vi.mocked(auth) as unknown as MockedFunction<() => Promise<Session | null>>
}

const getMockActionAuth = async () => {
    const { actionAuth } = await import('@/lib/middleware/auth')
    return vi.mocked(actionAuth)
}

const getMockDeleteExistingImage = async () => {
    const { deleteExistingImage } = await import('@/services/user-image/actions')
    return vi.mocked(deleteExistingImage)
}

const getMockUploadImageIfNeeded = async () => {
    const { uploadImageIfNeeded } = await import('@/services/cloudflare/actions')
    return vi.mocked(uploadImageIfNeeded)
}

const getMockUpdateUserProfileIconUrl = async () => {
    const { updateUserProfileIconUrl } = await import('@/services/user-profile/actions')
    return vi.mocked(updateUserProfileIconUrl)
}

const getMockUpdateUserProfileName = async () => {
    const { updateUserProfileName } = await import('@/services/user-profile/actions')
    return vi.mocked(updateUserProfileName)
}

const getMockUpdateUserProfileTel = async () => {
    const { updateUserProfileTel } = await import('@/services/user-profile/actions')
    return vi.mocked(updateUserProfileTel)
}

/* ==================================== 
    Update Icon Image Action Test
==================================== */
describe('updateIconImageAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        success: true, 
        userId: 'test-user-id' 
    }

    const commonFormData = new FormData()
    commonFormData.set('icon_url', 'test-icon-url')

    // アイコンURLの更新成功
    it('should update icon image successfully', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockDeleteExistingImage = await getMockDeleteExistingImage()
        const mockUploadImageIfNeeded = await getMockUploadImageIfNeeded()
        const mockUpdateUserProfileIconUrl = await getMockUpdateUserProfileIconUrl()

        mockActionAuth.mockResolvedValue(commonParams)
        mockDeleteExistingImage.mockResolvedValue(undefined)
        mockUploadImageIfNeeded.mockResolvedValue('test-icon-url')
        mockUpdateUserProfileIconUrl.mockResolvedValue({ 
            success: true,
            error: null
        })

        const result = await updateIconImageAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )

        expect(result.success).toBe(true)
        expect(result.data).toBe('test-icon-url')
    })

    // アイコンURLの更新失敗(アイコンURL無し)
    it('should return failure when icon url is missing', async () => {
        const formData = new FormData()
        formData.set('icon_url', '')
    
        const result = await updateIconImageAction(
            {
                success: false,
                error: ICON_UPDATE_MISSING_DATA,
                timestamp: 0
            },
            formData,
            ''
        )
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(ICON_UPDATE_MISSING_DATA)
        expect(result.data).toBeNull()
    })

    // アイコンURLの更新失敗(認証失敗)
    it('should return failure when authorization fails', async () => {
        const mockActionAuth = await getMockActionAuth()
    
        mockActionAuth.mockResolvedValue({ 
            success: false, 
            error: ICON_UPDATE_UNAUTHORIZED,
            data: null,
            timestamp: Date.now()
        })

        const result = await updateIconImageAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(ICON_UPDATE_UNAUTHORIZED)
        expect(result.data).toBeNull()
    })

    // アイコンURLの更新失敗(既存画像削除失敗)
    it('should return failure when delete existing image fails', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockDeleteExistingImage = await getMockDeleteExistingImage()
        const mockUploadImageIfNeeded = await getMockUploadImageIfNeeded()

        mockActionAuth.mockResolvedValue(commonParams)
        mockDeleteExistingImage.mockRejectedValue(new Error('Delete failed'))
        mockUploadImageIfNeeded.mockResolvedValue('test-icon-url')

        const result = await updateIconImageAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Delete failed')
        expect(result.data).toBeNull()
    })

    // アイコンURLの更新失敗(新規画像のアップロード失敗)
    it('should return failure when upload image fails', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockDeleteExistingImage = await getMockDeleteExistingImage()
        const mockUploadImageIfNeeded = await getMockUploadImageIfNeeded()

        mockActionAuth.mockResolvedValue(commonParams)
        mockDeleteExistingImage.mockResolvedValue(undefined)
        mockUploadImageIfNeeded.mockRejectedValue(new Error('Upload failed'))

        const result = await updateIconImageAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Upload failed')
        expect(result.data).toBeNull()
    })

    // アイコンURLの更新失敗(データベース更新失敗)
    it('should return failure when database update fails', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockDeleteExistingImage = await getMockDeleteExistingImage()
        const mockUploadImageIfNeeded = await getMockUploadImageIfNeeded()
        const mockUpdateUserProfileIconUrl = await getMockUpdateUserProfileIconUrl()

        mockActionAuth.mockResolvedValue(commonParams)
        mockDeleteExistingImage.mockResolvedValue(undefined)
        mockUploadImageIfNeeded.mockResolvedValue('test-icon-url')
        mockUpdateUserProfileIconUrl.mockResolvedValue({ 
            success: false,
            error: ICON_UPDATE_FAILED
        })

        const result = await updateIconImageAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(ICON_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })

    // アイコンURLの更新失敗(データベース更新の例外発生)
    it('should return failure when database update fails', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockDeleteExistingImage = await getMockDeleteExistingImage()
        const mockUploadImageIfNeeded = await getMockUploadImageIfNeeded()
        const mockUpdateUserProfileIconUrl = await getMockUpdateUserProfileIconUrl()

        mockActionAuth.mockResolvedValue(commonParams)
        mockDeleteExistingImage.mockResolvedValue(undefined)
        mockUploadImageIfNeeded.mockResolvedValue('test-icon-url')
        mockUpdateUserProfileIconUrl.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateIconImageAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 予期しないエラー
    it('should handle unexpected errors', async () => {
        const mockActionAuth = await getMockActionAuth()
        
        mockActionAuth.mockRejectedValue(new Error('Unexpected error'))
    
        const result = await updateIconImageAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData,
            'test-icon-image'
        )
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Unexpected error')
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Name Action Test
==================================== */
describe('updateNameAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    const commonParams = {
        user: {
            id: 'test-user-id',
            name: 'test-user',
            email: 'test@example.com'
        },
        expires: new Date().toISOString()
    }

    const commonFormData = new FormData()
    commonFormData.set('lastname', 'test-lastname')
    commonFormData.set('firstname', 'test-firstname')

    // 名前の更新成功
    it('should update name successfully', async () => {
        const mockAuth = await getMockAuth()
        const mockUpdateUserProfileName = await getMockUpdateUserProfileName()

        mockAuth.mockResolvedValue(commonParams)
        mockUpdateUserProfileName.mockResolvedValue({ 
            success: true, 
            error: null,
            data: { 
                lastname: 'test-lastname', 
                firstname: 'test-firstname',
                created_at: new Date(),
                updated_at: new Date(),
                user_id: 'test-user-id',
                icon_url: 'test-icon-url',
                tel: 'test-tel'
            } 
        })

        const result = await updateNameAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData
        )

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 名前の更新失敗(認証失敗)
    it('should return failure when authorization fails', async () => {
        const mockAuth = await getMockAuth()

        mockAuth.mockResolvedValue({
            user: {
                id: '',
                name: '',
                email: ''
            },
            expires: new Date().toISOString()
        })

        const result = await updateNameAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            commonFormData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(NAME_UPDATE_UNAUTHORIZED)
        expect(result.data).toEqual({
            lastname: null,
            firstname: null
        })
    })

    // 名前の更新失敗(データ不足)
    it('should return failure when data is missing', async () => {
        const mockAuth = await getMockAuth()

        mockAuth.mockResolvedValue(commonParams)

        const formData = new FormData()
        formData.set('lastname', '')
        formData.set('firstname', '')

        const result = await updateNameAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(NAME_UPDATE_MISSING_DATA)
        expect(result.data).toEqual({
            lastname: null,
            firstname: null
        })
    })

    // 名前の更新失敗
    it('should return failure when repository fails', async () => {
        const mockAuth = await getMockAuth()
        const mockUpdateUserProfileName = await getMockUpdateUserProfileName()

        mockAuth.mockResolvedValue(commonParams)
        mockUpdateUserProfileName.mockResolvedValue({
            success: false,
            error: NAME_UPDATE_FAILED,
            data: null
        })

        const result = await updateNameAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe(NAME_UPDATE_FAILED)
        expect(result.data).toEqual({
            lastname: null,
            firstname: null
        })
    })

    // 名前の更新失敗(例外発生)
    it('should return failure when update user profile name repository exception occurs', async () => {
        const mockAuth = await getMockAuth()
        const mockUpdateUserProfileName = await getMockUpdateUserProfileName()

        mockAuth.mockResolvedValue(commonParams)
        mockUpdateUserProfileName.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateNameAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toEqual({
            lastname: null,
            firstname: null
        })
    })

    // 予期しないエラー
    it('should handle unexpected errors', async () => {
        const mockAuth = await getMockAuth()
        
        mockAuth.mockRejectedValue(new Error('Unexpected error'))
    
        const result = await updateNameAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Unexpected error')
        expect(result.data).toEqual({
            lastname: null,
            firstname: null
        })
    })
})

/* ==================================== 
    Update Tel Action Test
==================================== */
describe('updateTelAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    const commonParams = {
        success: true, 
        userId: 'test-user-id' 
    }

    const commonFormData = new FormData()
    commonFormData.set('tel', 'test-tel')

    // 電話番号の更新成功
    it('should update tel successfully', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserProfileTel = await getMockUpdateUserProfileTel()

        mockActionAuth.mockResolvedValue(commonParams)
        mockUpdateUserProfileTel.mockResolvedValue({ 
            success: true, 
            error: null,
            data: { 
                tel: 'test-tel',
                created_at: new Date(),
                updated_at: new Date(),
                user_id: 'test-user-id',
                icon_url: 'test-icon-url',
                lastname: 'test-lastname',
                firstname: 'test-firstname'
            } 
        })

        const result = await updateTelAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData
        )

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 電話番号の更新失敗(データ不足)
    it('should return failure when data is missing', async () => {
        const mockActionAuth = await getMockActionAuth()

        mockActionAuth.mockResolvedValue(commonParams)

        const formData = new FormData()
        formData.set('tel', '')

        const result = await updateTelAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(TEL_UPDATE_MISSING_DATA)
        expect(result.data).toBeNull()
    })

    // 電話番号の更新失敗(認証失敗)
    it('should return failure when authorization fails', async () => {
        const mockActionAuth = await getMockActionAuth()
    
        mockActionAuth.mockResolvedValue({ 
            success: false, 
            error: TEL_UPDATE_UNAUTHORIZED,
        })

        const result = await updateTelAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(TEL_UPDATE_UNAUTHORIZED)
        expect(result.data).toBeNull()
    })

    // 電話番号の更新失敗
    it('should return failure when repository fails', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserProfileTel = await getMockUpdateUserProfileTel()

        mockActionAuth.mockResolvedValue(commonParams)
        mockUpdateUserProfileTel.mockResolvedValue({
            success: false,
            error: TEL_UPDATE_FAILED,
            data: null
        })

        const result = await updateTelAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe(TEL_UPDATE_FAILED)
        expect(result.data).toBeNull()
    })
    
    // 電話番号の更新失敗（例外発生）
    it('should return failure when update user profile tel repository exception occurs', async () => {
        const mockActionAuth = await getMockActionAuth()
        const mockUpdateUserProfileTel = await getMockUpdateUserProfileTel()

        mockActionAuth.mockResolvedValue(commonParams)
        mockUpdateUserProfileTel.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateTelAction(
            {
                success: false,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 予期しないエラー
    it('should handle unexpected errors', async () => {
        const mockActionAuth = await getMockActionAuth()
        
        mockActionAuth.mockRejectedValue(new Error('Unexpected error'))
    
        const result = await updateTelAction(
            {
                success: true,
                error: null,
                timestamp: 0
            },
            commonFormData
        )
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Unexpected error')
        expect(result.data).toBeNull()
    })
})