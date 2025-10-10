"use server"

import { auth } from "@/lib/auth"
import { 
    updateUserProfileIconUrl, 
    updateUserProfileName, 
    updateUserProfileTel 
} from "@/services/user-profile/actions"
import { actionAuth } from "@/lib/middleware/auth"
import { deleteExistingImage } from "@/services/user-image/actions"
import { uploadImageIfNeeded } from "@/services/cloudflare/actions"
import { isDefaultIcon } from "@/services/user-profile/validation"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;
const { USER_ERROR, USER_PROFILE_ERROR } = ERROR_MESSAGES;

interface UpdateIconImageActionState extends ActionStateWithTimestamp {
    data: UserProfileIconUrl | null;
}

interface UpdateNameActionState extends ActionStateWithTimestamp {
    data: {
        lastname: UserProfileLastname | null;
        firstname: UserProfileFirstname | null;
    }
}

interface UpdateTelActionState extends ActionStateWithTimestamp {
    data: UserProfileTel;
}

export async function updateIconImageAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData,
    optimisticIconImage: string
): Promise<UpdateIconImageActionState> {

    const iconUrl = formData.get('icon_url') as string;
    const isDefault = isDefaultIcon(optimisticIconImage);

    try {
        // throw new Error('アイコンの更新に失敗しました。\n時間をおいて再度お試しください。');
        
        // 1. アイコンURLの確認
        if (!iconUrl) {
            return {
                success: false, 
                error: USER_PROFILE_ERROR.ICON_UPDATE_MISSING_DATA,
                data: null,
                timestamp: Date.now()
            }
        }

        // 2. ユーザー認証
        const { userId } = await actionAuth<UserProfileIconUrl>(
            USER_PROFILE_ERROR.ICON_UPDATE_UNAUTHORIZED,
            true
        );

        // 3. 既存画像の削除
        await deleteExistingImage({
            userId: userId as UserId,
            isDefault
        });

        // 4. 新規画像のアップロード
        const finalIconUrl = await uploadImageIfNeeded({
            userId: userId as UserId,
            iconUrl,
            bucketType: BUCKET_PROFILE
        });

        // 5. アイコンURLの更新
        const { 
            success: updateIconUrlSuccess, 
            error: updateIconUrlError, 
        } = await updateUserProfileIconUrl({
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

        const errorMessage = error instanceof Error 
            ? error.message 
            : USER_PROFILE_ERROR.ICON_UPDATE_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            data: null,
            timestamp: Date.now()
        }
    }
}

export async function updateNameAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<UpdateNameActionState> {

    const lastname = formData.get('lastname') as string;
    const firstname = formData.get('firstname') as string;

    try {
        // throw new Error('お名前の更新に失敗しました。\n時間をおいて再度お試しください。');
        
        const session = await auth();
    
        if (!session?.user?.id) {
            return {
                success: false,
                error: USER_PROFILE_ERROR.NAME_UPDATE_UNAUTHORIZED,
                data: {
                    lastname: null,
                    firstname: null
                },
                timestamp: Date.now()
            }
        }
    
        if (!lastname || !firstname) {
            return {
                success: false,
                error: USER_PROFILE_ERROR.NAME_UPDATE_MISSING_DATA,
                data: {
                    lastname: null,
                    firstname: null
                },
                timestamp: Date.now()
            }
        }

        const { success, error, data } = await updateUserProfileName({
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
            }
        }

        return { 
            success: true, 
            error: null,
            data: {
                lastname: data.lastname,
                firstname: data.firstname
            },
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Name error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : USER_PROFILE_ERROR.NAME_UPDATE_FAILED;

        return { 
            success: false, 
            error: errorMessage,
            data: {
                lastname: null,
                firstname: null
            },
            timestamp: Date.now()
        }
    }
}

export async function updateTelAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<UpdateTelActionState> {

    const tel = formData.get('tel') as string;

    try {
        // throw new Error('電話番号の更新に失敗しました。\n時間をおいて再度お試しください。');
        
        // 1. 電話番号の確認
        if (!tel) {
            return {
                success: false, 
                error: USER_PROFILE_ERROR.TEL_UPDATE_MISSING_DATA,
                data: null,
                timestamp: Date.now()
            }
        }

        // 2. ユーザー認証
        const { userId } = await actionAuth<UserProfileTel>(
            USER_PROFILE_ERROR.TEL_UPDATE_UNAUTHORIZED,
            true
        );

        // 3. 電話番号の更新
        const { success, error, data } = await updateUserProfileTel({
            userId: userId as UserId,
            tel
        });

        if (!success || !data) {
            return {
                success: false,
                error,
                data: null,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            data: data.tel,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Tel error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : USER_PROFILE_ERROR.TEL_UPDATE_FAILED;

        return {
            success: false, 
            error: errorMessage,
            data: null,
            timestamp: Date.now()
        }
    }
}