import { describe, it, expect, vi, beforeEach } from "vitest"

import { formatFileStatusMessage } from "@/services/file/format"
import { FILE_STATUS_TYPES, FILE_UPLOAD_CONFIG } from "@/constants/index"

const { FILE_LOADING, FILE_SUCCESS, FILE_ERROR } = FILE_STATUS_TYPES;
const { MAX_TOTAL_SIZE_TEXT } = FILE_UPLOAD_CONFIG;

/* ==================================== 
    formatFileStatusMessage Test
==================================== */
describe('formatFileStatusMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known file statuses correctly', () => {
        const testCases = [
            { input: FILE_LOADING, expected: '※ファイルをアップロード中...' },
            { input: FILE_SUCCESS, expected: '' },
            { input: FILE_ERROR, expected: `※容量が合計${MAX_TOTAL_SIZE_TEXT}を超えています` }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatFileStatusMessage(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown file statuses', () => {
        const unknownStatus = 'FILE_TEST' as FileStatusType;
        expect(formatFileStatusMessage(unknownStatus)).toBe('');
    })
})