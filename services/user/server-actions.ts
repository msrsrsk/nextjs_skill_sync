"use server"

import { auth } from "@/lib/auth"
import { updateUserIconUrl, updateUserName, updateUserTel } from "@/services/user/actions"
import { actionAuth } from "@/lib/middleware/auth"
import { urlToFile } from "@/services/file/actions"
import { getUserImageRepository } from "@/repository/userImage"
import { 
    uploadImageToR2,
    getAuthenticatedProfileImageUrl, 
    deleteProfileImage 
} from "@/services/cloudflare/actions"
import { isDefaultIcon } from "@/services/user/validation"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { USER_ERROR, USER_IMAGE_ERROR } = ERROR_MESSAGES;

interface UpdateIconImageActionState extends ActionStateWithTimestamp {
    data: UserIconUrl | null;
}

interface UpdateNameActionState extends ActionStateWithTimestamp {
    data: {
        lastname: UserLastname | null;
        firstname: UserFirstname | null;
    }
}

interface UpdateTelActionState extends ActionStateWithTimestamp {
    data: UserTel;
}

export async function updateIconImageAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData,
    optimisticIconImage: string
): Promise<UpdateIconImageActionState> {
    try {
        // throw new Error('アイコンの更新に失敗しました。\n時間をおいて再度お試しください。');
        
        const { userId } = await actionAuth<UserIconUrl>(
            USER_ERROR.ICON_UPDATE_UNAUTHORIZED,
            true
        );

        const isDefault = isDefaultIcon(optimisticIconImage);
        const iconUrl = formData.get('icon_url') as string;
    
        if (!iconUrl) {
            return {
                success: false, 
                error: USER_ERROR.ICON_UPDATE_MISSING_DATA,
                data: null,
                timestamp: Date.now()
            }
        }

        const isDataUrl = iconUrl.startsWith('data:');
        let finalIconUrl = iconUrl;

        if (!isDefault) {
            const repository = getUserImageRepository();
            const userImageIdResult = await repository.getUserImageId({ 
                userId: userId as UserId 
            });

            if (!userImageIdResult) {
                return {
                    success: false, 
                    error: USER_IMAGE_ERROR.USER_REQUIRED_DATA_NOT_FOUND,
                    data: null,
                    timestamp: Date.now()
                }
            }

            const { 
                success: deleteImageSuccess, 
                error: deleteImageError 
            } = await deleteProfileImage({ userImageId: userImageIdResult.id });

            if (!deleteImageSuccess) {
                console.error(
                    'Error deleting image from storage:', 
                    deleteImageError
                );
            }
        }

        if (isDataUrl) {
            const file = await urlToFile(iconUrl);
    
            if (!file.success || !file.data) {
                return {
                    success: false, 
                    error: file.error,
                    data: null,
                    timestamp: Date.now()
                }
            }

            const { 
                success: uploadImageSuccess, 
                error: uploadImageError, 
                data: uploadImageData 
            } = await uploadImageToR2({
                files: [file.data],
                bucketType: BUCKET_PROFILE,
                userId: userId as UserId
            });
    
            if (!uploadImageSuccess) {
                return {
                    success: false, 
                    error: uploadImageError,
                    data: null,
                    timestamp: Date.now()
                }
            }

            const {
                success: getImageUrlSuccess,
                error: getImageUrlError,
                data: getImageUrlData
            } = await getAuthenticatedProfileImageUrl({
                userImageId: uploadImageData?.[0] || ''
            });

            if (!getImageUrlSuccess) {
                return {
                    success: false, 
                    error: getImageUrlError,
                    data: null,
                    timestamp: Date.now()
                }
            }

            finalIconUrl = getImageUrlData || iconUrl;
        }

        const { 
            success: updateIconUrlSuccess, 
            error: updateIconUrlError, 
        } = await updateUserIconUrl({
            userId: userId as UserId,
            iconUrl: finalIconUrl
        });

        if (!updateIconUrlSuccess) {
            return {
                success: false, 
                error: updateIconUrlError,
                data: null,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            data: finalIconUrl,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Icon Image error:', error);
        
        return {
            success: false, 
            error: USER_ERROR.ICON_UPDATE_FAILED,
            data: null,
            timestamp: Date.now()
        }
    }
}

export async function updateNameAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<UpdateNameActionState> {
    try {
        // throw new Error('お名前の更新に失敗しました。\n時間をおいて再度お試しください。');
        
        const session = await auth();
    
        if (!session?.user?.id) {
            return {
                success: false,
                error: USER_ERROR.NAME_UPDATE_UNAUTHORIZED,
                data: {
                    lastname: null,
                    firstname: null
                },
                timestamp: Date.now()
            };
        }
    
        const lastname = formData.get('lastname') as string;
        const firstname = formData.get('firstname') as string;
    
        if (!lastname || !firstname) {
            return {
                success: false,
                error: USER_ERROR.NAME_UPDATE_MISSING_DATA,
                data: {
                    lastname: null,
                    firstname: null
                },
                timestamp: Date.now()
            };
        }

        const { success, error, data } = await updateUserName({
            userId: session.user.id,
            lastname,
            firstname
        });

        if (!success || !data) {
            return {
                success: false,
                error,
                data: {
                    lastname: null,
                    firstname: null
                },
                timestamp: Date.now()
            };
        }

        return { 
            success: true, 
            error: null,
            data: {
                lastname: data.lastname,
                firstname: data.firstname
            },
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Actions Error - Update Name error:', error);

        return { 
            success: false, 
            error: USER_ERROR.NAME_UPDATE_FAILED,
            data: {
                lastname: null,
                firstname: null
            },
            timestamp: Date.now()
        };
    }
}

export async function updateTelAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<UpdateTelActionState> {
    try {
        // throw new Error('電話番号の更新に失敗しました。\n時間をおいて再度お試しください。');
        
        const { userId } = await actionAuth<UserTel>(
            USER_ERROR.TEL_UPDATE_UNAUTHORIZED,
            true
        );
    
        const tel = formData.get('tel') as string;
    
        if (!tel) {
            return {
                success: false, 
                error: USER_ERROR.TEL_UPDATE_MISSING_DATA,
                data: null,
                timestamp: Date.now()
            };
        }

        const { success, error, data } = await updateUserTel({
            userId: userId as UserId,
            tel
        });

        if (!success || !data) {
            return {
                success: false,
                error,
                data: null,
                timestamp: Date.now()
            };
        }

        return {
            success: true, 
            error: null, 
            data: data.tel,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Actions Error - Update Tel error:', error);

        return {
            success: false, 
            error: USER_ERROR.TEL_UPDATE_FAILED,
            data: null,
            timestamp: Date.now()
        };
    }
}