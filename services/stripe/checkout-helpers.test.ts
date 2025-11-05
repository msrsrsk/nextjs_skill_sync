import { describe, it, expect, vi, beforeEach } from "vitest"

import { validateCartItem, processCartItem, validatePriceCalculation } from "@/services/stripe/checkout-helpers"
import { mockCartItems, createCombinedCartItems } from "@/__tests__/mocks/domain-mocks"
import { mockPrice } from "@/__tests__/mocks/stripe-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

const { NO_PRODUCT_DATA, NO_PRICE_ID, PRICE_VERIFICATION_FAILED, NO_PRICE_AMOUNT } = CHECKOUT_ERROR;

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        prices: { retrieve: vi.fn() }
    }
}))

vi.mock('@/services/product/calculation', () => ({
    getProductEffectivePrice: vi.fn()
}))

const getMockStripe = async () => {
    const { stripe } = await import('@/lib/clients/stripe/client')
    return vi.mocked(stripe)
}

const getMockGetProductEffectivePrice = async () => {
    const { getProductEffectivePrice } = await import('@/services/product/calculation')
    return vi.mocked(getProductEffectivePrice)
}

/* ==================================== 
    Validate Cart Item Test
==================================== */
describe('validateCartItem', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 認証成功(sale_price_id が存在する場合)
    it('should return success when product has sale_price_id', () => {
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = 'price_sale_123';
            cartItem.product.product_stripes.regular_price_id = 'price_regular_123';
        }

        const result = validateCartItem(cartItem);

        expect(result.success).toBe(true);
        expect(result.error).toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data?.product).toBe(cartItem.product);
        expect(result.data?.priceId).toBe('price_sale_123');
    })

    // 認証成功(regular_price_id のみ存在する場合)
    it('should return success when product has regular_price_id', () => {
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = null as unknown as string;
            cartItem.product.product_stripes.regular_price_id = 'price_regular_123';
        }

        const result = validateCartItem(cartItem);

        expect(result.success).toBe(true);
        expect(result.error).toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data?.product).toBe(cartItem.product);
        expect(result.data?.priceId).toBe('price_regular_123');
    })

    // 認証失敗(product が null)
    it('should return error when product is null', () => {
        const cartItem = {
            ...mockCartItems[0],
            product: null as unknown as ProductWithRelations
        }

        const result = validateCartItem(cartItem);

        expect(result.success).toBe(false);
        expect(result.error).toBe(NO_PRODUCT_DATA);
        expect(result.data).toBeNull();
    })

    // 認証失敗(product_stripes が null)
    it('should return error when product_stripes is null', () => {
        const cartItem = {
            ...mockCartItems[0],
            product: {
                ...mockCartItems[0].product,
                product_stripes: null as unknown as ProductStripe
            }
        }

        const result = validateCartItem(cartItem);

        expect(result.success).toBe(false);
        expect(result.error).toBe(NO_PRICE_ID);
        expect(result.data).toBeNull();
    })

    // 認証失敗(sale_price_id と regular_price_id が null)
    it('should return error when both sale_price_id and regular_price_id are null', () => {
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = null as unknown as string;
            cartItem.product.product_stripes.regular_price_id = null as unknown as string;
        }

        const result = validateCartItem(cartItem);

        expect(result.success).toBe(false);
        expect(result.error).toBe(NO_PRICE_ID);
        expect(result.data).toBeNull();
    })
})

