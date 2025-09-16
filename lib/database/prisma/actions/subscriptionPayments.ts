import prisma from "@/lib/database/prisma/client"

interface updateSubscriptionPaymentStatusDataProps {
    latestPaymentId: SubscriptionPaymentId;
    status: SubscriptionPaymentStatus;
}

// サブスクリプションの支払いデータの作成
export const createSubscriptionPaymentData = async ({ 
    subscriptionPaymentData 
}: { subscriptionPaymentData: SubscriptionPayment }) => {
    return await prisma.subscriptionPayment.create({
        data: subscriptionPaymentData
    });
}

export const getLatestSubscriptionPaymentData = async ({
    subscriptionId
}: { subscriptionId: PaymentSubscriptionId }) => {
    return await prisma.subscriptionPayment.findFirst({
        where: { subscription_id: subscriptionId },
        orderBy: { created_at: 'desc' }
    });
}

export const updateSubscriptionPaymentStatusData = async ({
    latestPaymentId,
    status
}: updateSubscriptionPaymentStatusDataProps) => {
    return await prisma.subscriptionPayment.update({
        where: { id: latestPaymentId },
        data: { status }
    });
};