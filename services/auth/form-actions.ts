"use server"

import { signIn, signOut } from "@/lib/auth"

import { actionAuth } from "@/lib/middleware/auth"
import { 
    createVerificationTokenWithPassword, 
    createVerificationTokenWithEmail 
} from "@/services/auth/actions"
import { sendVerificationEmail } from "@/services/email/auth/verification"
import { updatePasswordWithToken } from "@/services/verification-token/actions"
import { getUserRepository } from "@/repository/user"
import { getUser, updateUserPassword } from "@/services/user/actions"
import { 
    AUTH_TYPES, 
    EMAIL_VERIFICATION_TYPES, 
    EMAIL_VERIFICATION_PAGE_TYPES,
    UPDATE_PASSWORD_PAGE_TYPES
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { AUTH_LOGIN, AUTH_REAUTHENTICATE } = AUTH_TYPES;
const { RESET_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { AUTH_ERROR, USER_ERROR } = ERROR_MESSAGES;
const { EMAIL_RESET_PASSWORD_PAGE } = EMAIL_VERIFICATION_PAGE_TYPES;
const { 
    CREATE_ACCOUNT_TYPE, 
    RESET_PASSWORD_TYPE, 
    UPDATE_EMAIL_TYPE
} = EMAIL_VERIFICATION_TYPES;

/* ==================================== 
    アカウント作成（メールアドレス）
==================================== */
export async function createAccountWithEmailAction(
    prevState: ActionStateWithEmailAndTimestamp,
    formData: FormData
): Promise<ActionStateWithEmailAndTimestamp> {

    const lastname = formData.get('lastname');
    const firstname = formData.get('firstname');
    const email = formData.get('email');
    const password = formData.get('password');

    const userData = { 
        email, 
        lastname, 
        firstname, 
        password 
    } as UserData & UserProfileData;

    try {
        // 1. ユーザーデータのチェック
        const repository = getUserRepository();
        const existingUser = await repository.getUserByEmail({
            email: userData.email
        });

        if (existingUser) {
            return {
                success: false, 
                error: AUTH_ERROR.EMAIL_EXISTS,
                email: undefined,
                timestamp: Date.now()
            }
        }

        // 2. 認証トークンの作成
        const { 
            success: createTokenSuccess, 
            error: createTokenError, 
            token
        } = await createVerificationTokenWithPassword(
            userData
        );

        if (!createTokenSuccess) {
            return {
                success: false, 
                error: createTokenError,
                email: undefined,
                timestamp: Date.now()
            }
        }

        if (!token) {
            return {
                success: false, 
                error: AUTH_ERROR.TOKEN_CREATE_FAILED,
                email: undefined,
                timestamp: Date.now()
            }
        }

        // 3. 認証メールの送信
        const { 
            success: sendVerificationSuccess, 
            error: sendVerificationError 
        } = await sendVerificationEmail({ 
            email: userData.email, 
            token,
            type: CREATE_ACCOUNT_TYPE
        })

        if (!sendVerificationSuccess) {
            return {
                success: false, 
                error: sendVerificationError,
                email: undefined,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            email: userData.email,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Create Account With Email error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : AUTH_ERROR.CREATE_ACCOUNT_FAILED;

        return {
            success: false, 
            error: errorMessage,
            email: undefined,
            timestamp: Date.now()
        }
    }
}

/* ==================================== 
    メールアドレスの確認
==================================== */
export async function sendVerificationEmailAction(
    prevState: ActionStateWithEmailAndTimestamp,
    formData: FormData,
    type: EmailVerificationPageType
): Promise<ActionStateWithEmailAndTimestamp> {

    const email = formData.get('email') as UserEmail;

    const emailType = type === EMAIL_RESET_PASSWORD_PAGE 
        ? RESET_PASSWORD_TYPE 
        : UPDATE_EMAIL_TYPE;

    try {
        // 1. ユーザーデータのチェック
        const repository = getUserRepository();
        const existingUser = await repository.getUserByEmail({ email });

        const errorResponse = () => {
            return {
                success: false, 
                error: AUTH_ERROR.EMAIL_EXISTS,
                email: undefined,
                timestamp: Date.now()
            }
        }

        if (type === EMAIL_RESET_PASSWORD_PAGE) {
            if (!existingUser) {
                return errorResponse();
            }
        } else {
            if (existingUser) {
                return errorResponse();
            }
        }

        // 2. 認証トークンの作成
        const { 
            success: tokenSuccess, 
            token
        } = await createVerificationTokenWithEmail(email);

        if (!tokenSuccess || !token) {
            return {
                success: false, 
                error: AUTH_ERROR.TOKEN_CREATE_FAILED,
                email: undefined,
                timestamp: Date.now()
            }
        }

        // 3. 認証メールの送信
        const { 
            success: sendMailSuccess, 
            error: sendMainError 
        } = await sendVerificationEmail({ 
            email, 
            token,
            type: emailType
        });

        if (!sendMailSuccess) {
            return {
                success: false, 
                error: sendMainError,
                email: undefined,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            email,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Send Verification Email error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : AUTH_ERROR.TOKEN_SEND_FAILED;

        return {
            success: false, 
            error: errorMessage,
            email: undefined,
            timestamp: Date.now()
        }
    }
}

/* ==================================== 
    パスワードの更新
==================================== */
export async function updatePasswordAction(
    prevState: ActionStateWithEmailAndTimestamp,
    formData: FormData,
    type: UpdatePasswordPageType
): Promise<ActionStateWithEmailAndTimestamp> {
    
    const password = formData.get('confirmPassword') as UserPassword;

    const token = type === RESET_PASSWORD_PAGE 
        ? formData.get('token') as string 
        : '';

    try {
        // throw new Error('test');
        const errorResponse = (error: string) => {
            return {
                success: false, 
                error,
                timestamp: Date.now()
            }
        }
        
        if (type === RESET_PASSWORD_PAGE) {
            const { success, error } = await updatePasswordWithToken(
                token, 
                password
            );

            if (!success) {
                return errorResponse(error as string);
            }
        } else {
            const authResult = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

            if (!authResult.success) {
                return errorResponse(authResult.error as string);
            }

            const { userId } = authResult;

            const updateUserPasswordResult = await updateUserPassword({
                userId: userId as UserId, 
                password
            });

            if (!updateUserPasswordResult.success) {
                return errorResponse(USER_ERROR.PASSWORD_UPDATE_FAILED);
            }
        }

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Password error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : USER_ERROR.PASSWORD_UPDATE_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            timestamp: Date.now()
        }
    }
}

/* ==================================== 
    ログイン
==================================== */
export async function signInWithCredentialsAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData,
    type: AuthType
): Promise<ActionStateWithTimestamp> {

    const errorText = type === AUTH_LOGIN 
        ? AUTH_ERROR.SIGN_IN_FAILED 
        : AUTH_ERROR.REAUTHENTICATE_FAILED;
    
    const email = formData.get('email') as UserEmail;
    const password = formData.get('password') as UserPassword;

    try {
        if (type === AUTH_REAUTHENTICATE) {
            // セッションチェック
            const authResult = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

            if (!authResult.success) {
                return {
                    success: false,
                    error: authResult.error as string,
                    timestamp: Date.now()
                }
            }

            const { user } = authResult;

            const userData = await getUser({
                userId: user?.id as UserId,
                errorMessage: AUTH_ERROR.USER_NOT_FOUND
            });

            if (userData?.email !== email) {
                return {
                    success: false, 
                    error: AUTH_ERROR.EMAIL_NOT_MATCH,
                    timestamp: Date.now()
                }
            }
        }

        // サインインの実行
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return {
                success: false, 
                error: AUTH_ERROR.INCORRECT_EMAIL_OR_PASSWORD,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - SignIn error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : errorText;

        return {
            success: false, 
            error: errorMessage,
            timestamp: Date.now()
        }
    }
}

/* ==================================== 
    ログアウト
==================================== */
export async function signOutAction() {
    await signOut();
}