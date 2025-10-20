import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/clients/stripe/client"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { WEBHOOK_ERROR } = ERROR_MESSAGES;

interface VerifyHMACSignatureProps {
    payload: string;
    signature: string;
    secret: string;
}

interface WebhookHandlerOptions<T> {
    record: T;
    processFunction: (record: T) => Promise<{ success: boolean; error?: string }>;
    errorText: string; 
    condition?: (record: T) => boolean;
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
    console.log('Debug Info:', {
        payload: payload,
        payloadLength: payload.length,
        secret: secret.substring(0, 10) + '...',
        receivedSignature: signature
    });
    
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('base64');

    console.log('Signature Debug:', {
        signature: signature,
        expectedSignature: expectedSignature,
        actualLength: signature.length,
        expectedLength: expectedSignature.length
    });

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
        return NextResponse.json(
            { message: errorMessage }, 
            { status: 400 }) 
    }

    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
    );

    return event
}

export async function verifySupabaseWebhookAuth({
    request,
    errorMessage
}: VerifyWebhookAuth) {
    const headersList = await headers();
    
    const authHeader = headersList.get('authorization');
    const signatureHeader = headersList.get('x-webhook-signature');
    
    const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`;
    
    if (authHeader !== expectedAuth) {
        return NextResponse.json(
            { message: errorMessage }, 
            { status: 400 }) 
    }

    const payload = await request.text();
    const isValidSignature = await verifyHMACSignature({
        payload,
        signature: signatureHeader as string,
        secret: process.env.SUPABASE_WEBHOOK_SECRET_KEY as string
    });
    
    if (!isValidSignature) {
        return NextResponse.json(
            { message: errorMessage }, 
            { status: 400 }) 
    }

    return null
}

export async function handleWebhook<T>(
    request: NextRequest, 
    options: WebhookHandlerOptions<T>
) {
  const { record, processFunction, errorText, condition } = options;

    try {
        const authError = await verifySupabaseWebhookAuth({
            request,
            errorMessage: errorText
        });
        
        if (authError) return authError;
        
        if (condition && !condition(record)) {
            return NextResponse.json({ 
                success: true, 
                message: WEBHOOK_ERROR.SKIP_PROCESS 
            })
        }

        const result = await processFunction(record);

        if (!result.success) {
            return NextResponse.json(
                { message: result.error }, 
                { status: 500 }) 
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Webhook Error -', error);

        const errorMessage = error instanceof Error ? error.message : errorText;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        )
    } 
}