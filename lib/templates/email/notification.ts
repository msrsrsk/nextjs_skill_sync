import { LOGO_IMAGE_PATH } from "@/constants/index"

export const chatNotificationEmailTemplate = (chatData: ChatNotificationData) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>チャットメッセージ内容</title>
    <style>
        body {
            background: #f0f0f0;
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #222222;
            line-height: 1.6;
        }
    </style>
    </head>
    <body>
        <table 
            width="100%" 
            cellpadding="0" 
            cellspacing="0" 
            border="0" 
            style="background: #f0f0f0; margin: 0; padding: 10px; font-family: Arial, Helvetica, sans-serif; color: #222222; line-height: 1.6;"
        >
            <tr>
                <td 
                    align="center" 
                >
                    <table 
                        width="100%" 
                        cellpadding="0" 
                        cellspacing="0" 
                        border="0" 
                        style="max-width: 600px; margin: 0 auto; background: #fcfdfd; border-radius: 8px; padding: 40px 20px 24px;"
                    >
                        <tr>
                            <td align="center" style="text-align: center; margin-bottom: 16px; padding-bottom: 24px;">
                                <img 
                                    src="${process.env.NEXT_PUBLIC_BASE_URL}${LOGO_IMAGE_PATH}" 
                                    alt="Skill Sync" 
                                    style="max-width: 260px; width: 100%; height: auto; margin: 0 auto; display: block;"
                                >
                            </td>
                        </tr>
                        
                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #222222; padding-bottom: 12px;"
                            >
                                【メッセージ内容】
                            </td>
                        </tr>

                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;"
                            >
                                下記送信されたチャットを確認後、<br>
                                返信対応をお願いいたします。
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                投稿者のID:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${chatData.id}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                チャットルームID:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;">
                                ${chatData.chat_room_id}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                メッセージ:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${chatData.message}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                送信時間（UTC）:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222;">
                                ${chatData.sent_at}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`

export const reviewNotificationEmailTemplate = (record: Review) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>レビュー内容</title>
    <style>
        body {
            background: #f0f0f0;
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #222222;
            line-height: 1.6;
        }
    </style>
    </head>
    <body>
        <table 
            width="100%" 
            cellpadding="0" 
            cellspacing="0" 
            border="0" 
            style="background: #f0f0f0; margin: 0; padding: 10px; font-family: Arial, Helvetica, sans-serif; color: #222222; line-height: 1.6;"
        >
            <tr>
                <td 
                    align="center" 
                >
                    <table 
                        width="100%" 
                        cellpadding="0" 
                        cellspacing="0" 
                        border="0" 
                        style="max-width: 600px; margin: 0 auto; background: #fcfdfd; border-radius: 8px; padding: 40px 20px 24px;"
                    >
                        <tr>
                            <td align="center" style="text-align: center; margin-bottom: 16px; padding-bottom: 24px;">
                                <img 
                                    src="${process.env.NEXT_PUBLIC_BASE_URL}${LOGO_IMAGE_PATH}" 
                                    alt="Skill Sync" 
                                    style="max-width: 260px; width: 100%; height: auto; margin: 0 auto; display: block;"
                                >
                            </td>
                        </tr>
                        
                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #222222; padding-bottom: 12px;"
                            >
                                【レビュー内容】
                            </td>
                        </tr>

                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;"
                            >
                                下記投稿されたレビューを確認後、<br>
                                承認対応をお願いいたします。
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                投稿者:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${record.name}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                評価:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;">
                                ${record.rating}/5
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                コメント:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${record.comment}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                投稿時間（UTC）:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222;">
                                ${record.created_at}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`

export const stockNotificationEmailTemplate = (productData: ProductNotificationData) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>商品在庫の補充必要の通知</title>
    <style>
        body {
            background: #f0f0f0;
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #222222;
            line-height: 1.6;
        }
    </style>
    </head>
    <body>
        <table 
            width="100%" 
            cellpadding="0" 
            cellspacing="0" 
            border="0" 
            style="background: #f0f0f0; margin: 0; padding: 10px; font-family: Arial, Helvetica, sans-serif; color: #222222; line-height: 1.6;"
        >
            <tr>
                <td 
                    align="center" 
                >
                    <table 
                        width="100%" 
                        cellpadding="0" 
                        cellspacing="0" 
                        border="0" 
                        style="max-width: 600px; margin: 0 auto; background: #fcfdfd; border-radius: 8px; padding: 40px 20px 24px;"
                    >
                        <tr>
                            <td align="center" style="text-align: center; margin-bottom: 16px; padding-bottom: 24px;">
                                <img 
                                    src="${process.env.NEXT_PUBLIC_BASE_URL}${LOGO_IMAGE_PATH}" 
                                    alt="Skill Sync" 
                                    style="max-width: 260px; width: 100%; height: auto; margin: 0 auto; display: block;"
                                >
                            </td>
                        </tr>
                        
                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #222222; padding-bottom: 12px;"
                            >
                                【在庫の内容】
                            </td>
                        </tr>

                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;"
                            >
                                下記の商品の在庫が残り10個以下です。<br>
                                確認後、在庫の補充をお願いいたします。
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                商品ID:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;">
                                ${productData.id}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                商品名:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${productData.title}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`