import crypto from "crypto"

interface VerifyHMACSignatureProps {
    payload: string;
    signature: string;
    secret: string;
}

export async function verifyHMACSignature({
    payload,
    signature,
    secret
}: VerifyHMACSignatureProps): Promise<boolean> {
    try {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('base64');

        const signatureBuffer = Buffer.from(signature, 'base64');
        const expectedBuffer = Buffer.from(expectedSignature, 'base64');

        if (signatureBuffer.length !== expectedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    } catch (error) {
        return false;
    }
}