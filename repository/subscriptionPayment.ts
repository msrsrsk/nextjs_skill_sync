import prisma from "@/lib/clients/prisma/client"

interface updateSubscriptionPaymentStatusProps {
    latestPaymentId: SubscriptionPaymentId;
    status: SubscriptionPaymentStatus;
}

export const createSubscriptionPaymentRepository = () => {
    return {
        // サブスクリプションの支払いデータの作成
        createSubscriptionPayment: async ({ 
            subscriptionPaymentData 
        }: { subscriptionPaymentData: SubscriptionPayment }) => {
            return await prisma.subscriptionPayment.create({
                data: subscriptionPaymentData
            })
        }
    }
}

export const getSubscriptionPaymentRepository = () => {
    return {
        // サブスクリプションの支払いデータの取得
        getSubscriptionPayment: async ({ 
            subscriptionId 
        }: { subscriptionId: PaymentSubscriptionId }) => {
            return await prisma.subscriptionPayment.findFirst({
                where: { subscription_id: subscriptionId },
                orderBy: { created_at: 'desc' }
            })
        }
    }
}

export const updateSubscriptionPaymentRepository = () => {
    return {
        // サブスクリプションの支払いデータの更新
        updateSubscriptionPaymentStatus: async ({ 
            latestPaymentId,
            status 
        }: updateSubscriptionPaymentStatusProps) => {
            return await prisma.subscriptionPayment.update({
                where: { id: latestPaymentId },
                data: { status }
            })
        }
    }
}