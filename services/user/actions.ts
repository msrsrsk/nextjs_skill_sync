"use server"

import { updateUserRepository, deleteUserRepository } from "@/repository/user"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR } = ERROR_MESSAGES;

// ユーザーのメールアドレスの更新
export const updateUserEmail = async ({
    userId,
    email
}: UpdateUserEmailProps) => {
    try {
        const repository = updateUserRepository();
        const userEmail = await repository.updateUserEmail({ userId, email });

        return {
            success: true, 
            error: null, 
            data: userEmail
        }
    } catch (error) {
        console.error('Database : Error in updateUserEmail:', error);

        return {
            success: false, 
            error: USER_ERROR.MAIL_UPDATE_FAILED
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
        const userPassword = await repository.updateUserPassword({
            userId,
            password
        });

        return {
            success: true, 
            error: null, 
            data: userPassword
        }
    } catch (error) {
        console.error('Database : Error in updateUserPassword:', error);

        return {
            success: false, 
            error: USER_ERROR.PASSWORD_UPDATE_FAILED
        }
    }
}

// ユーザーの削除
export const deleteUser = async ({ userId }: { userId: string }) => {
    try {
        const repository = deleteUserRepository();
        await repository.deleteUser({ userId });

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