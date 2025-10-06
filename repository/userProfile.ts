import prisma from "@/lib/clients/prisma/client"

interface CreateUserProfileWithTransactionProps {
    tx: TransactionClient;
    userProfileData: CreateUserProfileData;
}

export const createUserProfileRepository = () => {
    return {
        // ユーザープロフィールの作成
        createUserProfileWithTransaction: async ({
            tx,
            userProfileData 
        }: CreateUserProfileWithTransactionProps) => {
            return await tx.userProfile.create({
                data: userProfileData
            })
        }
    }
}

export const updateUserProfileRepository = () => {
    return {
        // ユーザーのアイコン画像の更新
        updateUserProfileIconUrl: async ({
            userId,
            iconUrl
        }: UpdateUserProfileIconUrlProps) => {
            return await prisma.userProfile.update({
                where: { user_id: userId },
                data: { icon_url: iconUrl }
            })
        },
        // ユーザーの名前の更新
        updateUserProfileName: async ({
            userId,
            lastname,
            firstname
        }: UpdateUserProfileNameProps) => {
            return await prisma.userProfile.update({
                where: { user_id: userId },
                data: { lastname, firstname }
            })
        },
        // ユーザーの電話番号の更新
        updateUserProfileTel: async ({
            userId,
            tel
        }: UpdateUserProfileTelProps) => {
            return await prisma.userProfile.update({
                where: { user_id: userId },
                data: { tel }
            })
        },
    }
}

export const deleteUserProfileRepository = () => {
    return {
        // ユーザープロフィールの削除
        deleteUserProfile: async ({ userId }: UserProfileIdProps) => {
            return await prisma.userProfile.delete({
                where: { user_id: userId }
            })
        }
    }
}