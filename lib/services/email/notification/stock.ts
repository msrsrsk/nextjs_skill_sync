"use server"

import { Resend } from "resend"

import { stockNotificationEmailTemplate } from "@/lib/templates/email/notification"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

// 在庫補充の必通知メール
export async function receiveStockNotificationEmail(record: NotificationData) {
    const resend = new Resend(process.env.RESEND_REVIEW_NOTIFICATION_API_KEY);

    try {
        await resend.emails.send({
            from: 'notification@skill-sync.site',
            to: [process.env.CONTACT_EMAIL!],
            subject: `【Skill Sync】商品在庫の補充必要のご連絡`,
            html: stockNotificationEmailTemplate(record)
        });
        
        return {
            success: true, 
            error: undefined
        }
    } catch (error) {
        console.error('Email Error: Receive Stock Notification Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.REVIEW_SEND_FAILED
        }
    }
}