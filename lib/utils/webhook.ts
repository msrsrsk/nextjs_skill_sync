import crypto from "crypto"
import { NextRequest } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/clients/stripe/client"

interface VerifyHMACSignatureProps {
    payload: string;
    signature: string;
    secret: string;
}

interface VerifyWebhookAuth {
    request: NextRequest;
    errorMessage: string;
}

interface VerifyWebhookSignature extends VerifyWebhookAuth {
    endpointSecret: string;
}

async function verifyHMACSignature({
    payload,
    signature,
    secret
}: VerifyHMACSignatureProps): Promise<boolean> {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('base64');

    return crypto.timingSafeEqual(
        Buffer.from(signature, 'base64'),
        Buffer.from(expectedSignature, 'base64')
    )
}

export async function verifyWebhookSignature({
    request,
    endpointSecret,
    errorMessage
}: VerifyWebhookSignature) {
    const signature = headers().get(process.env.STRIPE_SIGNATURE_HEADER as string);

    if (!signature || !endpointSecret) {
        if (!signature) console.error('Stripe signature not found');
        if (!endpointSecret) console.error('Stripe endpointSecret not found');
        throw new Error(errorMessage);
    }

    const body = await request.text();

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            endpointSecret
        );
        
        return event;
    } catch (error) {
        console.error('Stripe webhook signature verification failed:', error);
        throw new Error(errorMessage);
    }
}

export async function verifySupabaseWebhookAuth({
    request,
    errorMessage
}: VerifyWebhookAuth) {
    const payload = await request.text();

    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const signatureHeader = headersList.get('x-webhook-signature');

    const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`;

    if (authHeader !== expectedAuth) {
        throw new Error(errorMessage);
    }

    const isValidSignature = await verifyHMACSignature({
        payload,
        signature: signatureHeader as string,
        secret: process.env.SUPABASE_WEBHOOK_SECRET_KEY as string
    });
    
    if (!isValidSignature) {
        throw new Error(errorMessage);
    }

    const parsedPayload = JSON.parse(payload);

    return {
        record: parsedPayload.record,
        old_record: parsedPayload.old_record,
        type: parsedPayload.type
    }
}