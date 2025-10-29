import { describe, it, expect, vi, beforeEach } from "vitest"

import { urlToFile } from "@/services/file/actions"
import { getFileExtension, dataUrlToFile } from "@/lib/utils/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_PROFILE_ERROR } = ERROR_MESSAGES;

const { CONVERT_FAILED } = USER_PROFILE_ERROR;

vi.mock('@/lib/utils/format', () => ({
    getFileExtension: vi.fn(),
    dataUrlToFile: vi.fn()
}))

global.fetch = vi.fn()

/* ==================================== 
    urlToFile Test
==================================== */
describe('urlToFile', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 変換成功
    it('should convert data URL to File successfully', async () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        const filename = 'test-icon.png'
        const mockFile = new File([''], filename, { type: 'image/png' })

        vi.mocked(getFileExtension).mockReturnValue('png')
        vi.mocked(dataUrlToFile).mockReturnValue(mockFile)

        const result = await urlToFile(dataUrl, filename)

        expect(result).toEqual({
            success: true,
            error: null,
            data: mockFile
        })
        expect(dataUrlToFile).toHaveBeenCalledWith(dataUrl, filename)
    })

    // 変換成功（ファイル名が未指定）
    it('should convert data URL to File with default filename', async () => {
        const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
        const mockFile = new File([''], 'icon.jpeg', { type: 'image/jpeg' })

        vi.mocked(getFileExtension).mockReturnValue('jpeg')
        vi.mocked(dataUrlToFile).mockReturnValue(mockFile)

        const result = await urlToFile(dataUrl)

        expect(result).toEqual({
            success: true,
            error: null,
            data: mockFile
        })
        expect(dataUrlToFile).toHaveBeenCalledWith(dataUrl, 'icon.jpeg')
    })

    // 変換成功（HTTP URL）
    it('should convert HTTP URL to File successfully', async () => {
        const url = 'https://example.com/image.jpg'
        const filename = 'test-image.jpg'
        const mockBlob = new Blob([''], { type: 'image/jpeg' })
        const mockFile = new File([''], filename, { type: 'image/jpeg' })

        vi.mocked(fetch).mockResolvedValue({
            blob: vi.fn().mockResolvedValue(mockBlob)
        } as any)
        vi.mocked(getFileExtension).mockReturnValue('jpg')

        const result = await urlToFile(url, filename)

        expect(result).toEqual({
            success: true,
            error: null,
            data: expect.any(File)
        })
        expect(fetch).toHaveBeenCalledWith(url)
        expect(result.data?.name).toBe(filename)
        expect(result.data?.type).toBe('image/jpeg')
    })

    // 変換成功（HTTP URL ファイル名未指定）
    it('should convert HTTP URL to File with default filename', async () => {
        const url = 'https://example.com/image.png'
        const mockBlob = new Blob([''], { type: 'image/png' })

        vi.mocked(fetch).mockResolvedValue({
            blob: vi.fn().mockResolvedValue(mockBlob)
        } as unknown as Response)
        vi.mocked(getFileExtension).mockReturnValue('png')

        const result = await urlToFile(url)

        expect(result).toEqual({
            success: true,
            error: null,
            data: expect.any(File)
        })
        expect(result.data?.name).toBe('icon.png')
        expect(result.data?.type).toBe('image/png')
    })

    // 変換失敗（fetchエラー）
    it('should handle fetch error and return error response', async () => {
        const url = 'https://example.com/invalid-image.jpg'

        vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

        const result = await urlToFile(url)

        expect(result).toEqual({
            success: false,
            error: CONVERT_FAILED,
            data: null
        })
    })

    // 変換失敗（blob エラー）
    it('should handle blob error and return error response', async () => {
        const url = 'https://example.com/image.jpg'

        vi.mocked(fetch).mockResolvedValue({
            blob: vi.fn().mockRejectedValue(new Error('Blob error'))
        } as unknown as Response)

        const result = await urlToFile(url)

        expect(result).toEqual({
            success: false,
            error: CONVERT_FAILED,
            data: null
        })
    })

    // 変換失敗（URL が 空 の場合）
    it('should handle empty URL', async () => {
        const result = await urlToFile('')

        expect(result).toEqual({
            success: false,
            error: CONVERT_FAILED,
            data: null
        })
    })

    // 変換失敗（無効な URL の場合）
    it('should handle invalid data URL', async () => {
        const invalidDataUrl = 'data:invalid'

        vi.mocked(getFileExtension).mockReturnValue('unknown')
        vi.mocked(dataUrlToFile).mockImplementation(() => {
            throw new Error('Invalid data URL')
        })

        await expect(urlToFile(invalidDataUrl)).rejects.toThrow('Invalid data URL')
    })
})