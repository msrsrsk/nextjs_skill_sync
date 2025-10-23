import { describe, it, expect, vi, beforeEach } from "vitest"

import { isDefaultIcon } from "@/services/user-profile/validation"
import { accountInfoIconImages } from "@/data"

/* ==================================== 
    isDefaultIcon Test
==================================== */
describe('isDefaultIcon', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // デフォルトのアイコンURLのテスト
    it('should return true for default icon URLs', () => {
        accountInfoIconImages.forEach(icon => {
            expect(isDefaultIcon(icon.src)).toBe(true)
        })
    })

    // カスタムのアイコンURLのテスト
    it('should return false for custom icon URLs', () => {
        const customIcons = [
            'https://example.com/custom-icon.jpg',
            '/uploads/user123/icon.png',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
        ]
        
        customIcons.forEach(iconUrl => {
            expect(isDefaultIcon(iconUrl)).toBe(false);
        })
    })

    // エッジケースのテスト
    it('should handle edge cases', () => {
        expect(isDefaultIcon('')).toBe(false);
        expect(isDefaultIcon(null as any)).toBe(false);
        expect(isDefaultIcon(undefined as any)).toBe(false);
    })
})