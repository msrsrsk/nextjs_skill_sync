import { formatNumber } from "@/lib/utils/format"
import { formatPaymentDueDate, formatOrderRemarks } from "@/services/order/format"
import { LOGO_IMAGE_PATH } from "@/constants/index"

interface SubscriptionPaymentRequestEmailProps {
    subscriptionHistoryUrl: string;
    subscriptionId: string;
    formattedOrderDate: string;
    productDetails: OrderProductProps[];
    subtotal: string;
    shippingFee: string;
    total: string;
    createdAt: number;
}

export const subscriptionPaymentRequestEmailTemplate = ({
    subscriptionHistoryUrl,
    subscriptionId,
    formattedOrderDate,
    productDetails,
    subtotal,
    shippingFee,
    total,
    createdAt,
}: SubscriptionPaymentRequestEmailProps) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お支払いのお願い</title>
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
                                style="text-align: center; font-size: 20px; font-weight: bold; color: #222222; padding-bottom: 12px;"
                            >
                                ※※※ お支払いのお願い ※※※
                            </td>
                        </tr>
                        
                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 14px; line-height: 1.8; color: #222222;"
                            >
                                この度は Skill Sync をご利用いただき<br>
                                誠にありがとうございます。<br>
                                下記ごサブスクリプションの<br>
                                お支払いが確認できませんでした。<br>
                                お手数ですが、ご確認の上お支払いをお願いいたします。
                            </td>
                        </tr>

                        <tr>
                            <td 
                                align="center" 
                                style="text-align: center; font-size: 16px; line-height: 1.8; color: #222222; padding-top: 20px;"
                            >
                                <span style="border: 1px solid red; padding: 8px 20px;">
                                    振込期限：${formatPaymentDueDate(createdAt)} 23:59
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="text-align: center; padding-top: 24px;">
                                <a href="${subscriptionHistoryUrl}" 
                                style="display: inline-block; background-color: #8dc1b8; color: #ffffff !important; font-weight: bold; font-size: 16px; text-decoration: none; padding: 16px 40px; border-radius: 4px; border: none; cursor: pointer; max-width: 90%; box-sizing: border-box; text-align: center;"
                                target="_blank">
                                    サブスクリプションの<br>
                                    履歴を確認する
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td style="border-bottom: 1px solid #ccc; padding-top: 32px;"></td>
                        </tr>

                        <tr>
                            <td style="padding-top: 24px;"></td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 20px; font-size: 16px; text-align: center; background-color: #f0f0f0; border-radius: 4px; margin-bottom: 16px;">
                                <span style="font-size: 16px; font-weight: bold;">サブスクリプションの内容</span>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top: 16px; font-size: 14px;">
                                契約ID：${subscriptionId}<br>
                                お支払い日時：${formattedOrderDate}
                            </td>
                        </tr>

                        <tr>
                            <td style="border-bottom: 1px dashed #ccc; padding-top: 16px;"></td>
                        </tr>

                        <tr>
                            <td style="padding: 24px 0 8px;">
                                <table 
                                    width="100%" 
                                    cellpadding="0" 
                                    cellspacing="0" 
                                    border="0"
                                >
                                    ${productDetails.map((item) => `
                                        <tr>
                                            <td style="padding-bottom: 16px;">
                                                <table 
                                                    width="100%" 
                                                    cellpadding="0" 
                                                    cellspacing="0" 
                                                    border="0"
                                                >
                                                    <tr>
                                                        <td 
                                                            width="64" 
                                                            style="width: 64px; vertical-align: center; padding-right: 20px;"
                                                        >
                                                            <img 
                                                                src="${item.image}" 
                                                                alt="" 
                                                                style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; display: block; aspect-ratio: 1;"
                                                            >
                                                        </td>
                                                        <td style="vertical-align: center;">
                                                            <div style="font-size: 16px; font-weight: bold;">
                                                                ${item.title}
                                                            </div>
                                                            <div style="font-size: 14px;">
                                                                <span>¥&thinsp;${formatNumber(item.amount)}</span>
                                                                <span>&ensp;/&ensp;</span>
                                                                <span style="color: #7f7e7e;">数量: ${item.quantity}点</span>
                                                            </div>
                                                            ${formatOrderRemarks(item) ? `
                                                                <div style="font-size: 14px;">
                                                                    <span>${formatOrderRemarks(item)}</span>
                                                                </div>
                                                            ` : ''}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="border-bottom: 1px dashed #ccc;"></td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 0;">
                                <table 
                                    width="100%" 
                                    cellpadding="0" 
                                    cellspacing="0" 
                                    border="0"
                                >
                                    <tr>
                                        <td style="padding-bottom: 4px;">
                                            <table 
                                                width="100%" 
                                                cellpadding="0" 
                                                cellspacing="0" 
                                                border="0"
                                            >
                                                <tr style="display: flex; flex-wrap: wrap; align-items: center;">
                                                    <td width="120" style="font-size: 14px;">小計</td>
                                                    <td style="font-size: 14px;">¥&thinsp;${subtotal}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 4px;">
                                            <table 
                                                width="100%" 
                                                cellpadding="0" 
                                                cellspacing="0" 
                                                border="0"
                                            >
                                                <tr style="display: flex; flex-wrap: wrap; align-items: center;">
                                                    <td width="120" style="font-size: 14px;">送料</td>
                                                    <td style="font-size: 14px;">¥&thinsp;${shippingFee}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 8px;">
                                            <table 
                                                width="100%" 
                                                cellpadding="0" 
                                                cellspacing="0" border="0"
                                            >
                                                <tr style="display: flex; flex-wrap: wrap; align-items: center;">
                                                    <td width="120" style="font-size: 16px; font-weight: bold;">合計<span style="font-size: 13px;">（税込）</span></td>
                                                    <td style="font-size: 16px; font-weight: bold;">¥&thinsp;${total}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="border-bottom: 1px dashed #ccc;"></td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 0;">
                                <table 
                                    width="100%" 
                                    cellpadding="0" 
                                    cellspacing="0" 
                                    border="0"
                                >
                                    <tr style="display: flex; flex-wrap: wrap; align-items: center;">
                                        <td width="120" style="font-size: 14px;">エラー内容</td>
                                        <td style="font-size: 14px;">引き落とし失敗</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="border-bottom: 1px dashed #ccc;"></td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 0;">
                                <table 
                                    width="100%" 
                                    cellpadding="0" 
                                    cellspacing="0" 
                                    border="0"
                                >
                                    <tr style="display: flex; flex-wrap: wrap; align-items: center;">
                                        <td width="160" style="font-size: 14px;">振込先</td>
                                        <td style="font-size: 14px;">
                                            〇〇銀行<br>
                                            〇〇支店（支店番号：XXX）<br>
                                            口座番号：XXXXXXX（普通）<br>
                                            口座名義：スキルシンク（カ
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="border-bottom: 1px solid #ccc;"></td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 10px 0;">
                                <table 
                                    width="100%" 
                                    cellpadding="0" 
                                    cellspacing="0" 
                                    border="0"
                                >
                                    <tr style="display: flex; flex-wrap: wrap; align-items: center;">
                                        <td style="font-size: 14px;">
                                            ※振込手数料はお客様のご負担でお願いします。<br>
                                            ※商品はご入金確認後の発送となります。<br>
                                            ※ご入金のタイミングによって納期が遅れることがございます。<br>
                                            ※ご注文者様情報とお振込名義が一致しない場合は不明入金となりますので必ずご連絡ください。
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`