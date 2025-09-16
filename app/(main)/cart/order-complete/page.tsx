"use client"

import { useEffect } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import LottieAnimation from "@/components/ui/display/LottieAnimation"
import congrats from"@/data/congrats.json"
import useCart from "@/hooks/cart/useCart"
import { useCartStore } from "@/app/stores/useStore"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { HOME_PATH } = SITE_MAP;

const OrderCompletePage = () => {
    const { clearCart } = useCart();
    const { setCartCount } = useCartStore();

    useEffect(() => {
        clearCart();
        setCartCount(0);
    }, []);

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <div className="mt-6 mb-8 md:my-10 relative flex justify-center">
                <PageTitle 
                    title="Thank You!" 
                />
                <LottieAnimation 
                    data={congrats} 
                    customClass="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                />
            </div>

            <div className="max-w-xl mx-auto">
                <p className="attention-text text-center">
                    ご注文ありがとうございます。<br />
                    ご登録のメールアドレス宛にご注文の<br className="md:hidden" />
                    確認メールをお送りいたしました。<br />
                    ご注文内容はアカウントページにある<br className="md:hidden" />
                    「注文履歴」でもご確認いただけます。
                </p>
                <LinkButtonPrimary
                    link={HOME_PATH}
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                    customClass="button-space-default relative z-10"
                >
                    トップページへ
                    <MoreIcon />
                </LinkButtonPrimary>
            </div>
        </div>
    </>
}

export default OrderCompletePage