import HeaderContent from "@/components/ui/navigation/HeaderContent"
import CartCountProvider from "@/components/layout/CartCountProvider"
import { auth } from "@/lib/auth"
import { getProductPriceBoundsData } from "@/lib/database/prisma/actions/products"
import { getCartCountData } from "@/lib/database/prisma/actions/cartItems"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

const Header = async () => {
    // 価格データの取得
    const { data } = await getProductPriceBoundsData();

    if (!data) throw new Error(PRODUCT_ERROR.PRICE_FETCH_FAILED);

    // カートの数量の取得
    let cartItemsCount = 0;

    const session = await auth();
    const userId = session?.user?.id as UserId;

    if (userId) {
        cartItemsCount = await getCartCountData({ 
            userId: userId as UserId 
        });
    }

    return <>
        <HeaderContent 
            priceBounds={data as ProductPriceBounds}
        />
        <CartCountProvider cartCount={cartItemsCount} />
    </>
}

export default Header