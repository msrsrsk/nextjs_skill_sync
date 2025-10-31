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
    try {
        const repository = getReviewRepository();
        const { reviews, totalCount } = await repository.getAllReviews();

        if (reviews == null || totalCount == null) {
            return {
                success: false, 
                error: REVIEW_ERROR.FETCH_FAILED,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: {
                reviews,
                totalCount
            }
        }
    } catch (error) {
        console.error('Database : Error in getSectionReviews: ', error);

        return {
            success: false, 
            error: REVIEW_ERROR.FETCH_FAILED,
            data: null
        }
    }
}

// 個別商品のレビューの取得
export const getProductReviews = async ({
    productSlug
}: { productSlug: ProductSlug }) => {
    try {
        const repository = getReviewRepository();
        const { reviews, totalCount } = await repository.getProductReviews({ productSlug });

        if (reviews == null || totalCount == null) {
            return {
                success: false, 
                error: REVIEW_ERROR.INDIVIDUAL_FETCH_FAILED,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: {
                reviews,
                totalCount
            }
        }
    } catch (error) {
        console.error('Database : Error in getProductReviews: ', error);

        return {
            success: false, 
            error: REVIEW_ERROR.INDIVIDUAL_FETCH_FAILED,
            data: null
        }
    }
}