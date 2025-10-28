import { createUserStripeRepository } from "@/repository/userStripe"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_STRIPE_ERROR } = ERROR_MESSAGES;

// ユーザーのStripeIDの作成（デフォルト住所の設定による更新）
export const createUserStripeCustomerId = async ({
    userId,
    customerId
}: CreateUserStripeCustomerIdProps) => {
    try {
        const repository = createUserStripeRepository();
        const result = await repository.createUserStripeCustomerId({ 
            userId, 
            customerId 
        });

        if (!result) {
            return {
                success: false, 
                error: USER_STRIPE_ERROR.CUSTOMER_ID_UPDATE_FAILED,
            }
        }

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in createUserStripeCustomerId: ', error);

        return {
            success: false, 
            error: USER_STRIPE_ERROR.CUSTOMER_ID_UPDATE_FAILED,
        }
    }
}