/* ==================================== 
    Process Cart Item Test
==================================== */
describe('processCartItem', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 処理成功
    it('should process cart item successfully', async () => {
        const stripe = await getMockStripe()
        const mockGetProductEffectivePrice = await getMockGetProductEffectivePrice()
        
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        const product = cartItem.product;
        const priceId = 'price_test_123';

        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })

        mockGetProductEffectivePrice.mockReturnValue(800)

        const result = await processCartItem({
            cartItem,
            product,
            priceId
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.data?.lineItem).toEqual({
            price: priceId,
            quantity: cartItem.quantity
        })
        expect(result.data?.serverTotal).toBe(1000 * cartItem.quantity)
        expect(result.data?.dbTotal).toBe(800 * cartItem.quantity)
    })

    // 処理失敗(Stripe API の呼び出し失敗)
    it('should return error when Stripe price retrieve fails', async () => {
        const stripe = await getMockStripe()
        
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        const product = cartItem.product;
        const priceId = 'price_test_123';

        vi.mocked(stripe.prices.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await processCartItem({
            cartItem,
            product,
            priceId
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PRICE_VERIFICATION_FAILED)
        expect(result.data).toBeNull()
    })

    // 処理失敗(price.unit_amount が null)
    it('should return error when price.unit_amount is null', async () => {
        const stripe = await getMockStripe()
        
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        const product = cartItem.product;
        const priceId = 'price_test_123';

        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: null
        })

        const result = await processCartItem({
            cartItem,
            product,
            priceId
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRICE_AMOUNT)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Calculate Checkout Totals Test
==================================== */
describe('calculateCheckoutTotals', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 処理成功(1つのカートアイテムの場合)
    it('should calculate checkout totals successfully for single cart item', async () => {
        const stripe = await getMockStripe()
        const mockGetProductEffectivePrice = await getMockGetProductEffectivePrice()
        
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = 'price_sale_123';
        }

        const priceId = cartItem.product.product_stripes?.sale_price_id;

        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })

        mockGetProductEffectivePrice.mockReturnValue(800)

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [cartItem]
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.data?.lineItems).toHaveLength(1)
        expect(result.data?.lineItems[0]).toEqual({
            price: priceId,
            quantity: cartItem.quantity
        })
        expect(result.data?.serverCalculatedTotal).toBe(1000 * cartItem.quantity)
        expect(result.data?.dbBasedTotal).toBe(800 * cartItem.quantity)
    })

    // 処理成功(複数のカートアイテムの場合)
    it('should calculate checkout totals successfully for multiple cart items', async () => {
        const stripe = await getMockStripe()
        const mockGetProductEffectivePrice = await getMockGetProductEffectivePrice()
        
        const cartItems = createCombinedCartItems();
        
        const secondCartItem: CartItemWithProduct = {
            ...cartItems[0],
            id: 'cart_item_2',
            product_id: 'product_test_456',
            product: {
                ...cartItems[0].product,
                id: 'product_test_456',
                price: 2000,
                product_stripes: {
                    ...cartItems[0].product.product_stripes!,
                    sale_price_id: 'price_sale_456',
                    regular_price_id: 'price_regular_456'
                }
            },
            quantity: 3
        }

        if (cartItems[0].product.product_stripes) {
            cartItems[0].product.product_stripes.sale_price_id = 'price_sale_123';
        }

        const priceId1 = cartItems[0].product.product_stripes?.sale_price_id;
        const priceId2 = secondCartItem.product.product_stripes?.sale_price_id as string;

        vi.mocked(stripe.prices.retrieve)
            .mockResolvedValueOnce({
                ...mockPrice,
                id: priceId1,
                unit_amount: 1000
            })
            .mockResolvedValueOnce({
                ...mockPrice,
                id: priceId2,
                unit_amount: 2000
            })

        mockGetProductEffectivePrice
            .mockReturnValueOnce(800)
            .mockReturnValueOnce(1500)

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [cartItems[0], secondCartItem]
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.data?.lineItems).toHaveLength(2)
        expect(result.data?.lineItems[0]).toEqual({
            price: priceId1,
            quantity: cartItems[0].quantity
        })
        expect(result.data?.lineItems[1]).toEqual({
            price: priceId2,
            quantity: secondCartItem.quantity
        })
        // serverCalculatedTotal = (1000 * 2) + (2000 * 3) = 2000 + 6000 = 8000
        expect(result.data?.serverCalculatedTotal).toBe(8000)
        // dbBasedTotal = (800 * 2) + (1500 * 3) = 1600 + 4500 = 6100
        expect(result.data?.dbBasedTotal).toBe(6100)
    })

    // 処理失敗(商品データが null)
    it('should return error when product data is null', async () => {
        const cartItem: CartItemWithProduct = {
            ...createCombinedCartItems()[0],
            product: null as unknown as ProductWithRelations
        }

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [cartItem]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRODUCT_DATA)
        expect(result.data).toBeNull()
    })

    // 処理失敗(priceId が null)
    it('should return error when priceId is null', async () => {
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = null as unknown as string;
            cartItem.product.product_stripes.regular_price_id = null as unknown as string;
        }

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [cartItem]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRICE_ID)
        expect(result.data).toBeNull()
    })

    // 処理失敗(Stripe API の呼び出し失敗)
    it('should return error when Stripe price retrieve fails', async () => {
        const stripe = await getMockStripe()
        
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = 'price_sale_123';
        }

        vi.mocked(stripe.prices.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [cartItem]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PRICE_VERIFICATION_FAILED)
        expect(result.data).toBeNull()
    })

    // 処理失敗(price.unit_amount が null)
    it('should return error when price.unit_amount is null', async () => {
        const stripe = await getMockStripe()
        const mockGetProductEffectivePrice = await getMockGetProductEffectivePrice()
        
        const cartItems = createCombinedCartItems();
        const cartItem = cartItems[0];
        
        if (cartItem.product.product_stripes) {
            cartItem.product.product_stripes.sale_price_id = 'price_sale_123';
        }

        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: null
        })

        mockGetProductEffectivePrice.mockReturnValue(800)

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [cartItem]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRICE_AMOUNT)
        expect(result.data).toBeNull()
    })

    // 処理失敗(複数のカートアイテムのうち1つが失敗)
    it('should return error when one of multiple cart items fails', async () => {
        const stripe = await getMockStripe()
        const mockGetProductEffectivePrice = await getMockGetProductEffectivePrice()
        
        const cartItems = createCombinedCartItems();
        const validCartItem = cartItems[0];
        
        if (validCartItem.product.product_stripes) {
            validCartItem.product.product_stripes.sale_price_id = 'price_sale_123';
        }

        const invalidCartItem: CartItemWithProduct = {
            ...validCartItem,
            id: 'cart_item_2',
            product: null as unknown as ProductWithRelations
        }

        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })

        mockGetProductEffectivePrice.mockReturnValue(800)

        const { calculateCheckoutTotals } = await import('@/services/stripe/checkout-helpers')
        const result = await calculateCheckoutTotals({
            cartItems: [validCartItem, invalidCartItem]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRODUCT_DATA)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Validate Price Calculation Test
==================================== */
describe('validatePriceCalculation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 認証成功(すべての金額が一致)
    it('should return true when all amounts match', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: 2000,
            dbBasedTotal: 2000
        })

        expect(result).toBe(true)
    })

    // 認証成功(すべての金額が0)
    it('should return true when all amounts are 0', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 0,
            serverCalculatedTotal: 0,
            dbBasedTotal: 0
        })

        expect(result).toBe(true)
    })

    // 認証失敗(clientCalculatedTotal が undefined)
    it('should return false when clientCalculatedTotal is undefined', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: undefined as unknown as number,
            serverCalculatedTotal: 2000,
            dbBasedTotal: 3000
        })

        expect(result).toBe(false);
    })

    // 認証失敗(serverCalculatedTotal が undefined)
    it('should return false when serverCalculatedTotal is undefined', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: undefined as unknown as number,
            dbBasedTotal: 3000
        })

        expect(result).toBe(false);
    })

    // 認証失敗(dbBasedTotal が undefined)
    it('should return false when dbBasedTotal is undefined', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: 3000,
            dbBasedTotal: undefined as unknown as number
        })

        expect(result).toBe(false);
    })

    // 認証失敗(clientCalculatedTotal と serverCalculatedTotal が不一致)
    it('should return false when clientCalculatedTotal differs from serverCalculatedTotal', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: 3000,
            dbBasedTotal: 4000
        })

        expect(result).toBe(false);
    })

    // 認証失敗(clientCalculatedTotal と dbBasedTotal が不一致)
    it('should return false when clientCalculatedTotal differs from dbBasedTotal', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: 2000,
            dbBasedTotal: 3000
        })

        expect(result).toBe(false)
    })

    // 認証失敗(clientCalculatedTotal と serverCalculatedTotal と dbBasedTotal が不一致)
    it('should return false when clientCalculatedTotal differs from both serverCalculatedTotal and dbBasedTotal', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: 3000,
            dbBasedTotal: 4000
        })

        expect(result).toBe(false)
    })

    // 認証失敗(わずかな差の場合)
    it('should return false for even small differences', () => {
        const result = validatePriceCalculation({
            clientCalculatedTotal: 2000,
            serverCalculatedTotal: 2001,
            dbBasedTotal: 2000
        })

        expect(result).toBe(false)
    })
})