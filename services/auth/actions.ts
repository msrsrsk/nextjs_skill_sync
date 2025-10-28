"use server"

import crypto from "crypto"
import bcrypt from "bcryptjs"
import prisma from "@/lib/clients/prisma/client"

import { actionAuth } from "@/lib/middleware/auth"
import { createUser, updateUserPasswordWithTransaction } from "@/services/user/actions"
import { createUserProfile } from "@/services/user-profile/actions"
import { createUserImage } from "@/services/user-image/actions"
import { createChatRoom } from "@/services/chat-room/actions"
import { createInitialChat } from "@/services/chat/actions"
import { 
    createVerificationToken, 
    getVerificationTokenAndVerify,
    deleteVerificationToken 
} from "@/services/verification-token/actions"
import { createStripeCustomer, deleteStripeCustomer } from "@/services/stripe/actions"
import { updateUserEmail, deleteUser } from "@/services/user/actions"
import { createUserStripeCustomerId } from "@/services/user-stripe/actions"
import { 
    DEFAULT_ACCOUNT_ICON_URL,
    EMAIL_VERIFICATION_TOKEN_CONFIG,
    VERIFY_EMAIL_TYPES,
    AUTH_TOKEN_BYTES,
    PASSWORD_HASH_ROUNDS
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EXPIRATION_TIME } = EMAIL_VERIFICATION_TOKEN_CONFIG;
const { VERIFY_CREATE_ACCOUNT } = VERIFY_EMAIL_TYPES;
const { 
    AUTH_ERROR, 
    VERIFICATION_TOKEN_ERROR, 
} = ERROR_MESSAGES;

/* ==================================== 
    ユーザー登録（初期チャットデータ込み）
==================================== */
export const registerUserWithChat = async (
    userData: CreateUserData,
    userProfileData: CreateUserProfileData,
    token: string
) => {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. ユーザーの作成
            const userResult = await createUser({
                tx, 
                userData 
            });

            if (!userResult.success || !userResult.data) {
                return {
                    success: false, 
                    error: userResult.error as string,
                    data: null
                }
            }

            // 2. ユーザープロフィールの作成
            const userProfileResult = await createUserProfile({ 
                tx, 
                userId: userResult.data.id,
                userProfileData 
            });

            if (!userProfileResult.success) {
                return {
                    success: false, 
                    error: userProfileResult.error as string,
                    data: null
                }
            }

            // 3. ユーザー画像の作成
            const userImageResult = await createUserImage({
                tx,
                userId: userResult.data.id
            });

            if (!userImageResult.success) {
                return {
                    success: false, 
                    error: userImageResult.error as string,
                    data: null
                }
            }

            // 4. チャットルームの作成
            const chatRoomResult = await createChatRoom({
                tx, 
                userId: userResult.data.id
            });
            
            if (!chatRoomResult.success || !chatRoomResult.data) {
                return {
                    success: false, 
                    error: chatRoomResult.error,
                    data: null
                }
            }

            // 5. 初期チャットメッセージの作成
            const chatResult = await createInitialChat({
                tx, 
                chatRoomId: chatRoomResult.data.id
            });

            if (!chatResult.success) {
                return {
                    success: false, 
                    error: chatResult.error,
                    data: null
                }
            }

            // 6. 認証トークンの削除
            const deleteResult = await deleteVerificationToken({
                tx,
                token
            });

            if (!deleteResult.success) {
                console.error('Actions Error - Delete Verification Token failed: ', deleteResult);
            }
            
            return {
                success: true, 
                error: null, 
                data: userResult,
            }
        });
    } catch (error) {
        console.error('Actions Error - Register User With Chat error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : AUTH_ERROR.CREATE_ACCOUNT_PROCESS_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            data: null
        }
    }
}

