"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { 
    createReviewData, 
    getSectionReviewsData,
    getProductReviewsData
} from "@/lib/database/prisma/actions/reviews"
import { uploadImageToR2 } from "@/lib/services/cloudflare/actions"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from '@/constants/errorMessages'

const { BUCKET_REVIEW } = CLOUDFLARE_BUCKET_TYPES;
const { AUTH_ERROR, REVIEW_ERROR } = ERROR_MESSAGES;

// レビューの作成
export const createReview = async ({ reviewData }: { reviewData: Review }) => {
    try {
        const review = await createReviewData({ reviewData });

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

// Reviewセクションの全てのレビューデータの取得
export const getSectionReviews = async () => {
    try {
        const { reviews, totalCount } = await getSectionReviewsData();

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
        const { reviews, totalCount } = await getProductReviewsData({ productSlug });

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

export async function createReviewAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionStateWithTimestamp> {
    const { userId } = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

    const rating = Number(formData.get('rating'));
    const name = formData.get('name');
    const comment = formData.get('textarea');
    const files = formData.getAll('files') as File[];
    const productId = formData.get('productId') as ProductId;

    let image_urls: string[] = [];

    try {
        if (files.length > 0) {
            const { success, error, data } = await uploadImageToR2({
                files, 
                bucketType: BUCKET_REVIEW,
                userId: userId as UserId
            });

            if (!success) {
                return {
                    success: false, 
                    error: error,
                    timestamp: Date.now()
                }
            }

            if (data) image_urls = data;
        }

        if (!productId) {
            return {
                success: false, 
                error: REVIEW_ERROR.POST_FAILED,
                timestamp: Date.now()
            }
        }

        const reviewData = { 
            rating, 
            name, 
            comment, 
            image_urls,
            user_id: userId,
            product_id: productId,
        } as Review;

        await createReview({ reviewData });

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Create Review error:', error);
    
        return {
            success: false, 
            error: REVIEW_ERROR.POST_FAILED,
            timestamp: Date.now()
        }
    }
}