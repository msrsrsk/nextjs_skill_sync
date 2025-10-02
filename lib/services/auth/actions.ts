"use server"

import crypto from "crypto"
import bcrypt from "bcryptjs"
import prisma from "@/lib/database/prisma/client"
import { signIn, signOut } from "@/lib/auth"

import { actionAuth } from "@/lib/middleware/auth"
import { sendVerificationEmail } from "@/lib/services/email/auth/verification"
import { updatePasswordWithToken } from "@/lib/services/verification-token/actions"
import { 
    createUserRepository, 
    getUserRepository, 
    updateUserRepository 
} from "@/repository/user"
import { 
    updateUserEmail, 
    updateUserPassword, 
    updateStripeCustomerId, 
    deleteUser 
} from "@/lib/services/user/actions"
import { createChatRoomRepository } from "@/repository/chatRoom"
import { createChatRepository } from "@/repository/chat"
import { 
    createVerificationTokenRepository, 
    getVerificationTokenRepository,
    deleteVerificationTokenRepository
} from "@/repository/verificationToken"
import { createCustomer } from "@/lib/services/stripe/actions"
import { createUserImageRepository } from "@/repository/userImage"
import { 
    AUTH_TYPES, 
    EMAIL_VERIFICATION_TYPES, 
    EMAIL_VERIFICATION_PAGE_TYPES,
    UPDATE_PASSWORD_PAGE_TYPES,
    GET_USER_DATA_TYPES,
    CHAT_SENDER_TYPES,
    CHAT_SOURCE,
    CHAT_HISTORY_INITIAL_MESSAGE,
    DEFAULT_ACCOUNT_ICON_URL,
    EMAIL_VERIFICATION_TOKEN_CONFIG,
    VERIFY_EMAIL_TYPES,
    AUTH_TOKEN_BYTES,
    PASSWORD_HASH_ROUNDS
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { AUTH_LOGIN, AUTH_REAUTHENTICATE } = AUTH_TYPES;
const { RESET_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { EMAIL_DATA } = GET_USER_DATA_TYPES;
const { SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { AUTH_ERROR, USER_ERROR, EMAIL_ERROR } = ERROR_MESSAGES;
const { EXPIRATION_TIME } = EMAIL_VERIFICATION_TOKEN_CONFIG;
const { VERIFY_CREATE_ACCOUNT } = VERIFY_EMAIL_TYPES;
const { EMAIL_RESET_PASSWORD_PAGE } = EMAIL_VERIFICATION_PAGE_TYPES;
const { 
    CREATE_ACCOUNT_TYPE, 
    RESET_PASSWORD_TYPE, 
    UPDATE_EMAIL_TYPE
} = EMAIL_VERIFICATION_TYPES;

// アカウントの作成（メールアドレス）
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

// ユーザーの登録（初期チャットデータ込み）
export const registerUserWithChat = async (
    userData: CreateUserData,
    token: string
) => {
    try {
        return await prisma.$transaction(async (tx) => {
            const repository = createUserRepository();
            const user = await repository.createUserWithTransaction({ tx, userData });

            const chatRoomRepository = createChatRoomRepository();
            const chatRoom = await chatRoomRepository.createChatRoomWithTransaction({
                tx, 
                userId: user.id
            });
            
            const chatRepository = createChatRepository();
            await chatRepository.createChatMessageWithTransaction({
                tx, 
                chatRoomId: chatRoom.id, 
                message: CHAT_HISTORY_INITIAL_MESSAGE, 
                senderType: SENDER_ADMIN as ChatSenderType,
                source: CHAT_SOURCE.INITIAL
            });

            const userImageRepository = createUserImageRepository();
            await userImageRepository.createUserImageWithTransaction({
                tx,
                userId: user.id
            });

            const verificationTokenRepository = deleteVerificationTokenRepository();
            await verificationTokenRepository.deleteVerificationTokenWithTransaction({
                tx,
                token
            });
            
            return {
                success: true, 
                error: null, 
                data: user,
            }
        });
    } catch (error) {
        console.error('Actions Error - Register User With Chat error:', error);
        
        return {
            success: false, 
            error: USER_ERROR.CREATE_ACCOUNT_FAILED,
            data: null
        }
    }
}

// トークンデータの作成
export async function createVerificationTokenWithPassword(userData: UserData) {
    const token = crypto.randomBytes(AUTH_TOKEN_BYTES).toString('hex');
    const expires = new Date(new Date().getTime() + EXPIRATION_TIME);
    const hashedPassword = await bcrypt.hash(userData.password, PASSWORD_HASH_ROUNDS);

    try {
        const repository = createVerificationTokenRepository();
        await repository.createVerificationToken({
            verificationData: {
                identifier: userData.email,
                token,
                expires,
                password: hashedPassword,
                userData: JSON.stringify({
                    lastname: userData.lastname,
                    firstname: userData.firstname
                })
            }
        })

        return {
            success: true, 
            error: null, 
            token
        }
    } catch (error) {
        console.error('Actions Error - Create Verification Token With Password error:', error);
        
        return {
            success: false, 
            error: AUTH_ERROR.CREATE_ACCOUNT_PROCESS_FAILED,
            token: null
        }
    }
}

// メールアドレスの認証
export async function verifyEmailToken(
    token: string,
    verifyEmailType: VerifyEmailType
) {
    try {
        const repository = getVerificationTokenRepository();
        const verificationToken = await repository.getVerificationToken({ token });

        if (!verificationToken) {
            throw new Error(AUTH_ERROR.NOT_FOUND_TOKEN)
        }

        if (verificationToken.expires < new Date()) {
            throw new Error(AUTH_ERROR.EXPIRED_EMAIL_TOKEN)
        }

        const email = verificationToken.identifier;
        const userData = JSON.parse(verificationToken.userData || '{}');
        
        if (verifyEmailType === VERIFY_CREATE_ACCOUNT) {
            const hashedPassword = verificationToken.password;
    
            if (!hashedPassword) {
                throw new Error(AUTH_ERROR.PASSWORD_NOT_FOUND)
            }

            // 1. ユーザーの作成(チャットルーム込み)
            const { 
                success: resisterSuccess, 
                error: resisterError,
                data: user 
            } = await registerUserWithChat({
                email: email,
                lastname: userData.lastname,
                firstname: userData.firstname,
                password: hashedPassword,
                icon_url: DEFAULT_ACCOUNT_ICON_URL,
                emailVerified: new Date(),
            }, token)

            if (!resisterSuccess) {
                return {
                    success: false, 
                    error: resisterError,
                    expires: null
                }
            }

            // 2. Stripe顧客の作成
            const { 
                success: createCustomerSuccess, 
                error: createCustomerError,
                data: stripeCustomer 
            } = await createCustomer({ 
                email,
                lastname: userData.lastname,
                firstname: userData.firstname,
            });

            if (!createCustomerSuccess || !stripeCustomer) {
                await deleteUser({ userId: user.id });

                return {
                    success: false, 
                    error: createCustomerError,
                    expires: null
                }
            }

            // 3. SupabaseユーザーのStripe顧客IDの更新
            const { 
                success: updateStripeSuccess, 
                error: updateStripeError 
            } = await updateStripeCustomerId({
                userId: user.id,
                customerId: stripeCustomer.id
            });

            if (!updateStripeSuccess) {
                await deleteUser({ userId: user.id });

                return {
                    success: false, 
                    error: updateStripeError,
                    expires: null
                }
            }
        } else {
            const { userId } = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

            const { success, error } = await updateUserEmail({
                userId: userId as UserId,
                email
            });

            if (!success) {
                return {
                    success: false, 
                    error,
                    expires: null
                }
            }
        }

        return {
            success: true, 
            error: null, 
            expires: verificationToken.expires
        }
    } catch (error) {
        console.error('Actions Error - Verify Email Token error:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : String(error);
        return {
            success: false, 
            error: errorMessage,
            expires: null
        }
    }
}

// メールアドレスの認証トークンの作成
export async function createEmailVerificationTokenWithEmail(email: UserEmail) {
    const token = crypto.randomBytes(AUTH_TOKEN_BYTES).toString('hex');
    const expires = new Date(new Date().getTime() + EXPIRATION_TIME);

    try {
        const repository = createVerificationTokenRepository();
        await repository.createEmailVerificationToken({
            emailVerificationData: {
                identifier: email,
                token,
                expires
            }
        })

        return {
            success: true, 
            error: null, 
            token
        }
    } catch (error) {
        console.error('Actions Error - Create Email Verification Token With Email error:', error);
        
        return {
            success: false, 
            error: AUTH_ERROR.TOKEN_SEND_PROCESS_FAILED,
            token: null
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

// パスワードのリセット
export const resetPassword = async (
    verificationToken: VerificationData,
    password: UserPassword
) => {
    return await prisma.$transaction(async (tx) => {
        const userRepository = updateUserRepository();
        const user = await userRepository.updateUserPasswordWithTransaction({
            tx, 
            verificationToken, 
            password
        });

        const verificationTokenRepository = deleteVerificationTokenRepository();
        await verificationTokenRepository.deleteVerificationTokenWithTransaction({
            tx,
            token: verificationToken.token
        });
        
        return user;
    })
}

// パスワードのリセットトークンの認証
export async function verifyResetPasswordToken(token: string) {
    try {
        const repository = getVerificationTokenRepository();
        const resetToken = await repository.getVerificationToken({ token });

        if (!resetToken) {
            throw new Error(AUTH_ERROR.NOT_FOUND_PASSWORD_TOKEN)
        }

        if (resetToken.expires < new Date()) {
            throw new Error(AUTH_ERROR.EXPIRED_PASSWORD_TOKEN)
        }

        return {
            success: true, 
            error: null, 
            expires: resetToken.expires
        }
    } catch (error) {
        console.error('Actions Error - Verify Reset Password Token error:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : String(error);
        return {
            success: false, 
            error: errorMessage,
            expires: null
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