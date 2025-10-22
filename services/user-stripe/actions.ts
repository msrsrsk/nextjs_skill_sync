import { createUserStripeRepository } from "@/repository/userStripe"

// ユーザーのStripeIDの作成（デフォルト住所の設定による更新）
export const createUserStripeCustomerId = async ({
    userId,
    customerId
}: CreateUserStripeCustomerIdProps) => {
    const repository = createUserStripeRepository();
    const result = await repository.createUserStripeCustomerId({ 
        userId, 
        customerId 
    });
    
    return { success: !!result }
}