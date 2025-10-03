import prisma from "@/lib/clients/prisma/client"

export const createUserStripeRepository = () => {
    return {
        // ユーザーのStripeIDの作成（デフォルト住所の設定による更新）
        createUserStripeCustomerId: async ({
            userId,
            customerId
        }: CreateUserStripeCustomerIdProps) => {
            return await prisma.userStripe.create({
                data: { 
                    user_id: userId, 
                    customer_id: customerId 
                }
            })
        }
    }
}