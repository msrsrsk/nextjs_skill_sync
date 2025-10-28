"use server"

import { 
    createUserProfileRepository, 
    updateUserProfileRepository
} from "@/repository/userProfile"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_PROFILE_ERROR } = ERROR_MESSAGES;

// ユーザープロフィールの作成
export const createUserProfile = async ({ 
    tx,
    userId,
    userProfileData 
}: CreateUserProfileWithTransactionProps) => {
    try {
        const repository = createUserProfileRepository();
        const result = await repository.createUserProfileWithTransaction({ 
            tx, 
            userId,
            userProfileData 
        });

        if (!result) {
            return {
                success: false, 
                error: USER_PROFILE_ERROR.CREATE_PROFILE_FAILED,
            }
        }
    
        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in createUserProfile: ', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.CREATE_PROFILE_FAILED,
        }
    }
}

// ユーザーのアイコン画像の更新
export const updateUserProfileIconUrl = async ({
    userId,
    iconUrl
}: UpdateUserProfileIconUrlProps) => {
    try {
        const repository = updateUserProfileRepository();
        const result = await repository.updateUserProfileIconUrl({ 
            userId, 
            iconUrl 
        });

        if (!result) {
            return {
                success: false, 
                error: USER_PROFILE_ERROR.ICON_UPDATE_FAILED,
            }
        }

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in updateUserProfileIconUrl: ', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.ICON_UPDATE_FAILED,
        }
    }
}

// ユーザーの名前の更新
export const updateUserProfileName = async ({
    userId,
    lastname,
    firstname
}: UpdateUserProfileNameProps) => {
    try {
        const repository = updateUserProfileRepository();
        const result = await repository.updateUserProfileName({
            userId,
            lastname,
            firstname
        });

        if (!result) {
            return {
                success: false, 
                error: USER_PROFILE_ERROR.NAME_UPDATE_FAILED,
            }
        }

        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in updateUserProfileName: ', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.NAME_UPDATE_FAILED,
            data: null
        }
    }
}

// ユーザーの電話番号の更新
export const updateUserProfileTel = async ({
    userId,
    tel
}: UpdateUserProfileTelProps) => {
    try {
        const repository = updateUserProfileRepository();
        const result = await repository.updateUserProfileTel({ userId, tel });

        if (!result) {
            return {
                success: false, 
                error: USER_PROFILE_ERROR.TEL_UPDATE_FAILED,
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in updateUserProfileTel: ', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.TEL_UPDATE_FAILED,
            data: null
        }
    }
}