"use server"

import { createReviewRepository, getReviewRepository } from "@/repository/review"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

// レビューの作成
export const createReview = async ({ reviewData }: { reviewData: Review }) => {
    try {
        const repository = createReviewRepository();
        const result = await repository.createReview({ reviewData });

        if (!result) {
            return {
                success: false, 
                error: REVIEW_ERROR.CREATE_FAILED,
            }
        }
    
        return { 
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in createReview: ', error);

        return {
            success: false, 
            error: REVIEW_ERROR.CREATE_FAILED,
        }
    }
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