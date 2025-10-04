"use server"

import { createReviewRepository, getReviewRepository } from "@/repository/review"
import { ERROR_MESSAGES } from '@/constants/errorMessages'

const { REVIEW_ERROR } = ERROR_MESSAGES;

// レビューの作成
export const createReview = async ({ reviewData }: { reviewData: Review }) => {
    try {
        const repository = createReviewRepository();
        const review = await repository.createReview({ reviewData });

        return {
            success: true, 
            error: null, 
            data: review
        }
    } catch (error) {
        console.error('Database : Error in createReview: ', error);

        return {
            success: false, 
            error: REVIEW_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// 全てのレビューデータの取得
export const getSectionReviews = async () => {
    try {
        const repository = getReviewRepository();
        const { reviews, totalCount } = await repository.getAllReviews();

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