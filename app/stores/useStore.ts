import { create } from "zustand"

import { STORE_CONFIG, SUBSCRIPTION_PURCHASE_TYPES } from "@/constants/index"

const { INITIAL_AGREEMENTS } = STORE_CONFIG;
const { SUBSCRIPTION } = SUBSCRIPTION_PURCHASE_TYPES;

interface AgreementState {
    agreements: { [key: string]: boolean }
    setAgreement: (id: string, value: boolean) => void
    resetAgreements: () => void
    isAllChecked: (checkList: { id: string }[]) => boolean
}

interface CartState {
    cartCount: number;
    setCartCount: (count: number) => void;
}

interface SearchState { 
    searchBoxOpen: boolean; 
    setSearchBoxOpen: (value: boolean) => void; 
}

interface CollectionFilterState { 
    collectionFilterOpen: boolean; 
    setCollectionFilterOpen: (value: boolean) => void; 
}

interface CollectionSortState { 
    collectionSortOpen: boolean; 
    setCollectionSortOpen: (value: boolean) => void; 
}

interface SubscriptionPurchaseTypeState {
    subscriptionPurchaseType: SubscriptionPurchaseType;
    setSubscriptionPurchaseType: (value: SubscriptionPurchaseType) => void;
}

interface SelectedSubscriptionOptionState {
    selectedSubscriptionOption: SubscriptionOption | null;
    setSelectedSubscriptionOption: (value: SubscriptionOption | null) => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
    searchBoxOpen: false,
    setSearchBoxOpen: (value: boolean) => set({ searchBoxOpen: value }),
}));

export const useCollectionFilterStore = create<CollectionFilterState>()((set) => ({
    collectionFilterOpen: false,
    setCollectionFilterOpen: (value: boolean) => set({ collectionFilterOpen: value }),
}));

export const useCollectionSortStore = create<CollectionSortState>()((set) => ({
    collectionSortOpen: false,
    setCollectionSortOpen: (value: boolean) => set({ collectionSortOpen: value }),
}));

export const useSubscriptionPurchaseTypeStore = create<SubscriptionPurchaseTypeState>()((set) => ({
    subscriptionPurchaseType: SUBSCRIPTION,
    setSubscriptionPurchaseType: (value: SubscriptionPurchaseType) => set({ subscriptionPurchaseType: value }),
}));

export const useSelectedSubscriptionOptionStore = create<SelectedSubscriptionOptionState>()((set) => ({
    selectedSubscriptionOption: null,
    setSelectedSubscriptionOption: (value: SubscriptionOption | null) => set({ selectedSubscriptionOption: value }),
}));

export const useAgreementStore = create<AgreementState>((set, get) => ({
    agreements: INITIAL_AGREEMENTS,
    
    setAgreement: (id: string, value: boolean) => {
        set((state) => ({
            agreements: {
                ...state.agreements,
                [id]: value
            }
        }))
    },
    
    resetAgreements: () => {
        set({ agreements: INITIAL_AGREEMENTS });
    },
    
    isAllChecked: (checkList: { id: string }[]) => {
        const { agreements } = get();
        return checkList.every(list => agreements[list.id]);
    }
}))

export const useCartStore = create<CartState>((set) => ({
    cartCount: 0,
    setCartCount: (count) => set({ cartCount: count }),
}));