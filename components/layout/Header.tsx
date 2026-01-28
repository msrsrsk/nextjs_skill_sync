import HeaderContent from "@/components/ui/navigation/HeaderContent"
import CartCountProvider from "@/components/layout/CartCountProvider"
import { auth } from "@/lib/auth/middleware"
import { getCartItemRepository } from "@/repository/cartItem"
import { getProductRepository } from "@/repository/product"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

const Header = async () => {
    // 価格データの取得
    const productRepository = getProductRepository();
    const { data } = await productRepository.getProductPriceBounds();

    if (!data) throw new Error(PRODUCT_ERROR.PRICE_FETCH_FAILED);

    // カートの数量の取得
    let cartItemsCount = 0;

    const session = await auth();
    const userId = session?.user?.id as UserId;

    if (userId) {
        const cartItemRepository = getCartItemRepository();
        cartItemsCount = await cartItemRepository.getCartCount({ 
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