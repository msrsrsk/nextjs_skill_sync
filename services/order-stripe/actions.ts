import { 
    createOrderStripeRepository, 
    deleteOrderStripeRepository 
} from "@/repository/orderStripe"

// 注文履歴のStripeデータの作成
export const createOrderStripe = async ({ 
    orderStripeData 
}: { orderStripeData: CreateOrderStripeProps }) => {
    const repository = createOrderStripeRepository();
    const result = await repository.createOrderStripe({ orderStripeData });

    return { success: !!result }
}

// 注文履歴のStripeデータの削除
export const deleteOrderStripe = async ({ orderId }: { orderId: OrderId }) => {
    const repository = deleteOrderStripeRepository();
    const result = await repository.deleteOrderStripe({ orderId });

    return { success: !!result }
}