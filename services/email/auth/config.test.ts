import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { getVerificationEmailConfig } from "@/services/email/auth/config"
import { EMAIL_VERIFICATION_TYPES, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

const { EMAIL_BASE_URL_MISSING, EMAIL_TOKEN_MISSING } = EMAIL_ERROR;

const { 
    CREATE_ACCOUNT_TYPE, 
    RESET_PASSWORD_TYPE, 
    UPDATE_EMAIL_TYPE 
} = EMAIL_VERIFICATION_TYPES;

const { 
    CREATE_ACCOUNT_VERIFY_PATH, 
    RESET_PASSWORD_NEW_PASSWORD_PATH, 
    EDIT_EMAIL_VERIFY_PATH 
} = SITE_MAP;

/* ==================================== 
    getVerificationEmailConfig Test
==================================== */
describe('getVerificationEmailConfig', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    const testToken = 'test-token-123'

    // アカウント作成の認証メール設定
    it('should return correct config for CREATE_ACCOUNT_TYPE', () => {
        const result = getVerificationEmailConfig(CREATE_ACCOUNT_TYPE, testToken)

        expect(result).toEqual({
            url: `https://example.com${CREATE_ACCOUNT_VERIFY_PATH}?token=${testToken}`,
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        })
    })

    // パスワードリセットの認証メール設定
    it('should return correct config for RESET_PASSWORD_TYPE', () => {
        const result = getVerificationEmailConfig(RESET_PASSWORD_TYPE, testToken)

        expect(result).toEqual({
            url: `https://example.com${RESET_PASSWORD_NEW_PASSWORD_PATH}?token=${testToken}`,
            subject: '【Skill Sync】パスワードリセットのメールアドレス認証のご案内'
        })
    })

    // メールアドレス変更の認証メール設定
    it('should return correct config for UPDATE_EMAIL_TYPE', () => {
        const result = getVerificationEmailConfig(UPDATE_EMAIL_TYPE, testToken)

        expect(result).toEqual({
            url: `https://example.com${EDIT_EMAIL_VERIFY_PATH}?token=${testToken}`,
            subject: '【Skill Sync】メールアドレス変更のアドレス認証のご案内'
        })
    })

    // 異なるトークンでのテスト
    it('should handle different tokens correctly', () => {
        const differentToken = 'different-token-456'
        const result = getVerificationEmailConfig(CREATE_ACCOUNT_TYPE, differentToken)

        expect(result).toEqual({
            url: `https://example.com${CREATE_ACCOUNT_VERIFY_PATH}?token=${differentToken}`,
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        })
    })

    // 環境変数が未設定の場合
    it('should handle missing NEXT_PUBLIC_BASE_URL', () => {
        vi.stubEnv('NEXT_PUBLIC_BASE_URL', undefined)
        
        expect(() => {
            getVerificationEmailConfig(CREATE_ACCOUNT_TYPE, testToken)
        }).toThrow(EMAIL_BASE_URL_MISSING)
    })

    // 空のトークンの場合
    it('should handle empty token', () => {
        const emptyToken = ''

        expect(() => {
            getVerificationEmailConfig(CREATE_ACCOUNT_TYPE, emptyToken)
        }).toThrow(EMAIL_TOKEN_MISSING)
    })
})