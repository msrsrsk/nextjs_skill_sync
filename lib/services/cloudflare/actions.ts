import { createR2Client } from "@/lib/clients/cloudflare/client"

import { requireServerAuth } from "@/lib/middleware/auth"
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { 
    getUserImageIdData, 
    getUserImageByImageIdData, 
    getUserImageFilePathData 
} from "@/lib/database/prisma/actions/userImage"
import { updateUserImageFilePath } from "@/lib/services/user-image/actions"
import { CLOUDFLARE_BUCKET_TYPES, FILE_UPLOAD_RANDOM_ID } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_REVIEW, BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { RANDOM_RADIX, RANDOM_START_INDEX, RANDOM_LENGTH } = FILE_UPLOAD_RANDOM_ID;
const { USER_IMAGE_ERROR, CLOUDFLARE_ERROR, REVIEW_ERROR } = ERROR_MESSAGES;

interface UploadImageToR2Props {
    files: File[],
    bucketType: CloudflareBucketType;
    userId: UserId;
}

export const uploadImageToR2 = async ({
    files,
    bucketType,
    userId
}: UploadImageToR2Props) => {
    let uploadedUrls: string[] = [];
    
    try {
        // 1. ユーザーのアイコン画像IDを取得
        const userImageResult = await getUserImageIdData({ userId });

        if (!userImageResult) {
            return {
                success: false,
                error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
                data: null
            };
        }

        const userImageId = userImageResult.id;

        for (const file of files) {
            const { client, bucketName } = createR2Client(bucketType);
            const buffer = Buffer.from(await file.arrayBuffer());

            const timestamp = Date.now();
            const randomId = Math.random().toString(RANDOM_RADIX).substring(RANDOM_START_INDEX, RANDOM_LENGTH);
            const filePath = `${bucketType}/${userImageId}/${timestamp}-${randomId}-${file.name}`;
            
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: filePath,
                Body: buffer,
                ContentType: file.type,
                Metadata: {
                    'user-image-id': userImageId,
                    'bucket-type': bucketType,
                    'uploaded-at': timestamp.toString()
                }
            });

            // 2. Cloudflare R2にアップロード
            await client.send(command);

            // 3. プロフィール画像の場合はファイルのURLを更新
            if (bucketType === BUCKET_PROFILE) {
                const { 
                    success: updateIconUrlSuccess, 
                    error: updateIconUrlError, 
                } = await updateUserImageFilePath({
                    userId,
                    filePath: filePath
                });
        
                if (!updateIconUrlSuccess) {
                    return {
                        success: false, 
                        error: updateIconUrlError,
                        data: null
                    }
                }
            }
            
            // 4. URLを生成
            const imageUrl = bucketType === BUCKET_REVIEW 
                ? `${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${filePath}`
                : userImageId;

            uploadedUrls.push(imageUrl);
        }

        return {
            success: true,
            error: null,
            data: uploadedUrls
        };
    } catch (error) {
        console.error(`Storage Error - R2 Upload Error for ${bucketType}:`, error);

        return { 
            success: false, 
            error: CLOUDFLARE_ERROR.R2_UPLOAD_FAILED,
            data: null
        };
    }
}

const authenticateAndAuthorizeUserImage = async ({
    userImageId
}: { userImageId: UserImageId }) => {
    // ユーザー認証
    const { session } = await requireServerAuth();
    const userId = session.user.id;

    if (!userId) {
        return {
            success: false,
            error: CLOUDFLARE_ERROR.USER_ID_NOT_FOUND,
            data: null
        }
    }

    const userImageResult = await getUserImageByImageIdData({ userImageId });

    if (!userImageResult) {
        return {
            success: false,
            error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        }
    }

    const fileOwnerId = userImageResult.user_id;
    const filePath = userImageResult.file_path;

    if (!fileOwnerId || !filePath) {
        return {
            success: false,
            error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
            data: null
        }
    }

    // 所有者チェック
    if (fileOwnerId !== userId) {
        return {
            success: false,
            error: CLOUDFLARE_ERROR.PROFILE_ACCESS_DENIED,
            data: null
        }
    }

    return {
        success: true,
        error: null,
        data: {
            fileOwnerId,
            filePath
        }
    }
}

// 認証済みのプロフィール画像のURLを生成
export const getAuthenticatedProfileImageUrl = async ({
    userImageId, 
}: { userImageId: UserImageId }) => {
    try {
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

        // 画像データの取得
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

        return {
            success: false,
            error: CLOUDFLARE_ERROR.FETCH_FAILED,
            data: null
        }
    }
}

// プロフィール画像の削除
export const deleteProfileImage = async ({
    userImageId
}: { userImageId: UserImageId }) => {
    try {
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

        // Cloudflare R2からの削除
        const { client, bucketName } = createR2Client(BUCKET_PROFILE);
        
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: data?.filePath,
        });

        await client.send(command);

        return {
            success: true,
            error: null
        }

    } catch (error) {
        console.error('Storage Error - Delete Profile Image error:', error);

        return {
            success: false,
            error: CLOUDFLARE_ERROR.DELETE_FAILED
        }
    }
}

// レビュー画像の削除
export async function deleteReviewImage (record: Review) {
    try {
        const { image_urls } = record;

        if (image_urls.length === 0) {
            return {
                success: true,
                error: undefined,
            }
        }

        // Cloudflare R2からの削除
        const { client, bucketName } = createR2Client(BUCKET_REVIEW);
        
        const deletePromises = image_urls.map(async (imageUrl) => {
            const filePath = imageUrl.replace(/.*\/review\//, 'review/');
            
            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: filePath,
            });

            return client.send(command);
        });

        await Promise.all(deletePromises);

        return {
            success: true,
            error: undefined
        }
    } catch (error) {
        console.error('Storage Error - Delete Review Image error:', error);

        return {
            success: false,
            error: CLOUDFLARE_ERROR.DELETE_FAILED
        }
    }
}

// ユーザーのアイコン画像の削除
export const deleteUserImage = async ({
    userId
}: { userId: UserId }) => {
    try {
        const userImageResult = await getUserImageFilePathData({ userId });

        if (!userImageResult || !userImageResult.file_path) {
            return {
                success: true,
                error: null,
            }
        }
        
        // Cloudflare R2からの削除
        const { client, bucketName } = createR2Client(BUCKET_PROFILE);

        const filePath = userImageResult.file_path
            
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        });

        await client.send(command);

        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error('Storage Error - Delete User Image error:', error);

        return {
            success: false,
            error: CLOUDFLARE_ERROR.DELETE_FAILED
        }
    }
}