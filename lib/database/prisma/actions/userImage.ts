import prisma from "@/lib/database/prisma/client"

interface CreateUserImageWithTransactionProps {
    tx: TransactionClient;
    userId: UserId;
}

// アイコン画像のデータ作成（初期設定）
export const createUserImageWithTransaction = async ({
    tx,
    userId
}: CreateUserImageWithTransactionProps) => {
    return await tx.userImage.create({
        data: { 
            user_id: userId 
        }
    })
}

// アイコン画像のIDからユーザーIDを取得
export const getUserImageByImageIdData = async ({ 
    userImageId 
}: { userImageId: UserImageId }) => {
    return await prisma.userImage.findUnique({
        where: {
            id: userImageId
        },
        select: {
            user_id: true,
            file_path: true
        }
    })
}

// ユーザーIDからアイコン画像のIDを取得
export const getUserImageIdData = async ({ 
    userId 
}: { userId: UserId }) => {
    return await prisma.userImage.findUnique({
        where: {
            user_id: userId
        },
        select: {
            id: true
        }
    })
}

// ユーザーIDからアイコン画像のfilePathを取得
export const getUserImageFilePathData = async ({ 
    userId 
}: { userId: UserId }) => {
    return await prisma.userImage.findUnique({
        where: {
            user_id: userId
        },
        select: {
            file_path: true
        }
    })
}

// アイコン画像のパスを更新
export const updateUserImageFilePathData = async ({
    userId,
    filePath
}: UpdateUserImageFilePathProps) => {
    return await prisma.userImage.update({
        where: { 
            user_id: userId 
        },
        data: { 
            file_path: filePath 
        }
    })
}