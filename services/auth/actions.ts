import crypto from "crypto"
import bcrypt from "bcryptjs"
import prisma from "@/lib/clients/prisma/client"

import { actionAuth } from "@/lib/middleware/auth"
import { createUserRepository, updateUserRepository } from "@/repository/user"
import { updateUserEmail, deleteUser } from "@/services/user/actions"
import { createUserStripeCustomerId } from "@/services/user-stripe/actions"
import { createChatRoomRepository } from "@/repository/chatRoom"
import { createChatRepository } from "@/repository/chat"
import { 
    createVerificationTokenRepository, 
    getVerificationTokenRepository,
    deleteVerificationTokenRepository
} from "@/repository/verificationToken"
import { createCustomer } from "@/services/stripe/actions"
import { createUserImageRepository } from "@/repository/userImage"
import { 
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

const { SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { AUTH_ERROR, USER_ERROR } = ERROR_MESSAGES;
const { EXPIRATION_TIME } = EMAIL_VERIFICATION_TOKEN_CONFIG;
const { VERIFY_CREATE_ACCOUNT } = VERIFY_EMAIL_TYPES;

// ユーザー登録（初期チャットデータ込み）
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

// アカウント作成用の認証トークンの作成（パスワード含む）
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
                success: createStripeSuccess, 
                error: createStripeError 
            } = await createUserStripeCustomerId({
                userId: user.id,
                customerId: stripeCustomer.id
            });

            if (!createStripeSuccess) {
                await deleteUser({ userId: user.id });

                return {
                    success: false, 
                    error: createStripeError,
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

// メールアドレス変更用の認証トークンの作成
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

// パスワードリセット用のトークンの認証
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