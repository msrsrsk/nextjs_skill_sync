import { updateUserImageFilePathData } from "@/lib/database/prisma/actions/userImage"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_IMAGE_ERROR } = ERROR_MESSAGES;

export const updateUserImageFilePath = async ({
    userId,
    filePath
}: UpdateUserImageFilePathProps) => {
    try {
        await updateUserImageFilePathData({ userId, filePath });

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