import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/clients/stripe/client"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { WEBHOOK_ERROR } = ERROR_MESSAGES;

interface WebhookHandlerOptions<T> {
    record: T;
    processFunction: (record: T) => Promise<{ success: boolean; error?: string }>;
    errorText: string; 
    condition?: (record: T) => boolean;
}

interface verifyWebhookSignature {
    request: NextRequest;
    endpointSecret: string;
    errorMessage: string;
}

export async function handleWebhook<T>(
    request: NextRequest, 
    options: WebhookHandlerOptions<T>
) {
  const { record, processFunction, errorText, condition } = options;

    try {
        const headersList = await headers();
    
        const authHeader = headersList.get('authorization');
        const signatureHeader = headersList.get('x-webhook-signature');
        
        const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`;
        const expectedSignature = process.env.SUPABASE_WEBHOOK_SIGNATURE;
        
        if (authHeader !== expectedAuth || signatureHeader !== expectedSignature) {
            return NextResponse.json(
                { message: errorText }, 
                { status: 400 }) 
        }
        
        if (condition && !condition(record)) {
            return NextResponse.json({ 
                success: true, 
                message: WEBHOOK_ERROR.SKIP_PROCESS 
            });
        }

        const result = await processFunction(record);

        if (!result.success) {
            return NextResponse.json(
                { message: result.error }, 
                { status: 500 }) 
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error -', error);

        const errorMessage = error instanceof Error ? error.message : errorText;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        );
    } 
}

// Webhookの署名の認証
export async function verifyWebhookSignature({
    request,
    endpointSecret,
    errorMessage
}: verifyWebhookSignature) {
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

    return event;
}