/* ==================================== 
    アカウント作成用の認証トークンの作成
==================================== */
export async function createVerificationTokenWithPassword(
    userData: UserData & UserProfileData
) {
    const token = crypto.randomBytes(AUTH_TOKEN_BYTES).toString('hex');
    const expires = new Date(new Date().getTime() + EXPIRATION_TIME);
    const hashedPassword = await bcrypt.hash(userData.password, PASSWORD_HASH_ROUNDS);

    try {
        const result = await createVerificationToken({
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

        if (!result.success || !result.data) {
            return {
                success: false, 
                error: result.error as string,
                token: null
            }
        }

        return {
            success: true, 
            error: null, 
            token: result.data
        }
    } catch (error) {
        console.error('Actions Error - Create Verification Token With Password error:', error);
        
        return {
            success: false, 
            error: AUTH_ERROR.CREATE_VERIFICATION_TOKEN_PROCESS_FAILED,
            token: null
        }
    }
}

/* ==================================== 
    メールアドレスの認証
==================================== */
export async function verifyEmailToken(
    token: string,
    verifyEmailType: VerifyEmailType
) {
    try {
        // 1. 認証トークンの取得&検証
        const { 
            success: verificationSuccess, 
            data: verificationToken 
        } = await getVerificationTokenAndVerify({
            token,
            notFoundErrorMessage: VERIFICATION_TOKEN_ERROR.NOT_FOUND_EMAIL_TOKEN,
            expiredErrorMessage: VERIFICATION_TOKEN_ERROR.EXPIRED_EMAIL_TOKEN
        });

        if (!verificationSuccess || !verificationToken) {
            return {
                success: false, 
                error: VERIFICATION_TOKEN_ERROR.VERIFY_TOKEN_FAILED,
                expires: null
            }
        }

        const email = verificationToken.identifier;
        const tokenUserData = JSON.parse(verificationToken.userData || '{}');
        
        if (verifyEmailType === VERIFY_CREATE_ACCOUNT) {
            const hashedPassword = verificationToken.password;
    
            if (!hashedPassword) {
                return {
                    success: false, 
                    error: AUTH_ERROR.PASSWORD_NOT_FOUND,
                    expires: null
                }
            }

            // 2. ユーザーの作成(チャットルーム込み)
            const { 
                success: resisterSuccess, 
                error: resisterError,
                data: user 
            } = await registerUserWithChat(
                {
                    email: email,
                    password: hashedPassword,
                    emailVerified: new Date(),
                },
                {
                    lastname: tokenUserData.lastname,
                    firstname: tokenUserData.firstname,
                    icon_url: DEFAULT_ACCOUNT_ICON_URL,
                },
                token
            )

            if (!resisterSuccess || !user) {
                return {
                    success: false, 
                    error: resisterError,
                    expires: null
                }
            }

            // 3. Stripeの顧客データの作成
            const { 
                success: createStripeSuccess, 
                error: createStripeError,
                data: createStripeData 
            } = await createStripeCustomer({ 
                email,
                lastname: tokenUserData.lastname,
                firstname: tokenUserData.firstname,
            });

            if (!createStripeSuccess || !createStripeData) {
                await deleteUser({ userId: user.data.id });

                return {
                    success: false, 
                    error: createStripeError,
                    expires: null
                }
            }

            // 4. SupabaseユーザーのStripe顧客IDの作成
            const { 
                success: createCustomerIdSuccess,
                error: createCustomerIdError
            } = await createUserStripeCustomerId({
                userId: user.data.id,
                customerId: createStripeData.id
            });

            if (!createCustomerIdSuccess) {
                await deleteUser({ userId: user.data.id });
                await deleteStripeCustomer({ customerId: createStripeData.id });

                return {
                    success: false, 
                    error: createCustomerIdError,
                    expires: null
                }
            }
        } else {
            // メールアドレスの更新
            const authResult = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

            if (!authResult.success) {
                return {
                    success: false,
                    error: authResult.error as string,
                }
            }

            const { userId } = authResult;

            const updateUserEmailResult = await updateUserEmail({
                userId: userId as UserId,
                email
            });

            if (!updateUserEmailResult.success) {
                return {
                    success: false, 
                    error: updateUserEmailResult.error as string,
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
            : AUTH_ERROR.FAILED_EMAIL_TOKEN_PROCESS;

        return {
            success: false, 
            error: errorMessage,
            expires: null
        }
    }
}

/* ==================================== 
    メールアドレスの認証用のトークンの作成
==================================== */
export async function createVerificationTokenWithEmail(email: UserEmail) {
    
    const token = crypto.randomBytes(AUTH_TOKEN_BYTES).toString('hex');
    const expires = new Date(new Date().getTime() + EXPIRATION_TIME);

    try {

        const result = await createVerificationToken({
            verificationData: {
                identifier: email,
                token,
                expires
            }
        })

        if (!result.success || !result.data) {
            return {
                success: false, 
                error: result.error as string,
                token: null
            }
        }

        return {
            success: true, 
            error: null, 
            token: result.data
        }
    } catch (error) {
        console.error('Actions Error - Create Email Verification Token With Email error:', error);
        
        return {
            success: false, 
            error: AUTH_ERROR.CREATE_VERIFICATION_TOKEN_PROCESS_FAILED,
            token: null
        }
    }
}

/* ==================================== 
    パスワードのリセット
==================================== */
export const resetPassword = async (
    verificationToken: VerificationData,
    password: UserPassword
) => {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. ユーザーのパスワードの更新
            const userResult = await updateUserPasswordWithTransaction({
                tx, 
                verificationToken, 
                password
            });

            if (!userResult.success || !userResult.data) {
                return {
                    success: false, 
                    error: userResult.error as string,
                    data: null
                }
            }

            // 2. 認証トークンの削除
            await deleteVerificationToken({
                tx,
                token: verificationToken.token
            });
            
            return {
                success: true, 
                error: null, 
                data: userResult.data
            }
        })
    } catch (error) {
        console.error('Actions Error - Reset Password error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : AUTH_ERROR.RESET_PASSWORD_PROCESS_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            data: null
        }
    }
}

/* ==================================== 
    パスワードリセット用のトークンの認証
==================================== */
export async function verifyResetPasswordToken(token: VerificationTokenValue) {
    try {
        const { success, error, data } = await getVerificationTokenAndVerify({
            token,
            notFoundErrorMessage: VERIFICATION_TOKEN_ERROR.NOT_FOUND_PASSWORD_TOKEN,
            expiredErrorMessage: VERIFICATION_TOKEN_ERROR.EXPIRED_PASSWORD_TOKEN
        });

        if (!success || !data) {
            return {
                success: false, 
                error: error,
                expires: null
            }
        }

        return {
            success: true, 
            error: null, 
            expires: data.expires
        }
    } catch (error) {
        console.error('Actions Error - Verify Reset Password Token error:', error);
        
        return {
            success: false, 
            error: VERIFICATION_TOKEN_ERROR.VERIFY_TOKEN_FAILED,
            expires: null
        }
    }
}