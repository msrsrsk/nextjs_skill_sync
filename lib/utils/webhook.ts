import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { WEBHOOK_ERROR } = ERROR_MESSAGES;

interface WebhookHandlerOptions<T> {
    record: T;
    processFunction: (record: T) => Promise<{ success: boolean; error?: string }>;
    errorText: string; 
    condition?: (record: T) => boolean;
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