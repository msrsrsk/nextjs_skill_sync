"use server"

import { getVerificationTokenRepository } from "@/repository/verificationToken"
import { resetPassword } from "@/lib/services/auth/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR } = ERROR_MESSAGES;

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