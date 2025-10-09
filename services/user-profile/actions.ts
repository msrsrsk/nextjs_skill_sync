"use server"

import { 
    createUserProfileRepository, 
    updateUserProfileRepository, 
    deleteUserProfileRepository 
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
        await repository.createUserProfileWithTransaction({ 
            tx, 
            userId,
            userProfileData 
        });

        return {
            success: true, 
            error: null
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
        const userIconUrl = await repository.updateUserProfileIconUrl({ 
            userId, 
            iconUrl 
        });

        return {
            success: true, 
            error: null, 
            data: userIconUrl
        }
    } catch (error) {
        console.error('Database : Error in updateUserProfileIconUrl:', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.ICON_UPDATE_FAILED
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
        const userName = await repository.updateUserProfileName({
            userId,
            lastname,
            firstname
        });

        return {
            success: true, 
            error: null, 
            data: userName
        }
    } catch (error) {
        console.error('Database : Error in updateUserProfileName:', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.NAME_UPDATE_FAILED
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
        const userTel = await repository.updateUserProfileTel({ userId, tel });

        return {
            success: true, 
            error: null, 
            data: userTel
        }
    } catch (error) {
        console.error('Database : Error in updateUserProfileTel:', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.TEL_UPDATE_FAILED
        }
    }
}

// ユーザープロフィールの削除
export const deleteUserProfile = async ({ userId }: UserProfileIdProps) => {
    try {
        const repository = deleteUserProfileRepository();
        await repository.deleteUserProfile({ userId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteUserProfile:', error);

        return {
            success: false, 
            error: USER_PROFILE_ERROR.DELETE_FAILED
        }
    }
}