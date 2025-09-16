"use server"

import { Resend } from "resend"

import { reviewNotificationEmailTemplate } from "@/lib/templates/email/notification"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

// レビュー投稿の通知メール
export async function receiveReviewNotificationEmail(record: Review) {
    const resend = new Resend(process.env.RESEND_REVIEW_NOTIFICATION_API_KEY);

    try {
        await resend.emails.send({
            from: 'notification@skill-sync.site',
            to: [process.env.CONTACT_EMAIL!],
            subject: `【Skill Sync】のサイトにレビューが投稿されました`,
            html: reviewNotificationEmailTemplate(record)
        });
        
        return {
            success: true, 
            error: undefined
        }
    } catch (error) {
        console.error('Email Error: Receive Review Notification Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.REVIEW_SEND_FAILED
        }
    }
}