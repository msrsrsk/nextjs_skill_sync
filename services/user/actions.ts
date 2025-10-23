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
    errorMessage: string;
}

// ユーザーの作成
export const createUser = async ({ 
    tx,
    userData 
}: CreateUserWithTransactionProps) => {
    const repository = createUserRepository();
    const result = await repository.createUserWithTransaction({ 
        tx, 
        userData 
    });

    return {
        success: !!result, 
        data: result
    }
}

export const getUser = async ({
    userId,
    getType,
    errorMessage
}: GetUserAndVerifyAuthProps) => {
    const repository = getUserRepository();
    const user = await repository.getUser({
        userId: userId as UserId,
        ...(getType && { getType })
    });

    if (!user) {
        throw new Error(errorMessage);
    }

    return user
}

// ユーザーのメールアドレスの更新
export const updateUserEmail = async ({
    userId,
    email
}: UpdateUserEmailProps) => {
    const repository = updateUserRepository();
    const result = await repository.updateUserEmail({ userId, email });

    return { success: !!result }
}

// ユーザーのパスワードの更新
export const updateUserPassword = async ({
    userId,
    password
}: UpdateUserPasswordProps) => {
    const repository = updateUserRepository();
    const result = await repository.updateUserPassword({
        userId,
        password
    });

    return { success: !!result }
}

// ユーザーのパスワードの更新（トークンの更新）
export const updateUserPasswordWithTransaction = async ({
    tx,
    verificationToken,
    password
}: UpdatedUserPasswordWithTransactionProps) => {
    const repository = updateUserRepository();
    const result = await repository.updateUserPasswordWithTransaction({
        tx, 
        verificationToken, 
        password
    });

    return {
        success: !!result, 
        data: result
    }
}

// ユーザーの削除
export const deleteUser = async ({ userId }: { userId: UserId }) => {
    const repository = deleteUserRepository();
    const result = await repository.deleteUser({ userId });

    return { success: !!result }
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