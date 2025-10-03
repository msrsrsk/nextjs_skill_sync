import prisma from "@/lib/clients/prisma/client"

export const updateUserStripeRepository = () => {
    return {
        // ユーザーのStripeIDの更新（デフォルト住所の設定による更新）
        updateUserStripeCustomerId: async ({
            userId,
            customerId
        }: UpdateStripeCustomerIdProps) => {
            return await prisma.userStripe.update({
                where: { user_id: userId },
                data: { customer_id: customerId }
            })
        }
    }
}