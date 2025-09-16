import { EMAIL_VERIFICATION_TOKEN_CONFIG, LOGO_IMAGE_PATH } from "@/constants/index"
const { EXPIRATION_TEXT } = EMAIL_VERIFICATION_TOKEN_CONFIG;

export const verificationEmailTemplate = (config: { url: string }) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>メールアドレス認証</title>
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
            style="background: #f0f0f0; margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; color: #222222; line-height: 1.6;"
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
                            <td 
                                align="center" 
                                style="text-align: center; margin-bottom: 16px; padding-bottom: 24px;"
                            >
                                <img src="${process.env.NEXT_PUBLIC_BASE_URL}${LOGO_IMAGE_PATH}" 
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
                                メールアドレス認証
                            </td>
                        </tr>
                        
                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 14px; line-height: 1.8; color: #222222;"
                            >
                                ご登録いただき誠にありがとうございます。<br>
                                以下のリンクよりメールアドレスの<br>
                                認証を行ってください。
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="text-align: center; padding-top: 24px;">
                                <a href="${config.url}" 
                                style="display: inline-block; background-color: #8dc1b8; color: #ffffff !important; font-weight: bold; font-size: 16px; text-decoration: none; padding: 16px 20px; border-radius: 4px; border: none; cursor: pointer; max-width: 90%; box-sizing: border-box;"
                                target="_blank">
                                    メールアドレスを認証する
                                </a>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="border-bottom: 1px solid #ccc; padding: 16px 0;">
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="font-size: 12px; line-height: 1.6; color: #222222; padding-top: 24px;">
                                ※認証リンクの有効時間は${EXPIRATION_TEXT}時間です。<br>
                                ※このメールに心当たりの無い場合は、メールを破棄してください。<br>
                                ※このメールアドレスは配信専用のため、返信されても返信内容の確認およびご返答ができませんのでご注意ください。
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`