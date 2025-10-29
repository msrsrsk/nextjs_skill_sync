import { EMAIL_VERIFICATION_TYPES, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

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

export const getVerificationEmailConfig = (type: EmailVerificationType, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
        throw new Error(EMAIL_ERROR.EMAIL_BASE_URL_MISSING);
    }
    
    if (!token || token.trim() === '') {
        throw new Error(EMAIL_ERROR.EMAIL_TOKEN_MISSING);
    }
    
    const configs = {
        [CREATE_ACCOUNT_TYPE]: {
            url: `${baseUrl}${CREATE_ACCOUNT_VERIFY_PATH}?token=${token}`,
            subject: '【Skill Sync】アカウント登録のメールアドレス認証のご案内'
        },
        [RESET_PASSWORD_TYPE]: {
            url: `${baseUrl}${RESET_PASSWORD_NEW_PASSWORD_PATH}?token=${token}`,
            subject: '【Skill Sync】パスワードリセットのメールアドレス認証のご案内'
        },
        [UPDATE_EMAIL_TYPE]: {
            url: `${baseUrl}${EDIT_EMAIL_VERIFY_PATH}?token=${token}`,
            subject: '【Skill Sync】メールアドレス変更のアドレス認証のご案内'
        }
    }
    
    return configs[type]
}