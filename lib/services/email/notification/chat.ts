"use server"

import { Resend } from "resend"

import { chatNotificationEmailTemplate } from "@/lib/templates/email/notification"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

// チャットメッセージの通知メール
export async function receiveChatNotificationEmail(record: NotificationData) {
    const resend = new Resend(process.env.RESEND_CHAT_NOTIFICATION_API_KEY);

    try {
        await resend.emails.send({
            from: 'notification@skill-sync.site',
            to: [process.env.CONTACT_EMAIL!],
            subject: `【Skill Sync】のサイトにチャットメッセージが送信されました`,
            html: chatNotificationEmailTemplate(record)
        })
        
        return {
            success: true, 
            error: undefined
        }
    } catch (error) {
        console.error('Email Error: Receive Chat Notification Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.CHAT_SEND_FAILED
        }
    }
}