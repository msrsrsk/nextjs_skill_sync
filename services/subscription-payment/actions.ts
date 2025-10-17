import { 
    createSubscriptionPaymentRepository, 
    getSubscriptionPaymentRepository, 
    updateSubscriptionPaymentRepository 
} from "@/repository/subscriptionPayment"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_PAYMENT_ERROR } = ERROR_MESSAGES;

interface updateSubscriptionPaymentStatusProps {
    subscriptionId: PaymentSubscriptionId;
    status: SubscriptionPaymentStatus;
}

// サブスクリプションの支払いデータの作成
export const createSubscriptionPayment = async ({ 
    subscriptionPaymentData 
}: { subscriptionPaymentData: SubscriptionPayment }) => {
    const repository = createSubscriptionPaymentRepository();
    const result = await repository.createSubscriptionPayment({ 
        subscriptionPaymentData 
    })

    return {
        success: !!result, 
        data: result
    }
}

export const updateSubscriptionPaymentStatus = async ({
    subscriptionId,
    status
}: updateSubscriptionPaymentStatusProps) => {
    try {
        const getRepository = getSubscriptionPaymentRepository();
        const latestPayment = await getRepository.getSubscriptionPayment({ 
            subscriptionId 
        });
    
        if (!latestPayment) {
            return {
                success: false, 
                error: SUBSCRIPTION_PAYMENT_ERROR.GET_LATEST_FAILED,
                data: null
            }
        }
    
        const updateRepository = updateSubscriptionPaymentRepository();
        const updatedPayment = await updateRepository.updateSubscriptionPaymentStatus({
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
            error: SUBSCRIPTION_PAYMENT_ERROR.UPDATE_FAILED,
            data: null
        }
    }
}