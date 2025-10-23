import prisma from "@/lib/clients/prisma/client"

export const createUserProfileRepository = () => {
    return {
        // ユーザープロフィールの作成
        createUserProfileWithTransaction: async ({
            tx,
            userId,
            userProfileData 
        }: CreateUserProfileWithTransactionProps) => {
            return await tx.userProfile.create({
                data: {
                    user_id: userId,
                    ...userProfileData
                }
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