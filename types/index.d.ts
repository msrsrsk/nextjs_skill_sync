import { Prisma } from "@prisma/client"
import { Stripe } from "stripe"
import type { 
    User as PrismaUser, 
    UserProfile as PrismaUserProfile,
    UserImage as PrismaUserImage,
    UserStripe as PrismaUserStripe,
    Product as PrismaProduct, 
    ProductPricing as PrismaProductPricing,
    ProductSales as PrismaProductSales,
    ProductDetail as PrismaProductDetail,
    ProductRelation as PrismaProductRelation,
    ProductStripe as PrismaProductStripe,
    CartItem as PrismaCartItem,
    Notification as PrismaNotification,
    Review as PrismaReview, 
    ChatRoom as PrismaChatRoom,
    Chat as PrismaChat, 
    Order as PrismaOrder, 
    OrderShipping as PrismaOrderShipping,
    OrderStripe as PrismaOrderStripe,
    OrderItem as PrismaOrderItem,
    OrderItemSubscription as PrismaOrderItemSubscription,
    OrderItemStripe as PrismaOrderItemStripe,
    SubscriptionPayment as PrismaSubscriptionPayment,
    ShippingAddress as PrismaShippingAddress, 
    UserBookmark as PrismaUserBookmark,
    VerificationToken as PrismaVerificationToken, 
} from "@prisma/client"
import { Session as NextAuthSession } from "next-auth"

import { 
    BUTTON_SIZES,
    BUTTON_TEXT_TYPES,
    BUTTON_POSITIONS,
    BUTTON_TYPES,
    BUTTON_VARIANTS,
    UNDERLINE_LINK_POSITIONS,
    MODAL_SIZES,
    OVERLAY_TYPES,
    FILE_STATUS_TYPES,
    ERROR_MESSAGE_POSITIONS,
    TAB_TEXT_TYPES,
    DROPZONE_TYPES,
    LOADING_SPINNER_SIZES,
    DATE_FORMAT_TYPES,
    FILE_MIME_TYPES,
    METADATA_TYPES,
    GET_USER_DATA_TYPES,
    UPDATE_PASSWORD_PAGE_TYPES,
    PRODUCT_QUANTITY_SIZES,
    GET_PRODUCTS_PAGE_TYPES,
    OPTIMAL_SYNC_TAG_TYPES,
    COLLECTION_SORT_TYPES,
    TREND_STATUS_SIZES,
    SUBSCRIPTION_PURCHASE_TYPES,
    CART_OPERATION_TYPES,
    STAR_RATING_SIZES_TYPES,
    STAR_RATING_TYPES,
    CHAT_SOURCE,
    ORDER_STATUS,
    ORDER_DISPLAY_TYPES,
    ORDER_STATUS_DISPLAY_TYPES,
    SUBSCRIPTION_STATUS,
    BOOKMARK_OPERATION_TYPES,
    VERIFICATION_STATUS,
    SYNC_LOG_TAG_SIZES,
    AUTH_TYPES,
    VERIFY_EMAIL_TYPES,
    EMAIL_VERIFICATION_PAGE_TYPES,
    EMAIL_VERIFICATION_TYPES,
    SEARCH_FORM_SIZES,
    CONTACT_STEPS,
    TEXTAREA_SCHEMA_TYPES,
    CLOUDFLARE_BUCKET_TYPES,
    STRIPE_SUBSCRIPTION_INTERVALS,
    PRODUCT_PRICE_STATUS,
    CATEGORY_TAGS,
    PRODUCT_STATUS_SIZES,
    PRODUCT_PRICE_TYPES,
    PRICE_RANGE_DRAGGING_TYPES,
    SYNC_LOG_CATEGORIES,
    TREND_CATEGORIES,
    EDIT_PASSWORD_STEP,
    ORDER_HISTORY_CATEGORIES,
    SUBSCRIPTION_HISTORY_CATEGORIES,
    CONTACT_FORM_STEP,
    EDIT_EMAIL_STEP
} from "@/constants"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ALL_TAG } = CATEGORY_TAGS;

