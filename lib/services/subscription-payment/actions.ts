import { createSubscriptionPaymentData } from "@/lib/database/prisma/actions/subscriptionPayments"
import { 
    getLatestSubscriptionPaymentData, 
    updateSubscriptionPaymentStatusData 
} from "@/lib/database/prisma/actions/subscriptionPayments"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

interface updateSubscriptionPaymentStatusProps {
    subscriptionId: PaymentSubscriptionId;
    status: SubscriptionPaymentStatus;
}

// サブスクリプションの支払いデータの作成
export const createSubscriptionPayment = async ({ 
    subscriptionPaymentData 
}: { subscriptionPaymentData: SubscriptionPayment }) => {
    try {
        const subscriptionPayment = await createSubscriptionPaymentData({ subscriptionPaymentData });

        return {
            success: true, 
            error: null, 
            data: subscriptionPayment
        }
    } catch (error) {
        console.error('Database : Error in createSubscriptionPayment: ', error);

        return {
            success: false, 
            error: SUBSCRIPTION_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

export const updateSubscriptionPaymentStatus = async ({
    subscriptionId,
    status
}: updateSubscriptionPaymentStatusProps) => {
    try {
        const latestPayment = await getLatestSubscriptionPaymentData({ subscriptionId });
    
        if (!latestPayment) {
            return {
                success: false, 
                error: SUBSCRIPTION_ERROR.GET_LATEST_FAILED,
                data: null
            }
        }
    
        const updatedPayment = await updateSubscriptionPaymentStatusData({
            latestPaymentId: latestPayment.id,
            status
        });
    
        return {
            success: true, 
            error: null, 
            data: updatedPayment
        }
    } catch (error) {
        console.error('Database : Error in updateSubscriptionPaymentStatus: ', error);

        return {
            success: false, 
            error: SUBSCRIPTION_ERROR.CREATE_FAILED,
            data: null
        }
    }
}