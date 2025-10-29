"use server"

import { Resend } from "resend"

import { verificationEmailTemplate } from "@/lib/templates/email/verification"
import { getVerificationEmailConfig } from "@/services/email/auth/config"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

interface SendVerificationEmailProps {
    email: string
    token: string
    type: EmailVerificationType
}

// 認証メールの送信
export async function sendVerificationEmail({ 
    email, 
    token,
    type
}: SendVerificationEmailProps) {
    const resend = new Resend(process.env.RESEND_AUTH_VERIFY_EMAIL_API_KEY);
    
    try {
        const config = getVerificationEmailConfig(type, token);
        
        await resend.emails.send({
            from: 'noreply@skill-sync.site',
            to: email,
            subject: config.subject,
            html: verificationEmailTemplate(config)
        })
        
        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Email Error: Send Verification Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.AUTH_SEND_FAILED
        }
    }
}