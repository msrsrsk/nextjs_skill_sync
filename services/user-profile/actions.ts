"use server"

import { 
    createUserProfileRepository, 
    updateUserProfileRepository
} from "@/repository/userProfile"

// ユーザープロフィールの作成
export const createUserProfile = async ({ 
    tx,
    userId,
    userProfileData 
}: CreateUserProfileWithTransactionProps) => {
    const repository = createUserProfileRepository();
    const result = await repository.createUserProfileWithTransaction({ 
        tx, 
        userId,
        userProfileData 
    });

    return { success: !!result }
}

// ユーザーのアイコン画像の更新
export const updateUserProfileIconUrl = async ({
    userId,
    iconUrl
}: UpdateUserProfileIconUrlProps) => {
    const repository = updateUserProfileRepository();
    const result = await repository.updateUserProfileIconUrl({ 
        userId, 
        iconUrl 
    });

    return { success: !!result }
}

// ユーザーの名前の更新
export const updateUserProfileName = async ({
    userId,
    lastname,
    firstname
}: UpdateUserProfileNameProps) => {
    const repository = updateUserProfileRepository();
    const result = await repository.updateUserProfileName({
        userId,
        lastname,
        firstname
    });

    return {
        success: !!result, 
        data: result
    }
}

// ユーザーの電話番号の更新
export const updateUserProfileTel = async ({
    userId,
    tel
}: UpdateUserProfileTelProps) => {
    const repository = updateUserProfileRepository();
    const result = await repository.updateUserProfileTel({ userId, tel });

    return {
        success: !!result, 
        data: result
    }
}