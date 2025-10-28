"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { createReview } from "@/services/review/actions"
import { uploadImageToR2 } from "@/services/cloudflare/actions"
import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from '@/constants/errorMessages'

const { BUCKET_REVIEW } = CLOUDFLARE_BUCKET_TYPES;
const { AUTH_ERROR, REVIEW_ERROR } = ERROR_MESSAGES;

export async function createReviewAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionStateWithTimestamp> {
    const rating = Number(formData.get('rating'));
    const name = formData.get('name');
    const comment = formData.get('textarea');
    const files = formData.getAll('files') as File[];
    const productId = formData.get('productId') as ProductId;

    let image_urls: string[] = [];

    try {
        const authResult = await actionAuth(AUTH_ERROR.SESSION_NOT_FOUND);

        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error as string,
                timestamp: Date.now()
            }
        }

        const { userId } = authResult;

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
                error: REVIEW_ERROR.POST_MISSING_DATA,
                timestamp: Date.now()
            }
        }

        const reviewResult = await createReview({ 
            reviewData: { 
                rating, 
                name, 
                comment, 
                image_urls,
                user_id: userId,
                product_id: productId,
            } as Review
        });

        if (!reviewResult.success) {
            return {
                success: false, 
                error: reviewResult.error as string,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Create Review error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : REVIEW_ERROR.POST_FAILED;
    
        return {
            success: false, 
            error: errorMessage,
            timestamp: Date.now()
        }
    }
}