import type { 
    User as PrismaUser, 
    Review as PrismaReview, 
    Product as PrismaProduct, 
    CartItem as PrismaCartItem,
    Chat as PrismaChat, 
    VerificationToken as PrismaVerificationToken, 
    Order as PrismaOrder, 
    SubscriptionPayment as PrismaSubscriptionPayment,
    ShippingAddress as PrismaShippingAddress, 
    Notification as PrismaNotification,
} from "@prisma/client"
import { Session } from "next-auth"
import { openai } from "@/lib/clients/openai/client"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

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

    type Session = Session;
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

    interface ParamsCategoryProps {
        params: {
            category: string;
        };
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

    interface UserWithShippingAddresses extends User {
        shipping_addresses: ShippingAddress[];
    }

    interface OrderWithOrderItems extends Order {
        order_items: OrderItem[];
        address: ShippingAddress | null;
    }

    interface ProductWithReviews extends Product {
        reviews: Review[];
    }

    interface ReviewWithUser extends Review {
        user: User;
    }

    interface ReviewWithUserAndProduct extends ReviewWithUser {
        product: Product;
    }

    interface CartItemWithProduct extends CartItem {
        product: Product;
    }

    interface BookmarkItemWithProduct extends UserBookmark {
        product: Product;
    }
    

    /* ============================== 
        Sync Log 関連
    ============================== */
    type SyncLogTagSizeType = typeof SYNC_LOG_TAG_SIZES[keyof typeof SYNC_LOG_TAG_SIZES];

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
        User 関連
    ============================== */
    type GetUserDataTypes = typeof GET_USER_DATA_TYPES[keyof typeof GET_USER_DATA_TYPES];
    type UpdatePasswordPageType = typeof UPDATE_PASSWORD_PAGE_TYPES[keyof typeof UPDATE_PASSWORD_PAGE_TYPES];

    type User = PrismaUser;
    type UserId = User['id'];
    type UserLastname = User['lastname'];
    type UserFirstname = User['firstname'];
    type UserEmail = User['email']; 
    type UserPassword = User['password']; 
    type UserIconUrl = User['icon_url'];
    type UserTel = User['tel'];
    type UserEmailVerified = User['emailVerified'];
    type UserStripeCustomerId = User['stripe_customer_id'];

    interface UserIdActionsProps {
        userId: UserId;
    }

    interface UserData {
        lastname: UserLastname;
        firstname: UserFirstname;
        email: UserEmail;
        password: UserPassword;
    }
    
    interface CreateUserData extends UserData {
        icon_url: UserIconUrl;
        emailVerified: UserEmailVerified;
    }

    interface UpdateStripeCustomerIdProps extends UserIdActionsProps {
        userId: UserId;
        customerId: StripeCustomerId;
    }

    interface UpdateUserIconUrlProps extends UserIdActionsProps {
        iconUrl: UserIconUrl;
    }
    
    interface UpdateUserNameProps extends UserIdActionsProps {
        lastname: UserLastname;
        firstname: UserFirstname;
    }
    
    interface UpdateUserTelProps extends UserIdActionsProps {
        tel: UserTel;
    }
    
    interface UpdateUserEmailProps extends UserIdActionsProps {
        email: UserEmail;
    }
    
    interface UpdateUserPasswordProps extends UserIdActionsProps {
        password: UserPassword;
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
    type SubscriptionPurchaseType = typeof SUBSCRIPTION_PURCHASE_TYPES[keyof typeof SUBSCRIPTION_PURCHASE_TYPES];
    type SubscriptionContractStatusType = typeof SUBSCRIPTION_CONTRACT_STATUS_TYPES[keyof typeof SUBSCRIPTION_CONTRACT_STATUS_TYPES];

    type Product = PrismaProduct;
    type ProductTitle = Product['title'];
    type ProductImageUrls = Product['image_urls'];
    type ProductPrice = Product['price'];
    type ProductSalePriceType = Product['sale_price'];
    type ProductCategory = Product['category'];
    type ProductId = Product['id'];
    type ProductSlug = Product['slug'];
    type ProductStock = Product['stock'];
    type CategoryType = Product['category'];
    type StripeProductId = Product['stripe_product_id'];
    type StripeRegularPriceId = Product['stripe_regular_price_id'];
    type StripeSalePriceId = Product['stripe_sale_price_id'];
    type StripeSubscriptionPriceIds = Product['stripe_subscription_price_ids'];

    type ProductWhereInput = Prisma.ProductWhereInput;

    interface ProductPriceBounds {
        minPrice: number;
        maxPrice: number;
    }

    interface ProductsCategoryData extends PaginationWithTotalCount {
        products: ProductWithReviews[];
        category: CategoryType;
    }

    interface OptimalSyncsProductIds {
        totalCount: number;
        requiredIds: Product[];
        optionIds: Product[];
        recommendedIds: Product[];
    }

    interface OptimalSyncsProductData {
        productData: OptimalSyncsProductIds;
    }

    interface GetAllCategoriesProductsSalesVolumeProps {
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

    interface UpdateProductProps {
        productId: ProductId;
        data: {
            stripe_product_id: StripeProductId,
            stripe_regular_price_id: StripeRegularPriceId,
            stripe_sale_price_id?: StripeSalePriceId
        }
    }

    interface UpdateStockAndSoldCountProps {
        productUpdates: Array<{ 
            productId: ProductId; 
            quantity: number 
        }>
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

    interface TrendSectionContentProps {
        productData: TrendCategoryData[];
    }


    /* ============================== 
        Cart Item 関連
    ============================== */
    type CartOperationType = typeof CART_OPERATION_TYPES[keyof typeof CART_OPERATION_TYPES];
    
    type CartItem = PrismaCartItem;

    type CartItemCreateInput = Prisma.CartItemCreateInput;

    interface UpdateCartItemQuantityDataProps {
        userId: UserId,
        productId: ProductId,
        quantity: number
    }

    /* ============================== 
        Notification 関連
    ============================== */
    type NotificationData = PrismaNotification; // ブラウザの組み込み型と競合するため型名にDataを追加


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

    interface ReviewNotificationData extends ReviewData {
        created_at: ReviewCreatedAt;
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
        Chat 関連
    ============================== */
    type CHAT_SOURCE_TYPE = typeof CHAT_SOURCE[keyof typeof CHAT_SOURCE];
    
    type ChatId = Chat['id'];
    type ChatRoomId = Chat['chat_room_id'];
    type ChatMessage = Chat['message'];
    type ChatSenderType = Chat['sender_type'];
    type ChatSentAt = Chat['sent_at'];
    type ChatSource = CHAT_SOURCE_TYPE;


    interface ChatProps {
        id: ChatId;
        message: ChatMessage;
        sender_type: ChatSenderType;
        sent_at: ChatSentAt;
        source: ChatSource;
    }

    interface ChatActionsProps {
        message: ChatMessage;
        senderType: ChatSenderType;
        source: ChatSource;
    }


    /* ============================== 
        VerificationToken 関連
    ============================== */
    type VerificationStatusType = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

    type VerificationIdentifier = VerificationToken['identifier'];
    type VerificationTokenValue = VerificationToken['token'];
    type VerificationExpires = VerificationToken['expires'];
    type VerificationPassword = VerificationToken['password'];
    type VerificationUserData = VerificationToken['userData'];

    interface VerificationData {
        identifier: VerificationIdentifier;
        token: VerificationTokenValue;
        expires: VerificationExpires;
        password?: VerificationPassword;
        userData?: VerificationUserData;
    }


    /* ============================== 
        Order 関連
    ============================== */
    type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
    type OrderDisplayType = typeof ORDER_DISPLAY_TYPES[keyof typeof ORDER_DISPLAY_TYPES];
    type OrderStatusDisplayType = typeof ORDER_STATUS_DISPLAY_TYPES[keyof typeof ORDER_STATUS_DISPLAY_TYPES];

    type Order = PrismaOrder;
    type OrderId = Order['id'];
    type OrderNumber = Order['order_number'];
    type OrderStatus = Order['status'];
    type OrderCreatedAt = Order['created_at'];
    type OrderPaymentMethod = Order['payment_method'];

    type OrderWhereInput = Prisma.OrderWhereInput;
    type OrderCreateInput = Prisma.OrderCreateInput;

    interface OrderDataProps extends PaginationWithTotalCount {
        orders: OrderWithOrderItems[];
    }

    interface GetUserPaginatedOrdersDataProps {
        userId: UserId;
        category: string;
        page: number;
        limit: number;
    }

    interface UpdateOrderItemSubscriptionStatusDataProps {
        subscriptionId: OrderItemSubscriptionId;
        subscriptionStatus: SubscriptionContractStatusType;
    }

    interface OrderProductProps {
        product_id: string;
        title: string;
        image: string;
        amount: number;
        unit_price: number;
        quantity: number;
        stripe_price_id: string | null;
        subscription_id: string | null;
        subscription_status: SubscriptionContractStatusType | null;
        subscription_interval: string | null;
        subscription_product: boolean | null;
    }

    interface OrderCompleteEmailProps {
        orderData: StripeCheckoutSession;
        productDetails: OrderProductProps[];
        orderNumber: OrderNumber;
    }

    interface ReceiptPDFProps {
        order: OrderWithOrderItems;
        isSubscription?: boolean;
        subscriptionPaymentId?: PaymentSubscriptionId;
    }


    /* ============================== 
        OrderItem 関連
    ============================== */
    type OrderItem = OrderItem;
    type OrderItemSubscriptionId = OrderItem['subscription_id'];

    type OrderItemWhereInput = Prisma.OrderItemWhereInput;

    interface GetUserSubscriptionByProductProps {
        productId: ProductId;
        userId: UserId;
    }


    /* ============================== 
        SubscriptionPayment 関連
    ============================== */
    type SubscriptionPayment = PrismaSubscriptionPayment;
    type SubscriptionPaymentId = SubscriptionPayment['id'];
    type PaymentSubscriptionId = SubscriptionPayment['subscription_id'];
    type SubscriptionPaymentStatus = SubscriptionPayment['status'];


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

    interface UpdateShippingAddressProps {
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


    /* ============================== 
        Bookmark 関連
    ============================== */
    type BookmarkOperationType = typeof BOOKMARK_OPERATION_TYPES[keyof typeof BOOKMARK_OPERATION_TYPES];

    type UserBookmark = UserBookmark;

    interface BookmarkContentProps {
        bookmarkData: BookmarkItemWithProduct[];
        setBookmarkData: (data: BookmarkItemWithProduct[]) => void;
    }


    /* ============================== 
        UserImage 関連
    ============================== */
    type UserImage = UserImage;
    type UserImageId = UserImage['id'];
    type UserImagePath = UserImage['file_path'];

    interface UpdateUserImageFilePathProps {
        userId: UserId;
        filePath: UserImagePath;
    }


    /* ============================== 
        Stripe 関連
    ============================== */
    type StripeProduct = Stripe.Product;
    type StripeCheckoutSession = Stripe.Checkout.Session;
    type StripePaymentIntent = Stripe.PaymentIntent;
    type StripeCustomerId = Stripe.Checkout.Session['customer'];
    type StripeCheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams;
    type StripeCheckoutSessionCustomerDetails = Stripe.Checkout.Session['customer_details'];
    type StripeCheckoutSessionLineItem = Stripe.Checkout.SessionCreateParams.LineItem;
    type StripePaymentLinkCreateParams = Stripe.PaymentLinkCreateParams;
    type StripeSubscription = Stripe.Subscription;
    type StripeInvoice = Stripe.Invoice;
    type StripeSubscriptionItem = Stripe.SubscriptionItem;
    type StripePaymentMethod = string | Stripe.PaymentMethod;

    interface CustomerDetails {
        address: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
        };
        name: string;
        phone?: string;
    }


    /* ============================== 
        認証 関連
    ============================== */
    type AuthType = typeof AUTH_TYPES[keyof typeof AUTH_TYPES];
    type VerifyEmailType = typeof VERIFY_EMAIL_TYPES[keyof typeof VERIFY_EMAIL_TYPES];
    type EmailVerificationPageType = typeof EMAIL_VERIFICATION_PAGE_TYPES[keyof typeof EMAIL_VERIFICATION_PAGE_TYPES];
    type EmailVerificationType = typeof EMAIL_VERIFICATION_TYPES[keyof typeof EMAIL_VERIFICATION_TYPES];


    /* ============================== 
        その他
    ============================== */
    type SearchFormSizeType = typeof SEARCH_FORM_SIZES[keyof typeof SEARCH_FORM_SIZES];
    type ContactStepsType = typeof CONTACT_STEPS[keyof typeof CONTACT_STEPS];
    type TextareaSchemaType = typeof TEXTAREA_SCHEMA_TYPES[keyof typeof TEXTAREA_SCHEMA_TYPES];
    type CloudflareBucketType = typeof CLOUDFLARE_BUCKET_TYPES[keyof typeof CLOUDFLARE_BUCKET_TYPES];
    type StripeSubscriptionInterval = typeof SUBSCRIPTION_INTERVALS[keyof typeof SUBSCRIPTION_INTERVALS];

    type OpenAIClient = typeof openai;

    interface CartItem {
        id: ProductId;
        title: ProductTitle;
        image_urls: ProductImageUrls;
        price: ProductPrice;
        sale_price: ProductSalePriceType;
        category: ProductCategory;
        slug: ProductSlug;
        stock: ProductStock;
        quantity: number;
        addedAt: number;
        isSubscriptionOneTime?: boolean;
    }

    interface CheckoutLineItem {
        price: string;
        quantity: number;
    }

    interface LocalCartStorage extends Pick<CartItem, 'id' | 'quantity' | 'addedAt' | 'isSubscriptionOneTime'> {};
    type PaymentErrorType = keyof typeof ERROR_MESSAGES.PAYMENT_ERROR;
}

export {};