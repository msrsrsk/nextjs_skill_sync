import { updateUserRepository, deleteUserRepository } from "@/repository/user"
import { createUserStripeRepository } from "@/repository/userStripe"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, CHECKOUT_ERROR } = ERROR_MESSAGES;

// ユーザーのStripeIDの作成（デフォルト住所の設定による更新）
export const createUserStripeCustomerId = async ({
    userId,
    customerId
}: CreateUserStripeCustomerIdProps) => {
    try {
        const repository = createUserStripeRepository();
        await repository.createUserStripeCustomerId({ userId, customerId });
        
        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in createUserStripeCustomerId:', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CUSTOMER_ID_UPDATE_FAILED
        }
    }
}

// ユーザーのアイコン画像の更新
export const updateUserIconUrl = async ({
    userId,
    iconUrl
}: UpdateUserIconUrlProps) => {
    try {
        const repository = updateUserRepository();
        const userIconUrl = await repository.updateUserIconUrl({ userId, iconUrl });

        return {
            success: true, 
            error: null, 
            data: userIconUrl
        }
    } catch (error) {
        console.error('Database : Error in updateUserIconUrl:', error);

        return {
            success: false, 
            error: USER_ERROR.ICON_UPDATE_FAILED
        }
    }
}

// ユーザーの名前の更新
export const updateUserName = async ({
    userId,
    lastname,
    firstname
}: UpdateUserNameProps) => {
    try {
        const repository = updateUserRepository();
        const userName = await repository.updateUserName({
            userId,
            lastname,
            firstname
        });

        return {
            success: true, 
            error: null, 
            data: userName
        }
    } catch (error) {
        console.error('Database : Error in updateUserName:', error);

        return {
            success: false, 
            error: USER_ERROR.NAME_UPDATE_FAILED
        }
    }
}

// ユーザーの電話番号の更新
export const updateUserTel = async ({
    userId,
    tel
}: UpdateUserTelProps) => {
    try {
        const repository = updateUserRepository();
        const userTel = await repository.updateUserTel({ userId, tel });

        return {
            success: true, 
            error: null, 
            data: userTel
        }
    } catch (error) {
        console.error('Database : Error in updateUserTel:', error);

        return {
            success: false, 
            error: USER_ERROR.TEL_UPDATE_FAILED
        }
    }
}

// ユーザーのメールアドレスの更新
export const updateUserEmail = async ({
    userId,
    email
}: UpdateUserEmailProps) => {
    try {
        const repository = updateUserRepository();
        const userEmail = await repository.updateUserEmail({ userId, email });

        return {
            success: true, 
            error: null, 
            data: userEmail
        }
    } catch (error) {
        console.error('Database : Error in updateUserEmail:', error);

        return {
            success: false, 
            error: USER_ERROR.MAIL_UPDATE_FAILED
        }
    }
}

// ユーザーのパスワードの更新
export const updateUserPassword = async ({
    userId,
    password
}: UpdateUserPasswordProps) => {
    try {
        const repository = updateUserRepository();
        const userPassword = await repository.updateUserPassword({
            userId,
            password
        });

        return {
            success: true, 
            error: null, 
            data: userPassword
        }
    } catch (error) {
        console.error('Database : Error in updateUserPassword:', error);

        return {
            success: false, 
            error: USER_ERROR.PASSWORD_UPDATE_FAILED
        }
    }
}

// ユーザーの削除
export const deleteUser = async ({ userId }: { userId: string }) => {
    try {
        const repository = deleteUserRepository();
        await repository.deleteUser({ userId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteUser:', error);

        return {
            success: false, 
            error: USER_ERROR.DELETE_FAILED
        }
    }
}