declare global {
    /* ============================== 
        共通項目
    ============================== */
    type ButtonSizeType = typeof BUTTON_SIZES[keyof typeof BUTTON_SIZES];
    type ButtonTextType = typeof BUTTON_TEXT_TYPES[keyof typeof BUTTON_TEXT_TYPES];
    type ButtonPositionType = typeof BUTTON_POSITIONS[keyof typeof BUTTON_POSITIONS];
    type ButtonType = typeof BUTTON_TYPES[keyof typeof BUTTON_TYPES];
    type ButtonVariantType = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];
    type UnderlineLinkPositionType = typeof UNDERLINE_LINK_POSITIONS[keyof typeof UNDERLINE_LINK_POSITIONS];
    type ModalSizeType = typeof MODAL_SIZES[keyof typeof MODAL_SIZES];
    type OverlayType = typeof OVERLAY_TYPES[keyof typeof OVERLAY_TYPES];
    type FileStatusType = typeof FILE_STATUS_TYPES[keyof typeof FILE_STATUS_TYPES];
    type ErrorMessagePositionType = typeof ERROR_MESSAGE_POSITIONS[keyof typeof ERROR_MESSAGE_POSITIONS];
    type TabTextType = typeof TAB_TEXT_TYPES[keyof typeof TAB_TEXT_TYPES];
    type DropzoneType = typeof DROPZONE_TYPES[keyof typeof DROPZONE_TYPES];
    type LoadingSpinnerSizeType = typeof LOADING_SPINNER_SIZES[keyof typeof LOADING_SPINNER_SIZES];
    type DateFormatType = typeof DATE_FORMAT_TYPES[keyof typeof DATE_FORMAT_TYPES];
    type FileMimeType = typeof FILE_MIME_TYPES[keyof typeof FILE_MIME_TYPES];
    type MetadataType = typeof METADATA_TYPES[keyof typeof METADATA_TYPES];

    type Session = NextAuthSession;
    type ModalActive = boolean;
    type SetModalActive = (active: boolean) => void;
    type Files = File[];

    type TransactionClient = Prisma.TransactionClient;
    
    interface ModalStateProps {
        modalActive: ModalActive;
        setModalActive: SetModalActive;
    }

    interface CategoryPageProps {
        params: {
            category: string;
        };
        searchParams: {
            page?: string;
            minPrice?: string;
            maxPrice?: string;
            isStock?: string;
        };
    }

    interface PaginationProps {
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }

    interface PaginationWithTotalCount extends PaginationProps {
        totalCount: number;
    }

    interface ActionState {
        success: boolean;
        error: string | null;
    }

    interface ActionStateWithTimestamp extends ActionState {
        timestamp: number;
    }

    interface ActionStateWithEmailAndTimestamp extends ActionState {
        email?: UserEmail;
        timestamp: number;
    }

    interface SearchParamsProps {
        searchParams: {
            page?: string;
        }
    }

    interface SearchParamsWithCategory {
        searchParams: {
            page?: string;
            category?: string;
        }
    }

    interface SearchParamsWithQuery {
        searchParams: {
            page?: string;
            query?: string;
        }
    }

    interface SearchParamsPageCategory {
        page: number;
        category: string;
    }

    interface EditButtonProps {
        isValid: boolean;
        handleFormSubmit: () => void;
    }

    interface MousePosition {
        x: number;
        y: number;
    }

    interface UserWithProfile extends User {
        user_profiles: UserProfile;
    }

    interface UserWithShippingAddressesAndProfile extends User {
        shipping_addresses: ShippingAddress[];
        user_profiles: UserProfile;
    }

    interface ProductWithReviewsAndPricing extends Product {
        reviews: Review[];
        product_pricings: ProductPricing | null;
        product_sales: ProductSales | null;
    }

    interface ProductWithRelations extends Product {
        product_stripes: ProductStripe | null;
        product_pricings: ProductPricing | null;
        product_sales: ProductSales | null;
    }

    interface ProductWithRelationsAndDetails extends ProductWithRelations {
        product_details: ProductDetail | null;
        product_relations: ProductRelation | null;
    }

    interface ProductWithOptimalSyncs extends Product {
        product_relations: ProductRelation;
    }

    interface ReviewWithUser extends Review {
        user: UserWithProfile;
    }

    interface ReviewWithUserAndProduct extends ReviewWithUser {
        product: Product;
    }

    interface CartItemWithProduct extends CartItem {
        product: ProductWithRelations;
    }

    interface BookmarkItemWithProduct extends UserBookmark {
        product: Product;
    }

    /* ============================== 
        User 関連
    ============================== */
    type GetUserDataTypes = typeof GET_USER_DATA_TYPES[keyof typeof GET_USER_DATA_TYPES];
    type UpdatePasswordPageType = typeof UPDATE_PASSWORD_PAGE_TYPES[keyof typeof UPDATE_PASSWORD_PAGE_TYPES];

    type User = PrismaUser;
    type UserId = User['id'];
    type UserEmail = User['email']; 
    type UserPassword = User['password']; 
    type UserEmailVerified = User['emailVerified'];
    
    interface UserIdProps {
        userId: UserId;
    }

    interface UserData {
        email: UserEmail;
        password: UserPassword;
    }
    
    interface CreateUserData extends UserData {
        emailVerified: UserEmailVerified;
    }
    
    interface UpdateUserEmailProps extends UserIdProps {
        email: UserEmail;
    }
    
    interface UpdateUserPasswordProps extends UserIdProps {
        password: UserPassword;
    }

    interface CreateUserWithTransactionProps {
        tx: TransactionClient;
        userData: CreateUserData;
    }
    
    interface UpdatedUserPasswordWithTransactionProps {
        tx: TransactionClient;
        verificationToken: VerificationData;
        password: UserPassword;
    }

    interface UserWithTransactionProps extends UserIdProps {
        tx: TransactionClient;
    }

    /* ============================== 
        UserProfile 関連
    ============================== */
    type UserProfile = PrismaUserProfile;
    type UserProfileId = UserProfile['user_id'];
    type UserProfileLastname = UserProfile['lastname'];
    type UserProfileFirstname = UserProfile['firstname'];
    type UserProfileIconUrl = UserProfile['icon_url'];
    type UserProfileTel = UserProfile['tel'];

    interface UserProfileData {
        lastname: UserProfileLastname;
        firstname: UserProfileFirstname;
    }
    
    interface CreateUserProfileData extends UserProfileData {
        icon_url: UserProfileIconUrl;
    }

    interface UserProfileIdProps {
        userId: UserProfileId;
    }

    interface UpdateUserProfileIconUrlProps extends UserProfileIdProps {
        iconUrl: UserProfileIconUrl;
    }
    
    interface UpdateUserProfileNameProps extends UserProfileIdProps {
        lastname: UserProfileLastname;
        firstname: UserProfileFirstname;
    }
    
    interface UpdateUserProfileTelProps extends UserProfileIdProps {
        tel: UserProfileTel;
    }

    interface CreateUserProfileWithTransactionProps {
        tx: TransactionClient;
        userId: UserProfileId;
        userProfileData: CreateUserProfileData;
    }


    /* ============================== 
        UserImage 関連
    ============================== */
    type UserImage = PrismaUserImage;
    type UserImageId = UserImage['id'];
    type UserImageUserId = UserImage['user_id'];
    type UserImagePath = UserImage['file_path'];

    interface UpdateUserImageFilePathProps {
        userId: UserId;
        filePath: UserImagePath;
    }

    interface CreateUserImageWithTransactionProps {
        tx: TransactionClient;
        userId: UserImageUserId;
    }


    /* ============================== 
        UserStripe 関連
    ============================== */
    interface CreateUserStripeCustomerIdProps extends UserIdProps {
        userId: UserId;
        customerId: StripeCustomerId;
    }


    /* ============================== 
        Product 関連
    ============================== */
    type ProductPriceStatusType = typeof PRODUCT_PRICE_STATUS[keyof typeof PRODUCT_PRICE_STATUS];
    type ProductCategoryTagType = typeof CATEGORY_TAGS[keyof typeof CATEGORY_TAGS];
    type ProductStatusSizeType = typeof PRODUCT_STATUS_SIZES[keyof typeof PRODUCT_STATUS_SIZES];
    type ProductPriceType = typeof PRODUCT_PRICE_TYPES[keyof typeof PRODUCT_PRICE_TYPES];
    type PriceRangeDraggingType = typeof PRICE_RANGE_DRAGGING_TYPES[keyof typeof PRICE_RANGE_DRAGGING_TYPES];
    type ProductQuantitySizeType = typeof PRODUCT_QUANTITY_SIZES[keyof typeof PRODUCT_QUANTITY_SIZES];
    type GetProductsPageType = typeof GET_PRODUCTS_PAGE_TYPES[keyof typeof GET_PRODUCTS_PAGE_TYPES];
    type OptimalSyncTagType = typeof OPTIMAL_SYNC_TAG_TYPES[keyof typeof OPTIMAL_SYNC_TAG_TYPES];
    type CollectionSortType = typeof COLLECTION_SORT_TYPES[keyof typeof COLLECTION_SORT_TYPES];
    type TrendStatusSizeType = typeof TREND_STATUS_SIZES[keyof typeof TREND_STATUS_SIZES];
    type TrendCategoryType = typeof TREND_CATEGORIES[keyof typeof TREND_CATEGORIES];

    type Product = PrismaProduct;
    type ProductTitle = Product['title'];
    type ProductImageUrls = Product['image_urls'];
    type ProductPrice = Product['price'];
    type ProductCategory = Product['category'];
    type ProductId = Product['id'];
    type ProductSlug = Product['slug'];
    type ProductStock = Product['stock'];
    type CategoryType = Product['category'];

    type ProductWhereInput = Prisma.ProductWhereInput;
    type ProductOrderByWithRelationInput = Prisma.ProductOrderByWithRelationInput;
    type ExcludeProductCategoryTagType = Exclude<ProductCategoryTagType, typeof ALL_TAG>;

    interface ProductPriceBounds {
        minPrice: number;
        maxPrice: number;
    }

    interface ProductsCategoryData extends PaginationWithTotalCount {
        products: ProductWithReviewsAndPricing[];
        category: CategoryType;
    }

    interface GetAllCategoriesProductsProps {
        limit?: number;
        threshold?: number;
    }

    interface GetPaginatedProductsProps {
        page: number
        limit: number
        query?: string 
        category?: CategoryType
        isTrend?: boolean
        filters?: {
            priceRange?: [number, number];
            isStock?: boolean;
        }
        sortType?: CollectionSortType
    }

    interface UpdateStockAndSoldCountProps {
        productUpdates: Array<{ 
            productId: ProductId; 
            quantity: number 
        }>
    }

    interface TrendSectionContentProps {
        productData: TrendCategoryData[];
    }

    type ProductSelectFields = Pick<Product, 'title' | 'image_urls' | 'price' | 'category' | 'slug'>;


    /* ============================== 
        ProductPricing 関連
    ============================== */
    type ProductPricing = PrismaProductPricing;
    type ProductSalePrice = ProductPricing['sale_price'];


    /* ============================== 
        ProductSales 関連
    ============================== */
    type ProductSales = PrismaProductSales;


    /* ============================== 
        ProductDetail 関連
    ============================== */
    type ProductDetail = PrismaProductDetail;


    /* ============================== 
        ProductRelation 関連
    ============================== */
    type ProductRelation = PrismaProductRelation;

    interface OptimalSyncsProductIds {
        totalCount: number;
        requiredIds: Product[];
        optionIds: Product[];
        recommendedIds: Product[];
    }

    interface OptimalSyncsProductData {
        productData: OptimalSyncsProductIds;
    }


    /* ============================== 
        ProductStripe 関連
    ============================== */
    type ProductStripe = PrismaProductStripe;
    type StripeProductId = ProductStripe['stripe_product_id'];
    type StripeRegularPriceId = ProductStripe['regular_price_id'];
    type StripeSalePriceId = ProductStripe['sale_price_id'];
    type StripeSubscriptionPriceIds = ProductStripe['subscription_price_ids'];

    interface UpdateProductStripeProps {
        productId: ProductId;
        data: {
            stripe_product_id: StripeProductId,
            regular_price_id: StripeRegularPriceId,
            sale_price_id?: StripeSalePriceId
        }
    }

    interface SubscriptionOption {
        interval: string;
        priceId: string;
        price: number;
    }

    interface CreateSubscriptionOption {
        interval: string;
        price: number;
    }


    /* ============================== 
        CartItem 関連
    ============================== */
    type CartOperationType = typeof CART_OPERATION_TYPES[keyof typeof CART_OPERATION_TYPES];
    
    type CartItem = PrismaCartItem;
    type CartItemQuantity = CartItem['quantity'];

    interface UpdateCartItemQuantityProps {
        userId: UserId,
        productId: ProductId,
        quantity: CartItemQuantity
    }


    /* ============================== 
        Notification 関連
    ============================== */
    type NotificationData = PrismaNotification; // ブラウザの組み込み型と競合するため型名にDataを追加

    interface NotificationWithDetails extends NotificationData {
        relatedData?: ProductNotificationData | ChatNotificationData | null;
    }
    
    interface ProductNotificationData {
        id: ProductId;
        title: ProductTitle;
    }
    
    interface ChatNotificationData {
        id: ChatId;
        chat_room_id: ChatRoomId;
        message: ChatMessage;
        sent_at: ChatSentAt;
    }
    

    /* ============================== 
        Review 関連
    ============================== */
    type StarRatingSizeType = typeof STAR_RATING_SIZES_TYPES[keyof typeof STAR_RATING_SIZES_TYPES];
    type StarRatingType = typeof STAR_RATING_TYPES[keyof typeof STAR_RATING_TYPES];

    type Review = PrismaReview;
    type ReviewName = Review['name'];
    type ReviewRating = Review['rating'];
    type ReviewComment = Review['comment'];
    type ReviewCreatedAt = Review['created_at'];

    type ReviewWhereInput = Prisma.ReviewWhereInput;

    interface ReviewResultProps {
        reviews: ReviewWithUserAndProduct[];
        totalCount: number;
    }

    interface ReviewData {
        name: ReviewName;
        rating: ReviewRating;
        comment: ReviewComment;
        files: Files;
    }

    interface ReviewStatsProps {
        averageRating: number;
        ratingCounts: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }

    interface ReviewStats {
        productReviewStats?: ReviewStatsProps;
    }

    type ReviewSubmitHandler = (formData: FormData, files: File[]) => void;

    interface ReviewFormProps {
        productReviewsCount: number;
        productReviewStats?: ReviewStatsProps;
    }


    /* ============================== 
        ChatRoom 関連
    ============================== */
    type ChatRoom = PrismaChatRoom;
    type ChatRoomId = ChatRoom['id'];
    type ChatRoomUserId = ChatRoom['user_id'];

    interface CreateChatRoomWithTransactionProps {
        tx: TransactionClient;
        userId: ChatRoomUserId;
    }


    /* ============================== 
        Chat 関連
    ============================== */
    type ChatSourceType = typeof CHAT_SOURCE[keyof typeof CHAT_SOURCE];
    
    type Chat = PrismaChat;
    type ChatId = Chat['id'];
    type ChatRoomReferenceId = Chat['chat_room_id'];
    type ChatMessage = Chat['message'];
    type ChatSenderType = Chat['sender_type'];
    type ChatSentAt = Chat['sent_at'];
    type ChatSource = ChatSourceType;

    interface ChatProps {
        id: ChatId;
        message: ChatMessage;
        sender_type: ChatSenderType;
        sent_at: ChatSentAt;
        source: ChatSource;
    }

    interface ChatMessageProps extends Pick<ChatProps, 'message' | 'source'> {
        senderType: ChatSenderType;
    }


    /* ============================== 
        Order 関連
    ============================== */
    type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
    type OrderDisplayType = typeof ORDER_DISPLAY_TYPES[keyof typeof ORDER_DISPLAY_TYPES];
    type OrderStatusDisplayType = typeof ORDER_STATUS_DISPLAY_TYPES[keyof typeof ORDER_STATUS_DISPLAY_TYPES];
    type OrderHistoryCategoryType = typeof ORDER_HISTORY_CATEGORIES[keyof typeof ORDER_HISTORY_CATEGORIES];

    type Order = PrismaOrder;
    type OrderId = Order['id'];
    type OrderNumber = Order['order_number'];
    type OrderUserId = Order['user_id'];
    type OrderTotalAmount = Order['total_amount'];
    type OrderCurrency = Order['currency'];
    type OrderStatus = Order['status'];
    type OrderCreatedAt = Order['created_at'];
    type OrderPaymentMethod = Order['payment_method'];

    type OrderWhereInput = Prisma.OrderWhereInput;

    interface GetUserPaginatedOrdersProps {
        userId: UserId;
        category: string;
        page: number;
        limit: number;
    }

    interface ReceiptPDFProps {
        order: OrderHistoryData;
        isSubscription?: boolean;
        subscriptionPaymentId?: PaymentSubscriptionId;
    }

    interface OrderPagenatedSelectFields {
        product_id: OrderItemOrderId;
        quantity: OrderItemQuantity;
        unit_price: OrderItemUnitPrice;
        order_item_subscriptions: {
            subscription_id: OrderItemStripeSubscriptionId;
            remarks: OrderItemSubscriptionRemarks;
        };
        product: ProductSelectFields;
    }

    interface OrderPagenatedData extends Order {
        order_items: OrderPagenatedSelectFields[];
    }

    interface OrderPagenatedProps extends PaginationWithTotalCount {
        orders: OrderPagenatedData[];
    }

    interface OrderHistorySelectFields {
        id: OrderItemId;
        product_id: OrderItemOrderId;
        quantity: OrderItemQuantity;
        unit_price: OrderItemUnitPrice;
        order_item_subscriptions: OrderItemSubscriptionSelectFields;
        product: ProductSelectFields;
    }

    interface OrderHistoryData extends Order {
        order_items: OrderHistorySelectFields[];
        order_shippings: (Omit<OrderShipping, 'address'> & {
            address: ShippingAddress;
        }) | null;
    }

    interface CreateOrderData {
        user_id: OrderUserId;
        status: OrderStatusType;
        total_amount: OrderTotalAmount;
        currency: OrderCurrency;
        payment_method: OrderPaymentMethod;
    }

    interface CreateCheckoutOrderData {
        order: Order;
        orderShipping: OrderShipping;
    }

    interface OrderCompleteEmailProps {
        orderData: StripeCheckoutSession;
        productDetails: StripeProductDetailsProps[];
        orderNumber: OrderNumber;
    }


    /* ============================== 
        OrderShipping 関連
    ============================== */
    type OrderShipping = PrismaOrderShipping;
    type OrderShippingDeliveryName = OrderShipping['delivery_name'];
    type OrderShippingShippingFee = OrderShipping['shipping_fee'];

    type PrismaInputJsonValue = Prisma.InputJsonValue;

    interface CreateOrderShippingProps {
        orderShippingData: CreateOrderShippingData;
    }

    interface CreateOrderShippingData {
        order_id: OrderId;
        delivery_name: OrderShippingDeliveryName;
        address: PrismaInputJsonValue;
        shipping_fee: OrderShippingShippingFee;
    }


    /* ============================== 
        OrderStripe 関連
    ============================== */
    type OrderStripe = PrismaOrderStripe;
    
    interface CreateOrderStripeProps extends Pick<OrderStripe, 'order_id' | 'session_id' | 'payment_intent_id'> {}


    /* ============================== 
        OrderItem 関連
    ============================== */
    type OrderItem = PrismaOrderItem;
    type OrderItemId = OrderItem['id'];
    type OrderItemOrderId = OrderItem['order_id'];
    type OrderItemProductId = OrderItem['product_id'];
    type OrderItemQuantity = OrderItem['quantity'];
    type OrderItemUnitPrice = OrderItem['unit_price'];
    type OrderItemTotalPrice = OrderItem['total_price'];

    type OrderItemWhereInput = Prisma.OrderItemWhereInput;

    interface GetUserSubscriptionByProductProps {
        productId: ProductId;
        userId: UserId;
    }
    
    interface OrderItemPagenatedData extends OrderItem {
        order_item_subscriptions: OrderItemSubscriptionSelectFields;
        product: ProductSelectFields;
    }

    /* ============================== 
        OrderItemSubscription 関連
    ============================== */
    type SubscriptionStatusType = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
    type StripeSubscriptionIntervalType = typeof STRIPE_SUBSCRIPTION_INTERVALS[keyof typeof STRIPE_SUBSCRIPTION_INTERVALS];
    type SubscriptionPurchaseType = typeof SUBSCRIPTION_PURCHASE_TYPES[keyof typeof SUBSCRIPTION_PURCHASE_TYPES];
    type SubscriptionHistoryCategoryType = typeof SUBSCRIPTION_HISTORY_CATEGORIES[keyof typeof SUBSCRIPTION_HISTORY_CATEGORIES];
    
    type OrderItemSubscription = PrismaOrderItemSubscription;
    type OrderItemSubscriptionSubscriptionId = OrderItemSubscription['subscription_id'];
    type OrderItemSubscriptionStatus = OrderItemSubscription['status'];
    type OrderItemSubscriptionInterval = OrderItemSubscription['interval'];
    type OrderItemSubscriptionNextPayment = OrderItemSubscription['next_payment_date'];
    type OrderItemSubscriptionRemarks = OrderItemSubscription['remarks'];

    type OrderItemSubscriptionSelectFields = Pick<OrderItemSubscription, 'subscription_id' | 'status' | 'next_payment_date' | 'remarks'> & {
        subscription_payments: SubscriptionPaymentSelectFields[];
    };

    interface UpdateSubscriptionStatusProps {
        subscriptionId: OrderItemSubscriptionSubscriptionId;
        subscriptionStatus: OrderItemSubscriptionStatus;
    }

    /* ============================== 
        OrderItemStripe 関連
    ============================== */
    type OrderItemStripe = PrismaOrderItemStripe;
    type OrderItemStripeOrderItemId = OrderItemStripe['order_item_id'];
    type OrderItemStripePriceId = OrderItemStripe['price_id'];
    type OrderItemStripeSubscriptionId = OrderItemStripe['subscription_id'];


    /* ============================== 
        SubscriptionPayment 関連
    ============================== */
    type SubscriptionPayment = PrismaSubscriptionPayment;
    type SubscriptionPaymentId = SubscriptionPayment['id'];
    type PaymentSubscriptionId = SubscriptionPayment['subscription_id'];
    type SubscriptionPaymentPaymentDate = SubscriptionPayment['payment_date'];
    type SubscriptionPaymentStatus = SubscriptionPayment['status'];

    type SubscriptionPaymentSelectFields = Pick<SubscriptionPayment, 'id' | 'payment_date' | 'status'>;


    /* ============================== 
        ShippingAddress 関連
    ============================== */
    type ShippingAddress = PrismaShippingAddress;
    type ShippingAddressId = ShippingAddress['id'];
    type ShippingAddressName = ShippingAddress['name'];
    type ShippingAddressPostalCode = ShippingAddress['postal_code'];
    type ShippingAddressState = ShippingAddress['state'];
    type ShippingAddressAddressLine1 = ShippingAddress['address_line1'];
    type ShippingAddressAddressLine2 = ShippingAddress['address_line2'];

    interface UpdateShippingAddressProps extends UserIdProps {
        id: ShippingAddressId;
        shippingAddress: ShippingAddress;
    }
    
    interface ShippingDefaultValues {
        id?: ShippingAddressId;
        name?: ShippingAddressName;
        postal_code?: ShippingAddressPostalCode;
        state?: ShippingAddressState;
        address_line1?: ShippingAddressAddressLine1;
        address_line2?: ShippingAddressAddressLine2;
    }

    interface ShippingAddressWithUserProps extends UserIdProps {
        addressId: ShippingAddressId;
    }

    interface DeleteShippingAddressProps extends UserIdProps {
        id: ShippingAddressId;
    }

    /* ============================== 
        Bookmark 関連
    ============================== */
    type BookmarkOperationType = typeof BOOKMARK_OPERATION_TYPES[keyof typeof BOOKMARK_OPERATION_TYPES];

    type UserBookmark = PrismaUserBookmark;

    interface BookmarkContentProps {
        bookmarkData: BookmarkItemWithProduct[];
        setBookmarkData: (data: BookmarkItemWithProduct[]) => void;
    }


    /* ============================== 
        VerificationToken 関連
    ============================== */
    type VerificationStatusType = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

    type VerificationToken = PrismaVerificationToken;
    type VerificationIdentifier = VerificationToken['identifier'];
    type VerificationTokenValue = VerificationToken['token'];
    type VerificationExpires = VerificationToken['expires'];
    type VerificationPassword = VerificationToken['password'];
    type VerificationUserData = VerificationToken['userData'];

    interface TokenProps {
        token: VerificationTokenValue;
    }

    interface VerificationData {
        identifier: VerificationIdentifier;
        token: VerificationTokenValue;
        expires: VerificationExpires;
        password?: VerificationPassword;
        userData?: VerificationUserData;
    }
    
    interface DeleteVerificationTokenWithTransactionProps extends TokenProps {
        tx: TransactionClient;
    }


    /* ============================== 
        Sync Log 関連
    ============================== */
    type SyncLogTagSizeType = typeof SYNC_LOG_TAG_SIZES[keyof typeof SYNC_LOG_TAG_SIZES];
    type SyncLogCategoryType = typeof SYNC_LOG_CATEGORIES[keyof typeof SYNC_LOG_CATEGORIES];

    interface SyncLogCardProps {
        id: string;
        thumbnail: {
            url: string;
        };
        title: string;
        content: string;
        category: {
            name: string;
        };
        createdAt: Date;
    }

    interface SyncLogListsData {
        logLists: {
            [key: string]: {
                logList: SyncLogCardProps[];
                totalCount: number;
            }
        };
    }

    interface SyncLogData extends PaginationWithTotalCount {
        logList: SyncLogCardProps[];
    }


    /* ============================== 
        Stripe 関連
    ============================== */
    type StripeProduct = Stripe.Product;
    type StripeCheckoutSession = Stripe.Checkout.Session;
    type StripePaymentIntent = Stripe.PaymentIntent;
    type StripeCustomerId = string;
    type StripeCheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams;
    type StripeCheckoutSessionLineItem = Stripe.Checkout.SessionCreateParams.LineItem;
    type StripePaymentLinkCreateParams = Stripe.PaymentLinkCreateParams;
    type StripeSubscription = Stripe.Subscription;
    type StripeInvoice = Stripe.Invoice;
    type StripeSubscriptionItem = Stripe.SubscriptionItem;
    type StripePaymentMethod = string | Stripe.PaymentMethod;
    type StripeEvent = Stripe.Event;
    type StripeCheckoutSessionId = StripeCheckoutSession['id'];

    interface StripeAddress {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
    }

    interface StripeCustomerDetails {
        address: StripeAddress;
        name: string;
        phone?: string;
    }

    interface StripeProductDetailsProps {
        product_id: ProductId;
        title: ProductTitle;
        image: ProductImageUrls;
        amount: ProductPrice;
        unit_price: OrderItemUnitPrice;
        quantity: OrderItemQuantity;
        subscription_status: OrderItemSubscriptionStatus;
        subscription_interval: OrderItemSubscriptionInterval;
        subscription_product: boolean;
        stripe_price_id: OrderItemStripePriceId;
        subscription_id: OrderItemStripeSubscriptionId;
    }


    /* ============================== 
        認証 関連
    ============================== */
    type AuthType = typeof AUTH_TYPES[keyof typeof AUTH_TYPES];
    type VerifyEmailType = typeof VERIFY_EMAIL_TYPES[keyof typeof VERIFY_EMAIL_TYPES];
    type EmailVerificationPageType = typeof EMAIL_VERIFICATION_PAGE_TYPES[keyof typeof EMAIL_VERIFICATION_PAGE_TYPES];
    type EmailVerificationType = typeof EMAIL_VERIFICATION_TYPES[keyof typeof EMAIL_VERIFICATION_TYPES];
    type EditEmailStepType = typeof EDIT_EMAIL_STEP[keyof typeof EDIT_EMAIL_STEP];
    type EditPasswordStepType = typeof EDIT_PASSWORD_STEP[keyof typeof EDIT_PASSWORD_STEP];


    /* ============================== 
        その他
    ============================== */
    type SearchFormSizeType = typeof SEARCH_FORM_SIZES[keyof typeof SEARCH_FORM_SIZES];
    type ContactStepsType = typeof CONTACT_STEPS[keyof typeof CONTACT_STEPS];
    type TextareaSchemaType = typeof TEXTAREA_SCHEMA_TYPES[keyof typeof TEXTAREA_SCHEMA_TYPES];
    type CloudflareBucketType = typeof CLOUDFLARE_BUCKET_TYPES[keyof typeof CLOUDFLARE_BUCKET_TYPES];
    type ContactFormStepType = typeof CONTACT_FORM_STEP[keyof typeof CONTACT_FORM_STEP];

    interface CheckoutLineItem {
        price: string;
        quantity: number;
    }

    interface WebhookLineItem {
        id: string;
        amount_total: number;
        amount_subtotal: number;
        amount_tax: number;
        price: {
            id: string;
            unit_amount: number;
            product: string;
            recurring?: {
                interval: string;
                interval_count: number;
            };
        };
        quantity: number;
    }

    type PaymentErrorType = keyof typeof ERROR_MESSAGES.PAYMENT_ERROR;
}

export {};