import { Document, Page, Text, View, Font, Svg, Path } from "@react-pdf/renderer"
import { createTw } from "react-pdf-tailwind"

import { formatNumber, formatDate } from "@/lib/utils/format"
import { formatPaymentCardBrand } from "@/services/order/format"
import { RECEIPT_CONFIG, DATE_FORMAT_TYPES } from "@/constants/index"

const { TAX_RATE_8, TAX_RATE_10 } = RECEIPT_CONFIG;
const { DATE_FULL, DATE_OMISSION } = DATE_FORMAT_TYPES;

Font.register({
    family: "ZenKakuGothicNew",
    fonts: [
        {
            src: "/assets/fonts/zenkaku-gothic-new-medium.ttf",
            fontWeight: "medium",
        },
        {
            src: "/assets/fonts/zenkaku-gothic-new-bold.ttf",
            fontWeight: "bold",
        },
    ],
});

const tw = createTw({
    theme: {
        fontFamily: {
            zen: "ZenKakuGothicNew",
        },
        colors: {
            main: "#8DC1B8",
            accent: "rgba(141,193,184,0.3)",
        },
    },
});

const ReceiptPDF = ({ 
    order,
    isSubscription = false,
    subscriptionPaymentId
}: ReceiptPDFProps) => {
    const { 
        created_at, 
        order_items,
        order_number,
        total_amount,
        payment_method,
        order_shippings
    } = order;

    const { delivery_name, address, shipping_fee } = order_shippings || {};

    const receiptNumber = isSubscription && subscriptionPaymentId 
        ? subscriptionPaymentId 
        : order_number;

    const salesTax = Math.floor((total_amount) * TAX_RATE_10);

    return (
        <Document style={tw("leading-[150%] tracking-wide font-zen")}>
            <Page size="A4" style={tw("py-8 px-6")}>
                <View>
                    <Text style={tw("text-base font-medium text-right mb-[-2px]")}>
                        No.SS{formatDate(created_at, DATE_OMISSION)}-{receiptNumber}
                    </Text>
                    <Text style={tw("text-base font-medium text-right mb-[14px]")}>
                        {formatDate(created_at, DATE_FULL)}
                    </Text>
                    <Text style={tw("text-2xl font-bold text-center mb-4")}>
                        {isSubscription ? '請求書' : '納品書'}兼領収書
                    </Text>
                </View>
                <View style={tw("max-w-[240px] w-full mx-auto border-b border-foreground mb-3")}>
                    <Text style={tw("text-lg text-center font-meduim pb-1")}>
                        {delivery_name}　様
                    </Text>
                </View>
                <View style={tw("max-w-[240px] w-full mx-auto bg-accent py-[2px] mb-2")}>
                    <Text style={tw("text-[26px] text-center font-meduim")}>
                        ¥{formatNumber(total_amount)}-
                    </Text>
                </View>
                <View style={tw("mb-8")}>
                    <Text style={tw("text-sm text-center font-meduim mb-1")}>
                        (内　消費税¥{formatNumber(salesTax)}-)
                    </Text>
                    <Text style={tw("text-sm text-center font-meduim")}>
                        上記の通り領収いたしました
                    </Text>
                </View>
                <View style={tw("flex flex-row gap-6 mb-8")}>
                    <View style={tw("max-w-[254px] w-full mr-5")}>
                        <Text style={tw("text-base font-meduim")}>
                            〒{address?.postal_code}
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            {address?.state && address?.state}
                            {address?.city && address?.city}
                            {address?.address_line1 && address?.address_line1}
                        </Text>
                        {address?.address_line2 && (
                            <Text style={tw("text-base font-meduim")}>
                                {address?.address_line2}
                            </Text>
                        )}
                        <Text style={tw("text-base font-meduim")}>
                            {delivery_name} 様
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            支払い方法: {formatPaymentCardBrand(payment_method)}
                        </Text>
                    </View>
                    <View style={tw("max-w-[254px] w-full ml-5 relative")}>
                        <Text style={tw("text-base font-meduim")}>
                            SKILL SYNC
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            〒000-0000
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            北海道未来市仮想区1-2-3
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            スキルシティ・シンクタワー 11F
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            TEL: 00-0000-0000
                        </Text>
                        <Text style={tw("text-base font-meduim")}>
                            担当: 素喜流　芯来
                        </Text>
                        <Svg 
                            width="67" 
                            height="44" 
                            viewBox="0 0 67 44" 
                            style={tw("absolute bottom-[-5px] left-[102px] w-[67px] h-[44px]")}
                        >
                            <Path d="M3.5 0.5h60a3 3 0 0 1 3 3v37a3 3 0 0 1-3 3h-60a3 3 0 0 1-3-3v-37a3 3 0 0 1 3-3z" stroke="#8DC1B8" fill="none" />
                            <Path d="M17.0656 14.98C17.0656 16.3133 16.679 17.32 15.9056 18C15.1456 18.6667 14.079 19 12.7056 19H5.62562V16.6H13.1656C13.5923 16.6 13.9456 16.44 14.2256 16.12C14.5056 15.7867 14.6456 15.3867 14.6456 14.92C14.6456 14.48 14.5056 14.1 14.2256 13.78C13.9456 13.4467 13.5923 13.28 13.1656 13.28H9.28562C8.48562 13.28 7.80562 13.16 7.24562 12.92C6.69896 12.68 6.25229 12.3667 5.90562 11.98C5.57229 11.5933 5.32562 11.1667 5.16562 10.7C5.01896 10.22 4.94562 9.74667 4.94562 9.28C4.94562 8.72 5.02562 8.2 5.18562 7.72C5.34562 7.22667 5.59896 6.79333 5.94562 6.42C6.30562 6.04667 6.75896 5.75333 7.30562 5.54C7.85229 5.32667 8.51229 5.22 9.28562 5.22H16.1656V7.64H8.90562C8.69229 7.64 8.49229 7.68667 8.30562 7.78C8.11896 7.86 7.95229 7.97333 7.80562 8.12C7.67229 8.26667 7.55896 8.44 7.46562 8.64C7.38562 8.82667 7.34562 9.02667 7.34562 9.24C7.34562 9.69333 7.49896 10.08 7.80562 10.4C8.11229 10.7067 8.48562 10.86 8.92562 10.86H12.7456C14.079 10.86 15.1323 11.2 15.9056 11.88C16.679 12.5467 17.0656 13.5467 17.0656 14.88V14.98ZM22.0375 19H19.6175V5.22H22.0375V9.6L31.1575 5.1V7.86L21.9775 12.1L31.1575 16.46V19.14L22.0375 14.6V19ZM33.9331 5.22H36.3531V19H33.9331V5.22ZM45.2081 19C44.1948 19 43.3081 18.86 42.5481 18.58C41.7881 18.3 41.1481 17.9 40.6281 17.38C40.1215 16.86 39.7415 16.2333 39.4881 15.5C39.2348 14.7667 39.1081 13.9467 39.1081 13.04V5.22H41.5281V13.06C41.5281 14.18 41.8415 15.0533 42.4681 15.68C43.1081 16.2933 43.9948 16.6 45.1281 16.6H49.3281V19H45.2081ZM57.9612 19C56.9479 19 56.0612 18.86 55.3012 18.58C54.5412 18.3 53.9012 17.9 53.3812 17.38C52.8746 16.86 52.4946 16.2333 52.2412 15.5C51.9879 14.7667 51.8612 13.9467 51.8612 13.04V5.22H54.2812V13.06C54.2812 14.18 54.5946 15.0533 55.2212 15.68C55.8612 16.2933 56.7479 16.6 57.8812 16.6H62.0812V19H57.9612ZM17.3094 34.98C17.3094 36.3133 16.9227 37.32 16.1494 38C15.3894 38.6667 14.3227 39 12.9494 39H5.86937V36.6H13.4094C13.836 36.6 14.1894 36.44 14.4694 36.12C14.7494 35.7867 14.8894 35.3867 14.8894 34.92C14.8894 34.48 14.7494 34.1 14.4694 33.78C14.1894 33.4467 13.836 33.28 13.4094 33.28H9.52937C8.72937 33.28 8.04937 33.16 7.48937 32.92C6.94271 32.68 6.49604 32.3667 6.14937 31.98C5.81604 31.5933 5.56937 31.1667 5.40937 30.7C5.26271 30.22 5.18937 29.7467 5.18937 29.28C5.18937 28.72 5.26937 28.2 5.42937 27.72C5.58937 27.2267 5.84271 26.7933 6.18937 26.42C6.54937 26.0467 7.00271 25.7533 7.54937 25.54C8.09604 25.3267 8.75604 25.22 9.52937 25.22H16.4094V27.64H9.14937C8.93604 27.64 8.73604 27.6867 8.54937 27.78C8.36271 27.86 8.19604 27.9733 8.04937 28.12C7.91604 28.2667 7.80271 28.44 7.70937 28.64C7.62937 28.8267 7.58937 29.0267 7.58937 29.24C7.58937 29.6933 7.74271 30.08 8.04937 30.4C8.35604 30.7067 8.72937 30.86 9.16937 30.86H12.9894C14.3227 30.86 15.376 31.2 16.1494 31.88C16.9227 32.5467 17.3094 33.5467 17.3094 34.88V34.98ZM24.3412 32.9L19.2412 25.22H22.1212L25.5412 30.74L28.9412 25.22H31.8212L26.7412 32.74V39H24.3412V32.9ZM47.822 35.72C47.822 36.24 47.7287 36.7067 47.542 37.12C47.3554 37.5333 47.102 37.8933 46.782 38.2C46.462 38.4933 46.082 38.72 45.642 38.88C45.2154 39.04 44.7554 39.12 44.262 39.12C43.542 39.12 42.902 38.9333 42.342 38.56C41.782 38.1733 41.3887 37.64 41.162 36.96L38.402 28.48C38.322 28.2 38.2154 27.9867 38.082 27.84C37.962 27.68 37.7887 27.6 37.562 27.6C36.882 27.6 36.542 28 36.542 28.8V39H33.962V28.56C33.962 28.0533 34.0487 27.5933 34.222 27.18C34.4087 26.7533 34.662 26.3933 34.982 26.1C35.302 25.8067 35.6754 25.58 36.102 25.42C36.542 25.26 37.0154 25.18 37.522 25.18C38.2287 25.18 38.862 25.3667 39.422 25.74C39.982 26.1133 40.3754 26.64 40.602 27.32L43.382 35.82C43.4754 36.1 43.582 36.3133 43.702 36.46C43.822 36.5933 43.9954 36.66 44.222 36.66C44.902 36.66 45.242 36.26 45.242 35.46V25.22H47.822V35.72ZM56.6623 39C52.489 39 50.4023 36.7067 50.4023 32.12V32.06C50.4157 27.5 52.509 25.22 56.6823 25.22H61.6823V27.64H56.0623C54.969 27.64 54.149 28 53.6023 28.72C53.069 29.44 52.8023 30.58 52.8023 32.14C52.8023 35.1133 53.8823 36.6 56.0423 36.6H61.6623V39H56.6623Z" fill="#8DC1B8"/>
                        </Svg>
                    </View>
                </View>
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("bg-accent text-sm font-bold pt-1 pb-2 px-2 max-w-[191px] w-full text-center border border-main min-h-[23px]")}>
                            商品名
                        </Text>
                        <Text style={tw("bg-accent text-sm font-bold pt-1 pb-2 px-2 max-w-[40px] w-full text-center border-t border-r border-b border-main min-h-[23px]")}>
                            税率
                        </Text>
                        <Text style={tw("bg-accent text-sm font-bold pt-1 pb-2 px-2 max-w-[64px] w-full text-center border-t border-r border-b border-main min-h-[23px]")}>
                            単価
                        </Text>
                        <Text style={tw("bg-accent text-sm font-bold pt-1 pb-2 px-2 max-w-[48px] w-full text-center border-t border-r border-b border-main min-h-[23px]")}>
                            数量
                        </Text>
                        <Text style={tw("bg-accent text-sm font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-center border-t border-r border-b border-main min-h-[23px]")}>
                            金額
                        </Text>
                        <Text style={tw("bg-accent text-sm font-bold pt-1 pb-2 px-2 max-w-[114px] w-full text-center border-t border-r border-b border-main min-h-[23px]")}>
                            備考
                        </Text>
                    </View>
                </View>
                {order_items.map((item: OrderItemWithSelectFields) => {
                    const { product, quantity, unit_price, remarks } = item;

                    const isSale = unit_price < product.price;

                    return (
                        <View key={item.id}>
                            <View style={tw("flex flex-row")}>
                                <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[191px] w-full border-l border-r border-b border-main min-h-[23px]")}>
                                    {product.title}{isSubscription && '（サブスクリプション）'}
                                </Text>
                                <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[40px] w-full text-center border-r border-b border-main min-h-[23px]")}>
                                    {TAX_RATE_10 * 100}%
                                </Text>
                                <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[64px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                                    {formatNumber(unit_price)}
                                </Text>
                                <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[48px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                                    {quantity}
                                </Text>
                                <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                                    {formatNumber(unit_price * quantity)}
                                </Text>
                                <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full border-r border-b border-main min-h-[23px]")}>
                                    {remarks && remarks}<br />
                                    {!isSubscription && isSale && 'セール価格'}
                                </Text>
                            </View>
                        </View>
                    );
                })}
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[343px] w-full text-center border-l border-r border-b border-main min-h-[23px]")}></Text>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main min-h-[23px]")}></Text>
                        <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full text-right border-r border-b border-main min-h-[23px]")}></Text>
                    </View>
                </View>
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[343px] w-full text-center border-l border-r border-b border-main min-h-[23px]")}></Text>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            小計
                        </Text>
                        <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            ¥{formatNumber(total_amount - (shipping_fee || 0))}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[343px] w-full text-center border-l border-r border-b border-main min-h-[23px]")}></Text>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            配送料
                        </Text>
                        <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            ¥{formatNumber(shipping_fee || 0)}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("text-xs font-bold pt-1 pb-2 px-2 max-w-[343px] w-full text-center border-l border-r border-b border-main min-h-[23px]")}></Text>
                        <Text style={tw("text-xs font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            内消費税({Math.round(TAX_RATE_8 * 100)}%対象)
                        </Text>
                        <Text style={tw("text-xs font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            ¥0
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("text-xs font-bold pt-1 pb-2 px-2 max-w-[343px] w-full text-center border-l border-r border-b border-main min-h-[23px]")}></Text>
                        <Text style={tw("text-xs font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            内消費税({Math.round(TAX_RATE_10 * 100)}%対象)
                        </Text>
                        <Text style={tw("text-xs font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full text-right border-r border-b border-main min-h-[23px]")}>
                            ¥{formatNumber(salesTax)}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={tw("flex flex-row")}>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[343px] w-full text-center border-l border-r border-b border-main")}></Text>
                        <Text style={tw("text-sm font-bold pt-1 pb-2 px-2 max-w-[100px] w-full text-right border-r border-b border-main")}>
                            合計
                        </Text>
                        <Text style={tw("text-sm font-meduim pt-1 pb-2 px-2 max-w-[114px] w-full text-right border-r border-b border-main")}>
                            ¥{formatNumber(total_amount)}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default ReceiptPDF