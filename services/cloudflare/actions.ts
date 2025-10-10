import { createR2Client } from "@/lib/clients/cloudflare/client"

import { requireUser } from "@/lib/middleware/auth"
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getUserImageRepository } from "@/repository/userImage"
import { updateUserImageFilePath } from "@/services/user-image/actions"
import { urlToFile } from "@/services/file/actions"
import { CLOUDFLARE_BUCKET_TYPES, FILE_UPLOAD_RANDOM_ID } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_REVIEW, BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { RANDOM_RADIX, RANDOM_START_INDEX, RANDOM_LENGTH } = FILE_UPLOAD_RANDOM_ID;
const { USER_IMAGE_ERROR, CLOUDFLARE_ERROR } = ERROR_MESSAGES;

interface UploadImageProps {
    bucketType: CloudflareBucketType;
    userId: UserId;
}

interface UploadImageToR2Props extends UploadImageProps {
    files: File[],
}

interface UploadSingleFileProps extends UploadImageProps {
    file: File;
    userImageId: UserImageId,
}

interface UploadImageIfNeededProps extends UploadImageProps {
    iconUrl: string;
    bucketType: CloudflareBucketType;
}

interface DeleteObjectFromR2Props {
    bucketType: CloudflareBucketType;
    filePath: UserImagePath;
}

export const uploadSingleFile = async ({
    file,
    userImageId,
    bucketType,
    userId
}: UploadSingleFileProps) => {

    const timestamp = Date.now();
    const buffer = Buffer.from(await file.arrayBuffer());
    const randomId = Math.random().toString(RANDOM_RADIX).substring(RANDOM_START_INDEX, RANDOM_LENGTH);
    const filePath = `${bucketType}/${userImageId}/${timestamp}-${randomId}-${file.name}`;

    try {
        // 1. Cloudflare R2にアップロード
        const { client, bucketName } = createR2Client(bucketType);
        
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

        await client.send(command);

        // 2. プロフィール画像の場合はファイルのURLを更新
        if (bucketType === BUCKET_PROFILE) {
            const { 
                success: updateFilePathSuccess, 
                error: updateFilePathError, 
            } = await updateUserImageFilePath({
                userId,
                filePath: filePath
            });
    
            if (!updateFilePathSuccess) {
                return {
                    success: false, 
                    error: updateFilePathError,
                    data: null
                }
            }
        }
        
        // 3. URLの生成
        const imageUrl = bucketType === BUCKET_REVIEW 
            ? `${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${filePath}`
            : userImageId;
        
        return {
            success: true,
            error: null,
            data: imageUrl
        }
    } catch (error) {
        console.error('Storage Error - Upload Single File error:', error);

        return {
            success: false, 
            error: CLOUDFLARE_ERROR.R2_UPLOAD_PROCESS_FAILED,
            data: null
        }
    }
}

export const uploadImageToR2 = async ({
    files,
    bucketType,
    userId
}: UploadImageToR2Props) => {
    let uploadedUrls: string[] = [];
    
    try {
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

        return { 
            success: false, 
            error: CLOUDFLARE_ERROR.R2_UPLOAD_FAILED,
            data: null
        }
    }
}

export const uploadImageIfNeeded = async ({
    userId,
    iconUrl,
    bucketType
}: UploadImageIfNeededProps) => {
    const isDataUrl = iconUrl.startsWith('data:');
    
    if (!isDataUrl) return iconUrl

    const file = await urlToFile(iconUrl);
    
    if (!file.success || !file.data) {
        throw new Error(file.error as string);
    }

    const { 
        success: uploadImageSuccess, 
        error: uploadImageError, 
        data: uploadImageData 
    } = await uploadImageToR2({
        files: [file.data],
        bucketType,
        userId: userId as UserId
    });

    if (!uploadImageSuccess) {
        throw new Error(uploadImageError as string);
    }

    const {
        success: getImageUrlSuccess,
        error: getImageUrlError,
        data: getImageUrlData
    } = await getAuthenticatedProfileImageUrl({
        userImageId: uploadImageData?.[0] || ''
    });

    if (!getImageUrlSuccess) {
        throw new Error(getImageUrlError as string);
    }

    return getImageUrlData || iconUrl;
}

const authenticateAndAuthorizeUserImage = async ({
    userImageId
}: { userImageId: UserImageId }) => {
    try {
        // 1. ユーザーIDの取得
        const { session } = await requireUser();
        const userId = session.user.id;

        // 2. ユーザー画像の取得
        const repository = getUserImageRepository();
        const userImageResult = await repository.getUserImageByImageId({ userImageId });

        if (!userImageResult) {
            return {
                success: false,
                error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
                data: null
            }
        }

        // 3. ユーザー画像の所有者チェック
        const fileOwnerId = userImageResult.user_id;
        const filePath = userImageResult.file_path;

        if (!fileOwnerId || !filePath) {
            return {
                success: false,
                error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
                data: null
            }
        }

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
    } catch (error) {
        console.error('Storage Error - Authenticate and Authorize User Image error:', error);

        return {
            success: false,
            error: CLOUDFLARE_ERROR.AUTHENTICATION_FAILED,
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

        return {
            success: false,
            error: CLOUDFLARE_ERROR.FETCH_FAILED,
            data: null
        }
    }
}

// R2画像の削除
const deleteObjectFromR2 = async ({
    bucketType,
    filePath
}: DeleteObjectFromR2Props) => {
    try {
        const { client, bucketName } = createR2Client(bucketType);
        
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: filePath!,
        });

        await client.send(command);

        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error(`Storage Error - Delete Object from R2 error:`, error);
        
        return {
            success: false,
            error: CLOUDFLARE_ERROR.DELETE_FAILED
        }
    }
}

// プロフィール画像の削除
export const deleteProfileImage = async ({
    userImageId
}: { userImageId: UserImageId }) => {
    try {
        // 1. ユーザー画像の認証と権限確認
        const { 
            success: authUserImageSuccess, 
            error: authUserImageError, 
            data: authUserImageData
        } = await authenticateAndAuthorizeUserImage({ userImageId });
        
        if (!authUserImageSuccess || !authUserImageData?.filePath) {
            return {
                success: false,
                error: authUserImageError,
                data: null
            }
        }

        // 2. Cloudflare R2からの削除
        const {
            success: deleteObjectSuccess,
            error: deleteObjectError,
        } = await deleteObjectFromR2({
            bucketType: BUCKET_PROFILE,
            filePath: authUserImageData?.filePath
        });

        if (!deleteObjectSuccess) {
            return {
                success: false,
                error: deleteObjectError,
                data: null
            }
        }

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
        // 1. ユーザー画像の取得
        const repository = getUserImageRepository();
        const userImageResult = await repository.getUserImageFilePath({ userId });

        if (!userImageResult || !userImageResult.file_path) {
            return {
                success: true,
                error: null,
            }
        }
        
        // 2. Cloudflare R2からの削除
        const {
            success: deleteObjectSuccess,
            error: deleteObjectError,
        } = await deleteObjectFromR2({
            bucketType: BUCKET_PROFILE,
            filePath: userImageResult?.file_path
        });

        if (!deleteObjectSuccess) {
            return {
                success: false,
                error: deleteObjectError,
                data: null
            }
        }

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