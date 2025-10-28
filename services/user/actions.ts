"use server"

import prisma from "@/lib/clients/prisma/client"

import { 
    createUserRepository, 
    getUserRepository,
    updateUserRepository, 
    deleteUserRepository
} from "@/repository/user"
import { getUserImageFilePathWithTransaction } from "@/services/user-image/actions"
import { deleteObjectFromR2 } from "@/services/cloudflare/actions"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, USER_IMAGE_ERROR } = ERROR_MESSAGES;
const { BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;

interface GetUserAndVerifyAuthProps extends UserIdProps {
    getType?: GetUserDataTypes;
}

// ユーザーの作成
export const createUser = async ({ 
    tx,
    userData 
}: CreateUserWithTransactionProps) => {
    try {
        const repository = createUserRepository();
        const result = await repository.createUserWithTransaction({ 
            tx, 
            userData 
        });
    
        if (!result) {
            return {
                success: false, 
                error: USER_ERROR.CREATE_ACCOUNT_FAILED,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in createUser: ', error);

        return {
            success: false, 
            error: USER_ERROR.CREATE_ACCOUNT_FAILED,
            data: null
        }
    }
}

export const getUser = async ({
    userId,
    getType
}: GetUserAndVerifyAuthProps) => {
    const repository = getUserRepository();
    const user = await repository.getUser({
        userId: userId as UserId,
        ...(getType && { getType })
    });

    return user
}

// ユーザーのメールアドレスの更新
export const updateUserEmail = async ({
    userId,
    email
}: UpdateUserEmailProps) => {
    try {
        const repository = updateUserRepository();
        const result = await repository.updateUserEmail({ userId, email });

        if (!result) {
            return {
                success: false, 
                error: USER_ERROR.MAIL_UPDATE_FAILED,
            }
        }
    
        return { 
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in updateUserEmail: ', error);

        return {
            success: false, 
            error: USER_ERROR.MAIL_UPDATE_FAILED,
        }
    }
}

// ユーザーのパスワードの更新
export const updateUserPassword = async ({
    userId,
    password
}: UpdateUserPasswordProps) => {
    try {
        const repository = updateUserRepository();
        const result = await repository.updateUserPassword({
            userId,
            password
        });

        if (!result) {
            return {
                success: false, 
                error: USER_ERROR.PASSWORD_UPDATE_FAILED,
            }
        }
    
        return { 
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in updateUserPassword: ', error);

        return {
            success: false, 
            error: USER_ERROR.PASSWORD_UPDATE_FAILED,
        }
    }
}

// ユーザーのパスワードの更新（トークンの更新）
export const updateUserPasswordWithTransaction = async ({
    tx,
    verificationToken,
    password
}: UpdatedUserPasswordWithTransactionProps) => {
    try {
        const repository = updateUserRepository();
        const result = await repository.updateUserPasswordWithTransaction({
            tx, 
            verificationToken, 
            password
        });
    
        if (!result) {
            return {
                success: false, 
                error: USER_ERROR.PASSWORD_UPDATE_FAILED,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in updateUserPasswordWithTransaction: ', error);

        return {
            success: false, 
            error: USER_ERROR.PASSWORD_UPDATE_FAILED,
            data: null
        }
    }
}

// ユーザーの削除
export const deleteUser = async ({ userId }: { userId: UserId }) => {
    try {
        const repository = deleteUserRepository();
        const result = await repository.deleteUser({ userId });

        if (!result) {
            return {
                success: false, 
                error: USER_ERROR.DELETE_FAILED,
            }
        }

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteUser:', error);

        return {
            success: false, 
            error: USER_ERROR.DELETE_FAILED
        }
    }
}

// ユーザーとアイコン画像データの削除
export const deleteUserAccount = async ({ userId }: { userId: UserId }) => {
    // 1. ユーザー画像の取得とデータ削除
    const result = await prisma.$transaction(async (tx) => {
        const userImage = await getUserImageFilePathWithTransaction({ tx, userId });

        if (!userImage.data) {
            return { 
                success: false,
                error: USER_IMAGE_ERROR.FILE_PATH_NOT_FOUND,
            }
        }

        const repository = deleteUserRepository();
        const deleteUserResult = await repository.deleteUserWithTransaction({ 
            tx, 
            userId 
        });

        if (!deleteUserResult) {
            return { 
                success: false,
                error: USER_ERROR.DELETE_FAILED,
            }
        }

        return { 
            success: true,
            data: userImage.data
        }
    })

    // 2. Cloudflare R2からの削除
    if (result.success && result.data) {
        const deleteObjectResult = await deleteObjectFromR2({
            bucketType: BUCKET_PROFILE,
            filePath: result.data
        });

        if (!deleteObjectResult.success) {
            console.error('Delete User Image from R2 failed:', deleteObjectResult.error);
        }
    }

    return result
}