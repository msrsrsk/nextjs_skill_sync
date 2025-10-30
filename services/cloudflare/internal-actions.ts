import { createR2Client } from "@/lib/clients/cloudflare/client"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getUserImageRepository } from "@/repository/userImage"
import { 
    uploadSingleFile, 
    authenticateAndAuthorizeUserImage 
} from "@/services/cloudflare/actions"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { USER_IMAGE_ERROR, CLOUDFLARE_ERROR } = ERROR_MESSAGES;

interface UploadImageToR2Props extends UploadImageProps {
    files: File[],
}

export const uploadImageToR2 = async ({
    files,
    bucketType,
    userId
}: UploadImageToR2Props) => {
    let uploadedUrls: string[] = [];
    
    try {
        if (!files || files.length === 0 || !bucketType || !userId) {
            return {
                success: false,
                error: CLOUDFLARE_ERROR.MISSING_DATA,
                data: null
            }
        }

        // 1. ユーザーのアイコン画像IDを取得
        const repository = getUserImageRepository();
        const userImageResult = await repository.getUserImageId({ userId });

        if (!userImageResult) {
            return {
                success: false,
                error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
                data: null
            };
        }

        const userImageId = userImageResult.id;

        // 2. ファイルをアップロード
        for (const file of files) {
            const {
                success,
                error,
                data
            } = await uploadSingleFile({
                file,
                userImageId,
                bucketType,
                userId
            });

            if (!success || !data) {
                return {
                    success: false,
                    error: error,
                    data: null
                }
            }

            uploadedUrls.push(data);
        }

        return {
            success: true,
            error: null,
            data: uploadedUrls
        }
    } catch (error) {
        console.error(`Storage Error - R2 Upload Error for ${bucketType}:`, error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : CLOUDFLARE_ERROR.R2_UPLOAD_FAILED;

        return { 
            success: false, 
            error: errorMessage,
            data: null
        }
    }
}

// 認証済みのプロフィール画像のURLの生成
export const getAuthenticatedProfileImageUrl = async ({
    userImageId, 
}: { userImageId: UserImageId }) => {
    try {
        // 1. ユーザー画像の認証と権限確認
        const { 
            success, 
            error, 
            data 
        } = await authenticateAndAuthorizeUserImage({ userImageId });
        
        if (!success) {
            return {
                success: false,
                error: error,
                data: null
            }
        }

        if (!data?.filePath) {
            return {
                success: false,
                error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
                data: null
            }
        }

        // 2. 画像データの取得
        const { client, bucketName } = createR2Client(BUCKET_PROFILE);
        
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: data?.filePath,
        });

        const response = await client.send(command);

        const imageData = await response.Body!.transformToByteArray();
        const base64 = Buffer.from(imageData).toString('base64');
        const dataUrl = `data:${response.ContentType || 'image/jpeg'};base64,${base64}`;

        return {
            success: true,
            error: null,
            data: dataUrl
        }
    } catch (error) {
        console.error('Storage Error - Get Authenticated Profile Image URL error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : CLOUDFLARE_ERROR.FETCH_FAILED;

        return {
            success: false,
            error: errorMessage,
            data: null
        }
    }
}