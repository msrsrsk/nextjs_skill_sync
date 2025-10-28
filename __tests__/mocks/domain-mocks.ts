import { 
    mockStripeProductIds
} from "@/__tests__/mocks/stripe-mocks"

export const mockUser = {
    email: 'test@example.com',
    user_stripes: {
        customer_id: 'cus_test_123',
        id: 'stripe_test_123',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user_test_123'
    }
}

export const mockCartItems: CartItemWithProduct[] = [
    {
        id: 'cart_item_1',
        user_id: 'user_test_123',
        product_id: 'product_test_123',
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
        product: {
            id: 'product_test_123',
            title: 'Test Product',
            description: 'Test Description',
            image_urls: null,
            price: 1000,
            category: 'Active',
            skill_type: 'test_skill',
            slug: 'test-product',
            stock: 10,
            created_at: new Date(),
            updated_at: new Date(),
            product_stripes: null,
            product_pricings: null,
            product_sales: null
        }
    }
]

export const mockCartItemStripes = [
    {
        id: 'stripe_product_123',
        product_id: 'product_test_123',
        stripe_product_id: 'prod_test_123',
        sale_price_id: 'price_sale_123',
        regular_price_id: 'price_regular_123',
        subscription_price_ids: null,
        created_at: new Date(),
        updated_at: new Date()
    }
]

export const createCombinedCartItems = () => {
    return mockCartItems.map((domain, index) => ({
        ...domain,
        product: {
            ...domain.product,
            product_stripes: mockCartItemStripes[index]
        }
    }))
}

export const mockOrder = {
    order: {
        id: 'order_test_123',
        payment_method: 'card',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 'user_test_123',
        order_number: 12345,
        status: 'pending' as const,
        total_amount: 2000,
        currency: 'jpy'
    },
    orderShipping: {
        id: 'shipping_test_123',
        order_id: 'order_test_123',
        delivery_name: 'Test User',
        address: {
            line1: 'Test Address',
            line2: 'Test City',
            postal_code: '123-4567',
            country: 'JP'
        },
        shipping_fee: 500,
        created_at: new Date(),
        updated_at: new Date()
    }
}

export const mockOrderData = {
    order: {
        id: 'order_test_123',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        user_id: 'user_test_123',
        order_number: 12345,
        status: 'completed' as OrderStatusType,
        total_amount: 2500,
        currency: 'jpy',
        payment_method: 'card',
    },
    orderShipping: {
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        delivery_name: 'Test User',
        address: {
            name: 'Test User',
            postal_code: '123-4567',
            state: 'Tokyo',
            city: 'Shibuya',
            address_line1: '1-1-1',
            address_line2: 'Test Building'
        },
        shipping_fee: 500,
        order_id: 'order_test_123'
    }
}

export const mockProductDetails = [
    {
        title: 'Test Product 1',
        subscription_product: false,
        product_id: 'product_test_123',
        image: 'https://example.com/image1.jpg',
        unit_price: 1000,
        amount: 2000,
        quantity: 2,
        subscription_status: null,
        subscription_interval: null
    },
    {
        title: 'Test Product 2',
        subscription_product: true,
        product_id: 'product_test_456',
        image: 'https://example.com/image2.jpg',
        unit_price: 500,
        amount: 500,
        quantity: 1,
        subscription_status: null,
        subscription_interval: null
    }
]

export const mockSubscriptionProductDetails = [
    {
        title: 'Test Product 1',
        subscription_product: true,
        product_id: 'product_test_123',
        image: 'https://example.com/image1.jpg',
        unit_price: 1000,
        amount: 2000,
        quantity: 1,
        subscription_status: 'active' as const,
        subscription_interval: '1month' as const,
        stripe_price_id: 'price_test_123',
        subscription_id: 'sub_test_123'
    }
]

export const createCombinedProductDetails = () => {
    return mockProductDetails.map((domain, index) => ({
        ...domain,
        ...mockStripeProductIds[index]
    }))
}

export const mockOrderItems = [
    {
        id: 'order_item_test_123',
        order_id: 'order_test_123',
        product_id: 'product_test_123',
        quantity: 1,
        unit_price: 1000,
        total_price: 1000,
        created_at: new Date(),
        updated_at: new Date()
    }
]

export const mockOrderItemStripes = [
    {
        id: 'order_item_stripe_test_123',
        order_item_id: 'order_item_test_123',
        price_id: 'price_test_123',
        quantity: 1,
        unit_price: 1000,
        total_price: 1000,
        created_at: new Date(),
        updated_at: new Date()
    }
]

export const mockShippingAddress = {
    name: 'test_name',
    id: 'address_test_123',
    created_at: new Date(),
    updated_at: new Date(),
    user_id: 'user_test_123',
    postal_code: '1234567890',
    state: 'test_state',
    city: 'test_city',
    address_line1: 'test_address_line1',
    address_line2: 'test_address_line2',
    is_default: true
}

export const mockOrderItemSubscriptions = {
    id: 'order_item_subscription_123',
    order_item_id: 'order_item_123',
    subscription_id: 'subscription_123',
    status: 'active' as const,
    interval: 'month',
    next_payment_date: null,
    remarks: 'test remarks',
    created_at: new Date(),
    updated_at: new Date()
}

export const mockSubscriptionPayment = {
    subscription_id: 'sub_test_123', 
    id: 'sub_payment_123', 
    user_id: 'user_test_123', 
    created_at: new Date(), 
    updated_at: new Date(), 
    payment_date: new Date() 
}

export const mockStripeProduct = {
    title: 'Test Product',
    productId: 'product_test_123',
    price: 1000,
    salePrice: null,
    subscriptionPriceIds: null
}

export const mockReview = {
    id: 'test-review-id',
    user_id: 'test-user-id',
    product_id: 'test-product-id',
    rating: 5,
    comment: 'test-comment',
    image_urls: ['test-image-url'],
    created_at: new Date()
}

export const mockProduct = {
    id: 'product_123',
    slug: 'test-product',
    title: 'Test Product',
    description: 'Test Description',
    image_urls: ['https://example.com/image.jpg'],
    price: 1000,
    category: 'Active',
    skill_type: 'test_skill',
    stock: 10,
    created_at: new Date(),
    updated_at: new Date(),
    product_pricings: null,
    product_sales: null,
    product_details: null,
    product_stripes: null,
    reviews: [
        { rating: 5, comment: 'Great!' },
        { rating: 4, comment: 'Good!' }
    ]
}

export const mockPaginatedProducts = {
    page: 1,
    limit: 10,
    query: 'test-query',
    category: 'test-category' as CategoryType,
    isTrend: false,
    filters: {
        priceRange: [100, 1000] as [number, number],
        isStock: false
    },
    sortType: 'created_desc' as CollectionSortType
}

export const mockOrderStripe = {
    order_id: 'order_123',
    session_id: 'session_123',
    payment_intent_id: 'payment_intent_123'
}