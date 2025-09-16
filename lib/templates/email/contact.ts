import { LOGO_IMAGE_PATH } from "@/constants/index"

interface ContactEmailProps {
    userId: string;
    userName: string;
    lastName: string;
    firstName: string;
    email: string;
    message: string;
    files: File[];
}

export const contactEmailTemplate = ({
    userId,
    userName,
    lastName,
    firstName,
    email,
    message,
    files,
}: ContactEmailProps) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お問い合わせ内容</title>
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
                                【お問い合わせ内容】
                            </td>
                        </tr>

                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;"
                            >
                                下記内容でお問い合わせが届きました。<br>
                                内容を確認後、ご返信をお願いいたします。
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                ログイン状況:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${userId && userName ? `
                                    ユーザーID: ${userId}<br>
                                    ユーザー名: ${userName}
                                ` : `
                                    ログインしていません
                                `}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                お名前:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; margin-bottom: 28px; color: #222222; padding-bottom: 28px;">
                                ${lastName} ${firstName}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                メールアドレス:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${email}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222">
                                お問い合わせ内容:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222; padding-bottom: 28px;">
                                ${message}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: left; font-size: 16px; font-weight: bold; color: #222222;">
                                添付ファイル:
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-size: 14px; line-height: 1.8; color: #222222;">
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    ${files.map(file => `<li>${file.name}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`