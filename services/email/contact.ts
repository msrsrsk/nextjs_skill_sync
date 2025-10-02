"use server"

import { Resend } from "resend"

import { contactEmailTemplate } from "@/lib/templates/email/contact"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

// お問い合わせメールの受信
export async function receiveContactEmail(formData: FormData) {
    const resend = new Resend(process.env.RESEND_CONTACT_API_KEY);

    const lastName = formData.get('lastName') as string;
    const firstName = formData.get('firstName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    
    try {
        const attachments = await Promise.all(
            files.map(async (file) => ({
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()).toString('base64')
            }))
        );

        await resend.emails.send({
            from: 'contact@skill-sync.site',
            to: [process.env.CONTACT_EMAIL!],
            subject: `【Skill Sync】のサイトからお問い合わせが届きました`,
            html: contactEmailTemplate({
                userId,
                userName,
                lastName,
                firstName,
                email,
                message,
                files,
            }),
            attachments: attachments
        });
        
        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Email Error: Receive Contact Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.CONTACT_SEND_FAILED
        }
    }
}