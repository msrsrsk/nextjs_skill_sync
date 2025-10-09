import { 
    createUserImageRepository, 
    updateUserImageRepository 
} from "@/repository/userImage"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_IMAGE_ERROR } = ERROR_MESSAGES;

// ユーザー画像の作成
export const createUserImage = async ({ 
    tx,
    userId
}: CreateUserImageWithTransactionProps) => {
    try {
        const repository = createUserImageRepository();
        await repository.createUserImageWithTransaction({
            tx,
            userId
        });

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in createUserImage: ', error);

        return {
            success: false, 
            error: USER_IMAGE_ERROR.CREATE_FAILED,
        }
    }
}

export const updateUserImageFilePath = async ({
    userId,
    filePath
}: UpdateUserImageFilePathProps) => {
    try {
        const repository = updateUserImageRepository();
        await repository.updateUserImageFilePath({ userId, filePath });

        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error('Database : Error in updateUserImageFilePath:', error);

        return {
            success: false,
            error: USER_IMAGE_ERROR.FILE_PATH_UPDATE_FAILED
        }
    }
}