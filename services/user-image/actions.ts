import { 
    getUserImageRepository,
    createUserImageRepository, 
    updateUserImageRepository 
} from "@/repository/userImage"
import { deleteProfileImage } from "@/services/cloudflare/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_IMAGE_ERROR } = ERROR_MESSAGES;

interface DeleteExistingImageProps extends UserIdProps {
    isDefault: boolean;
}

// ユーザー画像の作成
export const createUserImage = async ({ 
    tx,
    userId
}: CreateUserImageWithTransactionProps) => {
    const repository = createUserImageRepository();
    const result = await repository.createUserImageWithTransaction({
        tx,
        userId
    });

    return { success: !!result }
}

// ユーザー画像のパスの取得(トランザクション)
export const getUserImageFilePathWithTransaction = async ({
    tx,
    userId
}: UserWithTransactionProps) => {
    const repository = getUserImageRepository();
    const result = await repository.getUserImageFilePathWithTransaction({ tx, userId });

    return { data: result?.file_path };
}

// ユーザー画像のパスの更新
export const updateUserImageFilePath = async ({
    userId,
    filePath
}: UpdateUserImageFilePathProps) => {
    const repository = updateUserImageRepository();
    const result = await repository.updateUserImageFilePath({ userId, filePath });

    return { success: !!result }
}

// 既存画像の削除
export const deleteExistingImage = async ({ 
    userId,
    isDefault
}: DeleteExistingImageProps) => {
    if (isDefault) return;

    const repository = getUserImageRepository();
    const userImageIdResult = await repository.getUserImageId({ 
        userId: userId as UserId 
    });

    if (!userImageIdResult) {
        throw new Error(USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND);
    }

    const { 
        success: deleteImageSuccess, 
        error: deleteImageError 
    } = await deleteProfileImage({ userImageId: userImageIdResult.id });

    if (!deleteImageSuccess) {
        console.error(
            'Error deleting image from storage:', 
            deleteImageError
        )
    }
}