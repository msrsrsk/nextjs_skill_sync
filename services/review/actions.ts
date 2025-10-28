"use server"

import { createReviewRepository, getReviewRepository } from "@/repository/review"

// レビューの作成
export const createReview = async ({ reviewData }: { reviewData: Review }) => {
    const repository = createReviewRepository();
    const result = await repository.createReview({ reviewData });

    return { success: !!result }
}

// 全てのレビューデータの取得
export const getSectionReviews = async () => {
    const repository = getReviewRepository();
    const { reviews, totalCount } = await repository.getAllReviews();

    return {
        success: !!reviews && !!totalCount,
        data: {
            reviews,
            totalCount
        }
    }
}

// 個別商品のレビューの取得
export const getProductReviews = async ({
    productSlug
}: { productSlug: ProductSlug }) => {
    const repository = getReviewRepository();
    const { reviews, totalCount } = await repository.getProductReviews({ productSlug });

    return {
        success: !!reviews && !!totalCount,
        data: {
            reviews,
            totalCount
        }   
    }
}