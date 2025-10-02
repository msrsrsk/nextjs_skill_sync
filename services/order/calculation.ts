import { convertToJST } from "@/lib/utils/format"

export const isWithinThreshold = (
    createdAt: OrderCreatedAt,
    cancelThreshold: number
): boolean => {
    const convertedCreatedAt = convertToJST(createdAt);
    const createdDate = new Date(convertedCreatedAt);

    const currentDate = new Date();

    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - cancelThreshold);

    return createdDate > threeMonthsAgo;
}