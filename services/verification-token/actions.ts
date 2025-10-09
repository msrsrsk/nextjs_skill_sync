import { 
    createVerificationTokenRepository,
    getVerificationTokenRepository,
    deleteVerificationTokenRepository
} from "@/repository/verificationToken"
import { resetPassword } from "@/services/auth/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, VERIFICATION_TOKEN_ERROR } = ERROR_MESSAGES;

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
        await repository.createVerificationToken({
            verificationData
        })

        return {
            success: true, 
            error: null,
            data: verificationData.token
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
    try {
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
    } catch (error) {
        console.error('Database : Error in getVerificationTokenAndVerify: ', error);

        return {
            success: false, 
            error: VERIFICATION_TOKEN_ERROR.VERIFY_TOKEN_FAILED,
            data: null
        }
    }
}

export const updatePasswordWithToken = async (
    token: string, 
    password: string
) => {
    try {
        const repository = getVerificationTokenRepository();
        const verificationToken = await repository.getVerificationToken({ token });

        if (!verificationToken) {
            throw new Error(USER_ERROR.PASSWORD_RESET_MISSING_DATA);
        }

        if (verificationToken.expires < new Date()) {
            throw new Error(USER_ERROR.EXPIRED_PASSWORD_TOKEN);
        }

        const updatedUser = await resetPassword(
            verificationToken, 
            password
        );

        return {
            success: true, 
            error: null, 
            data: updatedUser
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : USER_ERROR.PASSWORD_UPDATE_FAILED;

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
        await repository.deleteVerificationTokenWithTransaction({
            tx,
            token
        });

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in deleteVerificationToken: ', error);

        return {
            success: false, 
            error: VERIFICATION_TOKEN_ERROR.DELETE_FAILED,
        }
    }
}