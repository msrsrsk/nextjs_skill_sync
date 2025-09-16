"use client"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import CartWithItems from "@/components/ui/order/CartWithItems"
import SkillTrailSection from "@/components/sections/SkillTrailSection"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useCartData from "@/hooks/cart/useCartData"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { CATEGORY_PATH } = SITE_MAP;

const CartPage = () => {
    return <>
        <Breadcrumb />

        <PageTitle 
            title="Cart" 
            customClass="mt-6 mb-[6px] md:mt-10 md:mb-2" 
        />
        <CartPageWrapper />
    </>
}

const CartPageWrapper = () => {
    const { 
        cartItems,
        setCartItems,
        loading: cartLoading,
        error: cartError,
    } = useCartData();

    if (cartError) {
        return (
            <div className="c-container-page-no-padding mt-10 md:mt-[56px] mb-10 md:mb-20">
                <ErrorMessage message={cartError} />
            </div>
        )
    }

    if (cartLoading) {
        return (
            <div className="c-container-page-no-padding mb-10 md:mb-20">
                <LoadingSpinner />
            </div>
        )
    }

    return <>
        {cartItems.length > 0 ? (
            <div className="c-container-page-no-padding mb-10 md:mb-20">
                <CartWithItems 
                    cartItems={cartItems} 
                    setCartItems={setCartItems}
                />
            </div>
        ) : <>
            <div className="c-container-page-no-padding">
                <div>
                    <p className="attention-text text-center mt-8 md:mt-10">
                        まだカートにスキルが入っていません。<br />
                        あなたに合うスキルを探しにいきましょう！
                    </p>
                    <LinkButtonPrimary
                        link={CATEGORY_PATH}
                        size={BUTTON_LARGE}
                        text={BUTTON_JA}
                        customClass="button-space-default"
                    >
                        商品一覧へ
                        <MoreIcon />
                    </LinkButtonPrimary>
                </div>

                <hr className="separate-border mt-10 md:mt-20" />
            </div>

            <SkillTrailSection />
        </>}
    </>
}

export default CartPage