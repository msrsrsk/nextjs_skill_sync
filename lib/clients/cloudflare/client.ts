import { S3Client } from "@aws-sdk/client-s3"

import { CLOUDFLARE_BUCKET_TYPES } from "@/constants/index"

const { BUCKET_REVIEW, BUCKET_PROFILE } = CLOUDFLARE_BUCKET_TYPES;

const createR2Client = (bucketType: CloudflareBucketType) => {
    const configs = {
        [BUCKET_REVIEW]: {
            bucketName: process.env.REVIEW_BUCKET_NAME!,
            accessKeyId: process.env.REVIEW_R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.REVIEW_R2_SECRET_ACCESS_KEY!,
        },
        [BUCKET_PROFILE]: {
            bucketName: process.env.PROFILE_BUCKET_NAME!,
            accessKeyId: process.env.PROFILE_R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.PROFILE_R2_SECRET_ACCESS_KEY!,
        }
    };

    const config = configs[bucketType];
    
    if (!config.accessKeyId || !config.secretAccessKey || !config.bucketName) {
        throw new Error(`Missing R2 configuration for ${bucketType} bucket`);
    }

    return {
        client: new S3Client({
            region: "auto",
            endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        }),
        bucketName: config.bucketName,
    }
}

export { createR2Client }