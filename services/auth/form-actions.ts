"use server"

import { signIn, signOut } from "@/lib/auth"

import { actionAuth } from "@/lib/middleware/auth"
import { 
    createVerificationTokenWithPassword, 
    createEmailVerificationTokenWithEmail 
} from "@/services/auth/actions"
import { sendVerificationEmail } from "@/services/email/auth/verification"
import { updatePasswordWithToken } from "@/services/verification-token/actions"
import { getUserRepository } from "@/repository/user"
import { updateUserPassword} from "@/services/user/actions"
import { 
    AUTH_TYPES, 
    EMAIL_VERIFICATION_TYPES, 
    EMAIL_VERIFICATION_PAGE_TYPES,
    UPDATE_PASSWORD_PAGE_TYPES,
    GET_USER_DATA_TYPES,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { AUTH_LOGIN, AUTH_REAUTHENTICATE } = AUTH_TYPES;
const { RESET_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { EMAIL_DATA } = GET_USER_DATA_TYPES;
const { AUTH_ERROR, USER_ERROR, EMAIL_ERROR } = ERROR_MESSAGES;
const { EMAIL_RESET_PASSWORD_PAGE } = EMAIL_VERIFICATION_PAGE_TYPES;
const { 
    CREATE_ACCOUNT_TYPE, 
    RESET_PASSWORD_TYPE, 
    UPDATE_EMAIL_TYPE
} = EMAIL_VERIFICATION_TYPES;

// アカウント作成（メールアドレス）
export async function createAccountWithEmailAction(
    prevState: ActionStateWithEmailAndTimestamp,
    formData: FormData
): Promise<ActionStateWithEmailAndTimestamp> {
    try {
        const lastname = formData.get('lastname');
        const firstname = formData.get('firstname');
        const email = formData.get('email');
        const password = formData.get('password');

        const userData = { 
            email, 
            lastname, 
            firstname, 
            password 
        } as UserData;

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
                error: createTokenError || AUTH_ERROR.CREATE_ACCOUNT_PROCESS_FAILED,
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
                error: sendVerificationError || EMAIL_ERROR.AUTH_SEND_FAILED,
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

        return {
            success: false, 
            error: AUTH_ERROR.CREATE_ACCOUNT_FAILED,
            email: undefined,
            timestamp: Date.now()
        }
    }
}

// メールアドレスの確認
export async function sendVerificationEmailAction(
    prevState: ActionStateWithEmailAndTimestamp,
    formData: FormData,
    type: EmailVerificationPageType
): Promise<ActionStateWithEmailAndTimestamp> {
    const email = formData.get('email') as UserEmail;

    try {
        const repository = getUserRepository();
        const existingUser = await repository.getUserByEmail({ email });

        if (type === EMAIL_RESET_PASSWORD_PAGE) {
            if (!existingUser) {
                return {
                    success: false, 
                    error: AUTH_ERROR.EMAIL_EXISTS,
                    email: undefined,
                    timestamp: Date.now()
                }
            }
        } else {
            if (existingUser) {
                return {
                    success: false, 
                    error: AUTH_ERROR.EMAIL_EXISTS,
                    email: undefined,
                    timestamp: Date.now()
                }
            }
        }

        let emailSuccess;

        const { 
            success: tokenSuccess, 
            token
        } = await createEmailVerificationTokenWithEmail(email);

        if (!tokenSuccess || !token) {
            return {
                success: false, 
                error: AUTH_ERROR.TOKEN_CREATE_FAILED,
                email: undefined,
                timestamp: Date.now()
            }
        }

        if (type === EMAIL_RESET_PASSWORD_PAGE) {
            const { success } = await sendVerificationEmail({ 
                email, 
                token,
                type: RESET_PASSWORD_TYPE
            });
            emailSuccess = success;
        } else {
            const { success } = await sendVerificationEmail({ 
                email, 
                token,
                type: UPDATE_EMAIL_TYPE
            });
            emailSuccess = success;
        }

        if (!emailSuccess) {
            return {
                success: false, 
                error: AUTH_ERROR.TOKEN_SEND_FAILED,
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

        return {
            success: false, 
            error: AUTH_ERROR.TOKEN_SEND_FAILED,
            email: undefined,
            timestamp: Date.now()
        }
    }
}

// パスワードの更新
export async function updatePasswordAction(
    prevState: ActionStateWithEmailAndTimestamp,
    formData: FormData,
    type: UpdatePasswordPageType
): Promise<ActionStateWithEmailAndTimestamp> {
    const password = formData.get('confirmPassword') as UserPassword;

    let token = '';
    if (type === RESET_PASSWORD_PAGE) token = formData.get('token') as string;

    try {
        // throw new Error('test');
        
        if (type === RESET_PASSWORD_PAGE) {
            const { success, error } = await updatePasswordWithToken(
                token, 
                password
            );

            if (!success) {
                return {
                    success: false, 
                    error,
                    timestamp: Date.now()
                }
            }
        } else {
            const { userId } = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

            const { success, error } = await updateUserPassword({
                userId: userId as UserId, 
                password
            });

            if (!success) {
                return {
                    success: false, 
                    error,
                    timestamp: Date.now()
                }
            }
        }

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Password error:', error);
        
        return {
            success: false, 
            error: USER_ERROR.PASSWORD_UPDATE_FAILED,
            timestamp: Date.now()
        }
    }
}

// ログイン
export async function signInWithCredentialsAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData,
    type: AuthType
): Promise<ActionStateWithTimestamp> {
    const errorText = type === AUTH_LOGIN 
        ? AUTH_ERROR.SIGN_IN_FAILED 
        : AUTH_ERROR.REAUTHENTICATE_FAILED;
    
    try {
        const email = formData.get('email') as UserEmail;
        const password = formData.get('password') as UserPassword;

        if (type === AUTH_REAUTHENTICATE) {
            const { user } = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

            const repository = getUserRepository();
            const userData = await repository.getUser({
                userId: user?.id as UserId,
                getType: EMAIL_DATA
            });

            if (!userData) {
                return {
                    success: false, 
                    error: AUTH_ERROR.USER_NOT_FOUND,
                    timestamp: Date.now()
                }
            }

            if (userData?.email !== email) {
                return {
                    success: false, 
                    error: AUTH_ERROR.EMAIL_NOT_MATCH,
                    timestamp: Date.now()
                }
            }
        }

        const signInResult = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (typeof signInResult === 'string') {
            return {
                success: true, 
                error: null, 
                timestamp: Date.now()
            }
        }

        if (signInResult && typeof signInResult === 'object') {
            if (signInResult.error) {
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
        }

        return {
            success: false, 
            error: errorText,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - SignIn error:', error);

        return {
            success: false, 
            error: errorText,
            timestamp: Date.now()
        }
    }
}

// ログアウト
export async function signOutAction() {
    await signOut();
}