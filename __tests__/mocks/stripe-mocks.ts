import { Stripe } from "stripe"

export const mockProduct = {
    id: 'test-product-id',
    object: 'product' as const,
    active: true,
    created: 1234567890,
    description: 'test-product',
    images: [],
    livemode: false,
    metadata: {},
    name: 'test-product',
    package_dimensions: null,
    shippable: null,
    statement_descriptor: null,
    tax_code: null,
    type: 'service' as const,
    unit_label: null,
    updated: 1234567890,
    url: null,
    marketing_features: [],
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockPrice = {
    id: 'test-price-id',
    object: 'price' as const,
    active: true,
    billing_scheme: 'per_unit' as const,
    created: 1234567890,
    currency: 'jpy',
    custom_unit_amount: null,
    livemode: false,
    lookup_key: null,
    metadata: {},
    nickname: null,
    product: 'test-product-id',
    recurring: null,
    tax_behavior: null,
    tiers_mode: null,
    transform_quantity: null,
    type: 'one_time' as const,
    unit_amount: 1000,
    unit_amount_decimal: '1000',
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockCustomer = {
    id: 'test-customer-id',
    object: 'customer' as const,
    address: null,
    balance: 0,
    created: 1234567890,
    currency: null,
    default_source: null,
    delinquent: false,
    description: null,
    email: 'test@example.com',
    invoice_settings: {
        custom_fields: null,
        default_payment_method: null,
        footer: null,
        rendering_options: null
    },
    livemode: false,
    metadata: {},
    name: null,
    phone: null,
    preferred_locales: [],
    shipping: null,
    tax_exempt: 'none' as const,
    test_clock: null,
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockSubscription = {
    id: 'sub_test_123',
    object: 'subscription' as const,
    application: null,
    application_fee_percent: null,
    automatic_tax: {
        enabled: false,
        disabled_reason: null,
        liability: null
    },
    billing_cycle_anchor: 1234567890,
    billing_cycle_anchor_config: null,
    billing_mode: 'flexible' as unknown as Stripe.Subscription['billing_mode'],
    billing_thresholds: null,
    cancel_at: null,
    cancel_at_period_end: true,
    canceled_at: null,
    cancellation_details: null,
    collection_method: 'charge_automatically' as const,
    created: 1234567890,
    currency: 'jpy' as const,
    current_period_end: 1234567890,
    current_period_start: 1234567890,
    customer: 'cus_test_123' as const,
    default_payment_method: null,
    default_source: null,
    default_tax_rates: [],
    description: null,
    discount: null,
    days_until_due: null,
    discounts: [],
    invoice_settings: {
        custom_fields: null,
        default_payment_method: null,
        footer: null,
        rendering_options: null,
        account_tax_ids: null,
        issuer: {
            type: 'self' as const,
            bank: null
        }
    },
    trial_start: null,
    ended_at: null,
    items: {
        object: 'list' as const,
        data: [],
        has_more: false,
        total_count: 0,
        url: ''
    },
    latest_invoice: 'inv_test_123',
    livemode: false,
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    },
    metadata: {},
    next_pending_invoice_item_invoice: null,
    on_behalf_of: null,
    pause_collection: null,
    payment_settings: {
        payment_method_options: null,
        payment_method_types: null,
        save_default_payment_method: null
    },
    pending_invoice_item_interval: null,
    pending_setup_intent: null,
    pending_update: null,
    schedule: null,
    start_date: 1234567890,
    status: 'active' as const,
    test_clock: null,
    transfer_data: null,
    trial_end: null,
    trial_settings: null
}

export const mockStripeProductIds = [
    {
        stripe_price_id: 'price_test_123',
        subscription_id: 'sub_test_123',
    },
    {
        stripe_price_id: 'price_test_456',
        subscription_id: 'sub_test_456',
    }
]

export const mockStripeClient = {
    id: 'prod_test_123',
    object: 'product' as const,
    active: true,
    created: 1234567890,
    description: 'Test Product',
    images: ['https://example.com/image.jpg'],
    livemode: false,
    metadata: {
        supabase_id: 'product_test_123',
        subscription_product: 'false'
    },
    name: 'Test Product',
    package_dimensions: null,
    shippable: null,
    statement_descriptor: null,
    tax_code: null,
    type: 'service' as const,
    unit_label: null,
    updated: 1234567890,
    url: null,
    marketing_features: [],
    lastResponse: {
        headers: {},
        requestId: 'req_test_123' as const,
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockLineItems = [
    {
        id: 'li_test_123',
        amount_total: 2000,
        amount_subtotal: 2000,
        amount_tax: 0,
        price: {
            id: 'price_test_123',
            unit_amount: 1000,
            product: 'prod_test_123',
        },
        quantity: 2
    },
    {
        id: 'li_test_456',
        amount_total: 1000,
        amount_subtotal: 1000,
        amount_tax: 0,
        price: {
            id: 'price_test_456',
            unit_amount: 1000,
            product: 'prod_test_456',
        },
        quantity: 1
    }
]

export const mockFullLineItems = [
    {
        id: 'li_test_123',
        object: 'item' as const,
        amount_total: 2000,
        amount_subtotal: 2000,
        amount_tax: 0,
        amount_discount: 0,
        currency: 'jpy',
        description: 'Test Product 1',
        price: {
            id: 'price_test_123',
            object: 'price' as const,
            active: true,
            billing_scheme: 'per_unit' as const,
            created: 1234567890,
            currency: 'jpy',
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: 'prod_test_123',
            recurring: null,
            tax_behavior: null,
            tiers_mode: null,
            transform_quantity: null,
            type: 'one_time' as const,
            unit_amount: 1000,
            unit_amount_decimal: '1000',
            lastResponse: {
                headers: {},
                requestId: 'req_test_123',
                statusCode: 200,
                apiVersion: '2023-10-16',
                idempotencyKey: undefined,
                stripeAccount: undefined
            }
        },
        quantity: 2
    },
    {
        id: 'li_test_456',
        object: 'item' as const,
        amount_total: 1000,
        amount_subtotal: 1000,
        amount_tax: 0,
        amount_discount: 0,
        currency: 'jpy',
        description: 'Test Product 2',
        price: {
            id: 'price_test_456',
            object: 'price' as const,
            active: true,
            billing_scheme: 'per_unit' as const,
            created: 1234567890,
            currency: 'jpy',
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: 'prod_test_456',
            recurring: null,
            tax_behavior: null,
            tiers_mode: null,
            transform_quantity: null,
            type: 'one_time' as const,
            unit_amount: 1000,
            unit_amount_decimal: '1000',
            lastResponse: {
                headers: {},
                requestId: 'req_test_123',
                statusCode: 200,
                apiVersion: '2023-10-16',
                idempotencyKey: undefined,
                stripeAccount: undefined
            }
        },
        quantity: 1
    }
]

export const mockSubscriptionItems = [
    {
        id: 'si_subscription_123',
        object: 'subscription_item' as const,
        billing_thresholds: null,
        created: 1234567890,
        current_period_end: 1234567890,
        current_period_start: 1234567890,
        metadata: {},
        price: {
            id: 'price_subscription_123',
            object: 'price' as const,
            active: true,
            billing_scheme: 'per_unit' as const,
            created: 1234567890,
            currency: 'jpy',
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: 'prod_subscription_123',
            recurring: {
                interval: 'month' as const,
                interval_count: 1,
                meter: null,
                trial_period_days: null,
                usage_type: 'licensed' as const
            },
            tax_behavior: null,
            tiers_mode: null,
            transform_quantity: null,
            type: 'recurring' as const,
            unit_amount: 2000,
            unit_amount_decimal: '2000',
            lastResponse: {
                headers: {},
                requestId: 'req_test_123',
                statusCode: 200,
                apiVersion: '2023-10-16',
                idempotencyKey: undefined,
                stripeAccount: undefined
            }
        },
        quantity: 1,
        subscription: 'sub_test_123',
        tax_rates: [],
        discounts: [],
        plan: {
            id: 'plan_subscription_123',
            object: 'plan' as const,
            active: true,
            aggregate_usage: null,
            amount: 2000,
            amount_decimal: '2000',
            billing_scheme: 'per_unit' as const,
            created: 1234567890,
            currency: 'jpy',
            interval: 'month' as const,
            interval_count: 1,
            livemode: false,
            metadata: {},
            nickname: null,
            product: 'prod_subscription_123',
            tiers_mode: null,
            transform_usage: null,
            trial_period_days: null,
            usage_type: 'licensed' as const,
            // meter プロパティを追加
            meter: null,
            lastResponse: {
                headers: {},
                requestId: 'req_test_123',
                statusCode: 200,
                apiVersion: '2023-10-16',
                idempotencyKey: undefined,
                stripeAccount: undefined
            }
        },
        lastResponse: {
            headers: {},
            requestId: 'req_test_123',
            statusCode: 200,
            apiVersion: '2023-10-16',
            idempotencyKey: undefined,
            stripeAccount: undefined
        }
    }
]

export const mockSubscriptionLineItems = {
    line_items: {
        object: 'list' as const,
        data: [
            {
                id: 'li_subscription_123',
                object: 'item' as const,
                amount_discount: 0,
                currency: 'jpy',
                description: 'Subscription Product',
                amount_total: 2000,
                amount_subtotal: 2000,
                amount_tax: 0,
                price: {
                    id: 'price_subscription_123',
                    object: 'price' as const,
                    active: true,
                    billing_scheme: 'per_unit' as const,
                    created: 1234567890,
                    currency: 'jpy',
                    custom_unit_amount: null,
                    livemode: false,
                    lookup_key: null,
                    metadata: {},
                    nickname: null,
                    product: 'prod_subscription_123',
                    recurring: {
                        interval: 'month' as const,
                        interval_count: 1,
                        meter: null,
                        trial_period_days: null,
                        usage_type: 'licensed' as const
                    },
                    tax_behavior: null,
                    tiers_mode: null,
                    transform_quantity: null,
                    type: 'recurring' as const,
                    unit_amount: 2000,
                    unit_amount_decimal: '2000'
                },
                quantity: 1
            }
        ],
        has_more: false,
        url: '/v1/checkout/sessions/test-session-id/line_items'
    }
}

export const mockPaymentLink = {
    id: 'plink_test_123',
    object: 'payment_link' as const,
    active: false,
    after_completion: {
        type: 'redirect' as const,
        redirect: {
            url: 'https://example.com/success'
        }
    },
    allow_promotion_codes: false,
    application: null,
    application_fee_amount: null,
    application_fee_percent: null,
    automatic_tax: {
        enabled: false,
        liability: {
            type: 'account' as const,
            country: 'JP'
        }
    },
    billing_address_collection: 'auto' as const,
    consent_collection: null,
    currency: 'jpy',
    custom_fields: [],
    custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null
    },
    customer_creation: 'if_required' as const,
    inactive_message: null,
    invoice_creation: {
        enabled: false,
        invoice_data: {
            account_tax_ids: null,
            custom_fields: null,
            description: null,
            footer: null,
            metadata: {},
            rendering_options: null,
            issuer: {
                type: 'self' as const,
                bank: null
            }
        }
    },
    livemode: false,
    metadata: {},
    on_behalf_of: null,
    payment_intent_data: null,
    payment_method_collection: 'always' as const,
    payment_method_types: [],
    phone_number_collection: {
        enabled: false
    },
    restrictions: null,
    shipping_address_collection: null,
    shipping_options: [],
    submit_type: 'auto' as const,
    subscription_data: null,
    tax_id_collection: {
        enabled: false,
        required: 'never' as const
    },
    transfer_data: null,
    url: 'https://checkout.stripe.com/pay/cs_test_123',
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockCheckoutSession = {
    id: 'cs_test_123',
    object: 'checkout.session' as const,
    payment_link: 'plink_test_123',
    adaptive_pricing: null,
    after_expiration: null,
    allow_promotion_codes: null,
    amount_subtotal: null,
    amount_total: null,
    automatic_tax: {
        enabled: false,
        status: null,
        liability: {
            type: 'account' as const,
            country: 'JP'
        },
        provider: 'stripe' as const
    },
    billing_address_collection: null,
    cancel_url: null,
    client_reference_id: null,
    client_secret: null,
    collected_information: null,
    consent: null,
    consent_collection: null,
    created: 1234567890,
    currency: null,
    currency_conversion: null,
    custom_fields: [],
    custom_text: {
        after_submit: null,
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null
    },
    customer: null,
    customer_creation: null,
    customer_details: null,
    customer_email: null,
    customer_update: null,
    discounts: [],
    expires_at: 1234567890,
    invoice: null,
    invoice_creation: null,
    line_items: undefined,
    livemode: false,
    locale: null,
    metadata: {},
    mode: 'payment' as const,
    payment_intent: null,
    payment_method_collection: null,
    payment_method_configuration_details: null,
    payment_method_options: null,
    payment_method_types: [],
    payment_status: 'paid' as const,
    permissions: null,
    phone_number_collection: undefined,
    recovered_from: null,
    saved_payment_method_options: null,
    setup_intent: null,
    shipping: null,
    shipping_address_collection: null,
    shipping_cost: null,
    shipping_options: [],
    status: null,
    submit_type: null,
    subscription: 'sub_test_123',
    success_url: null,
    total_details: null,
    ui_mode: null,
    url: null,
    wallet_options: null,
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockInvoice = {
    id: 'in_test_123',
    object: 'invoice' as const,
    account_country: 'JP',
    account_name: 'Test Account',
    account_tax_ids: null,
    amount_due: 1000,
    amount_paid: 1000,
    amount_remaining: 0,
    amount_overpaid: 0,
    amount_shipping: 0,
    application: null,
    application_fee_amount: null,
    application_fee_percent: null,
    attempt_count: 1,
    attempted: true,
    auto_advance: false,
    automatically_finalizes_at: 1234567890,
    automatic_tax: {
        enabled: false,
        status: null,
        disabled_reason: null,
        liability: null,
        provider: 'stripe' as const
    },
    billing_reason: 'subscription_cycle' as const,
    charge: null,
    collection_method: 'charge_automatically' as const,
    created: 1234567890,
    currency: 'jpy',
    custom_fields: null,
    customer: 'cus_test_123',
    customer_address: null,
    customer_email: 'test@example.com',
    customer_name: null,
    customer_phone: null,
    customer_shipping: null,
    customer_tax_exempt: null,
    default_payment_method: null,
    default_source: null,
    default_tax_rates: [],
    description: null,
    discount: null,
    discounts: [],
    due_date: null,
    effective_at: 1234567890,
    ending_balance: null,
    footer: null,
    from_invoice: null,
    hosted_invoice_url: null,
    invoice_pdf: null,
    issuer: {
        type: 'self' as const,
        bank: null
    },
    last_finalization_invoice: null,
    last_finalization_error: null,
    last_payment_intent: null,
    latest_revision: null,
    lines: {
        object: 'list' as const,
        data: [],
        has_more: false,
        total_count: 0,
        url: ''
    },
    livemode: false,
    metadata: {},
    next_payment_attempt: null,
    number: 'INV-123',
    on_behalf_of: null,
    paid: true,
    paid_out_of_band: false,
    payment_intent: null,
    payment_settings: {
        payment_method_options: null,
        payment_method_types: null,
        save_default_payment_method: null,
        default_mandate: null  // 追加
    },
    period_end: 1234567890,
    period_start: 1234567890,
    post_payment_credit_notes_amount: 0,
    pre_payment_credit_notes_amount: 0,
    quote: null,
    receipt_number: null,
    rendering: null,
    rendering_options: null,
    shipping: null,
    shipping_cost: null,
    shipping_details: null,
    starting_balance: 0,
    statement_descriptor: null,
    status: 'paid' as const,
    status_transitions: {
        finalized_at: 1234567890,
        marked_uncollectible_at: null,
        paid_at: 1234567890,
        voided_at: null
    },
    subscription: 'sub_test_123',
    subtotal: 1000,
    subtotal_excluding_tax: 1000,
    tax: null,
    test_clock: null,
    total: 1000,
    total_discount_amounts: [],
    total_excluding_tax: 1000,
    total_pretax_credit_amounts: [],
    total_tax_amounts: [],
    total_taxes: [],
    transfer_data: null,
    webhooks_delivered_at: 1234567890,
    parent: {
        subscription_details: {
            metadata: {
                subscription_shipping_fee: '1000'
            },
            subscription: mockSubscription
        },
        quote_details: null,
        type: 'subscription' as Stripe.Invoice.Parent.Type 
    },
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockPaymentIntent = {
    id: 'pi_test_123',
    object: 'payment_intent' as const,
    amount: 1000,
    amount_capturable: 0,
    amount_details: {
        tip: {}
    },
    amount_received: 1000,
    application: null,
    application_fee_amount: null,
    automatic_payment_methods: null,
    canceled_at: null,
    cancellation_reason: null,
    capture_method: 'automatic' as const,
    charges: {
        object: 'list' as const,
        data: [],
        has_more: false,
        total_count: 0,
        url: ''
    },
    client_secret: 'pi_test_123_secret_test',
    confirmation_method: 'automatic' as const,
    created: 1234567890,
    currency: 'jpy',
    customer: null,
    description: null,
    invoice: null,
    last_payment_intent: null,
    latest_charge: null,
    livemode: false,
    metadata: {},
    next_action: null,
    on_behalf_of: null,
    payment_method: {
        id: 'pm_test_123',
        object: 'payment_method' as const,
        type: 'card' as const,
        billing_details: {
            address: null,
            email: null,
            name: null,
            phone: null,
            tax_id: null
        },
        created: 1234567890,
        customer: null,
        livemode: false,
        metadata: {},
        card: {
            brand: 'visa' as const,
            country: 'JP' as const,
            exp_month: 12,
            exp_year: 2025,
            last4: '1234',
            networks: {
                preferred: 'visa' as const,
                available: ['visa']
            },
            regulated_status: 'regulated' as const,
            checks: {
                address_line1_check: 'pass' as const,
                cvc_check: 'pass' as const,
                address_postal_code_check: 'unchecked' as const,
            },
            display_brand: 'Visa' as const,
            funding: 'credit' as const,
            generated_from: null,
            three_d_secure_usage: {
                supported: true,
            },
            wallet: null,
        }
    },
    payment_method_options: null,
    payment_method_types: ['card'],
    processing: null,
    receipt_email: null,
    review: null,
    setup_future_usage: null,
    shipping: null,
    source: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    status: 'succeeded' as const,
    transfer_data: null,
    transfer_group: null,
    last_payment_error: null,
    payment_method_configuration_details: null,
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockShippingRate = {
    id: 'shr_regular_test_123',
    object: 'shipping_rate' as const,
    active: true,
    created: 1234567890,
    delivery_estimate: null,
    display_name: 'Standard Shipping',
    fixed_amount: {
        currency: 'jpy' as const,
        amount: 500
    },
    livemode: false,
    metadata: {},
    tax_behavior: null,
    tax_code: null,
    type: 'fixed_amount' as const,
    lastResponse: {
        headers: {},
        requestId: 'req_test_123',
        statusCode: 200,
        apiVersion: '2023-10-16',
        idempotencyKey: undefined,
        stripeAccount: undefined
    }
}

export const mockCustomerDetails = {
    name: 'Test User',
    address: {
        line1: 'Test Address Line 1',
        line2: 'Test Address Line 2',
        city: 'Tokyo',
        state: 'Tokyo',
        postal_code: '123-4567',
        country: 'JP'
    },
    email: 'test@example.com',
    phone: '09012345678',
    tax_exempt: 'none' as const,
    tax_ids: []
}

export const mockOrderDataWithCustomerDetails = {
    ...mockCheckoutSession,
    customer_details: mockCustomerDetails,
    amount_subtotal: 2000,
    amount_total: 2500,
    total_details: {
        amount_shipping: 500,
        amount_discount: 0,
        amount_tax: 0
    },
    payment_method_types: ['card'],
    payment_status: 'paid' as const,
    mode: 'payment' as const
}