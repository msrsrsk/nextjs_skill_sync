import { 
    createVerificationTokenRepository,
    getVerificationTokenRepository,
    deleteVerificationTokenRepository
} from "@/repository/verificationToken"
import { resetPassword } from "@/services/auth/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { AUTH_ERROR, VERIFICATION_TOKEN_ERROR } = ERROR_MESSAGES;

interface GetVerificationTokenAndVerifyProps extends TokenProps {
    notFoundErrorMessage: string;
    expiredErrorMessage: string;
}

// 認証トークンの作成
export const createVerificationToken = async ({ 
    verificationData
}: { verificationData: VerificationData }) => {
    try {
        const repository = createVerificationTokenRepository();
        const result = await repository.createVerificationToken({
            verificationData
        })

        if (!result) {
            return {
                success: false, 
                error: VERIFICATION_TOKEN_ERROR.CREATE_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: result.token
        }
    } catch (error) {
        console.error('Database : Error in createVerificationToken: ', error);

        return {
            success: false, 
            error: VERIFICATION_TOKEN_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// 認証トークンの取得&検証
export const getVerificationTokenAndVerify = async ({ 
    token,
    notFoundErrorMessage,
    expiredErrorMessage
}: GetVerificationTokenAndVerifyProps) => {
    const repository = getVerificationTokenRepository();
    const verificationToken = await repository.getVerificationToken({ token });

    if (!verificationToken) {
        return {
            success: false, 
            error: notFoundErrorMessage,
            data: null
        }
    }

    if (verificationToken.expires < new Date()) {
        return {
            success: false, 
            error: expiredErrorMessage,
            data: null
        }
    }

    return {
        success: true, 
        error: null,
        data: verificationToken
    }
}

// パスワードの更新
export const updatePasswordWithToken = async (
    token: string, 
    password: string
) => {
    try {
        const { 
            success: verificationSuccess, 
            error: verificationError, 
            data: verificationToken 
        } = await getVerificationTokenAndVerify({
            token,
            notFoundErrorMessage: VERIFICATION_TOKEN_ERROR.NOT_FOUND_PASSWORD_TOKEN,
            expiredErrorMessage: VERIFICATION_TOKEN_ERROR.EXPIRED_PASSWORD_TOKEN
        });

        if (!verificationSuccess || !verificationToken) {
            return {
                success: false, 
                error: verificationError,
                data: null
            }
        }

        const { 
            success: resetPasswordSuccess, 
            error: resetPasswordError, 
            data: updatedUser 
        } = await resetPassword(
            verificationToken, 
            password
        );

        if (!resetPasswordSuccess || !updatedUser) {
            return {
                success: false, 
                error: resetPasswordError,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: updatedUser
        }
    } catch (error) {
        console.error('Database : Error in updatePasswordWithToken: ', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : AUTH_ERROR.RESET_PASSWORD_PROCESS_FAILED;

        return {
            success: false, 
            error: errorMessage
        }
    }
}

// 認証トークンの削除
export const deleteVerificationToken = async ({ 
    tx,
    token
}: DeleteVerificationTokenWithTransactionProps) => {
    try {
        const repository = deleteVerificationTokenRepository();
        const result = await repository.deleteVerificationTokenWithTransaction({
            tx,
            token
        });

        if (!result) {
            return {
                success: false, 
                error: VERIFICATION_TOKEN_ERROR.DELETE_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in deleteVerificationToken: ', error);

        return {
            success: false, 
            error: VERIFICATION_TOKEN_ERROR.DELETE_FAILED
        }
    }
}