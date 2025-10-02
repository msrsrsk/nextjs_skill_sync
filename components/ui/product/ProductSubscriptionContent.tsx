"use client"

import { Package, RefreshCw } from "lucide-react"

import useSubscription from "@/hooks/layout/useSubscription"
import { formatNumber } from "@/lib/utils/format"
import { formatSubscriptionInterval } from "@/services/subscription-payment/format"
import { SUBSCRIPTION_PURCHASE_TYPES } from "@/constants/index"

const { ONE_TIME, SUBSCRIPTION } = SUBSCRIPTION_PURCHASE_TYPES;

interface ProductSubscriptionContentProps {
    product: Product;
    subscriptionOptions?: SubscriptionOption[];
}

const ProductSubscriptionContent = ({ 
    product,
    subscriptionOptions
}: ProductSubscriptionContentProps) => {
    const validSubscriptionOptions = subscriptionOptions?.filter(option => 
        option.priceId !== undefined && option.price !== undefined
    ) || [];

    const { 
        subscriptionPurchaseType, 
        subscriptionInterval, 
        handlePurchaseTypeChange, 
        handleIntervalChange,
        calculateDiscountInfo
    } = useSubscription({ product, subscriptionOptions: validSubscriptionOptions });
    
    if (validSubscriptionOptions.length === 0) {
        return (
            <div className="mb-6 md:mb-8">
                <p className="text-error text-base leading-7 font-medium">
                    ※有効なサブスクリプションのオプションがないため、只今購入ができません。
                </p>
            </div>
        )
    }

    return (
        <div className="mb-6 md:mb-8">
            <div className="flex gap-[10px] md:gap-5">
                <label className={`subscription-label${subscriptionPurchaseType === SUBSCRIPTION ? ' is-active' : ''}`}>
                    <input
                        type="radio"
                        value={SUBSCRIPTION}
                        checked={subscriptionPurchaseType === SUBSCRIPTION}
                        onChange={() => handlePurchaseTypeChange(SUBSCRIPTION)}
                        className="subscription-input"
                    />
                    <div className="subscription-box">
                        <span className="subscription-title">継続して購入</span>
                        <div className="w-[56px] h-[56px] grid place-items-center">
                            <RefreshCw className="w-[48px] h-[48px]" strokeWidth={1.2} />
                        </div>
                    </div>
                </label>
                
                <label className={`subscription-label${subscriptionPurchaseType === ONE_TIME ? ' is-active' : ''}`}>
                    <input
                        type="radio"
                        value={ONE_TIME}
                        checked={subscriptionPurchaseType === ONE_TIME}
                        onChange={() => handlePurchaseTypeChange(ONE_TIME)}
                        className="subscription-input"
                    />
                    <div className="subscription-box">
                        <span className="subscription-title">1回の購入</span>
                        <Package className="w-[56px] h-[56px]" strokeWidth={1.2} />
                    </div>
                </label>
            </div>

            {subscriptionPurchaseType === SUBSCRIPTION && <>
                {validSubscriptionOptions.length > 0 && (
                    <div className="grid gap-3 md:gap4 mt-4 md:mt-5">
                        {validSubscriptionOptions.map((option: SubscriptionOption, index: number) => {
                            const { discountRate, showDiscount } = calculateDiscountInfo(option);

                            return (
                                <label 
                                    key={index}
                                    className="bg-soft-white rounded-[12px] py-3 px-5 w-full flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            value={option.interval}
                                            checked={subscriptionInterval === option.interval}
                                            onChange={() => handleIntervalChange(option)}
                                            className="subscription-radio"
                                        />
                                        <p className="text-base leading-7 font-medium">
                                            {formatSubscriptionInterval(option.interval)}
                                            <span className="text-sm">
                                                {showDiscount ? ` ( ${discountRate}%OFF )` : ''}
                                            </span>
                                        </p>
                                    </div>
                                    <p 
                                        aria-label={`価格:${formatNumber(option.price)}円（税込）`} 
                                        className="flex items-center gap-[2px] text-base leading-7 font-medium font-poppins"
                                    >
                                        <span className="text-xs" aria-hidden="true">¥</span>
                                        <span aria-hidden="true">{formatNumber(option.price)}</span>
                                    </p>
                                </label>
                            )
                        })}
                    </div>
                )}
            </>}
        </div>
    )
}

export default ProductSubscriptionContent