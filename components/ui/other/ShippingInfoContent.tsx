"use client"

import { Truck, CirclePlus } from "lucide-react"

import UnderlineLink from "@/components/common/buttons/UnderlineLink"
import ConfirmModal from "@/components/common/modals/ConfirmModal"
import AccountInfoModal from "@/components/common/modals/AccountInfoModal"
import useAddShippingAddressForm from "@/hooks/form/useAddShippingAddressForm"
import useUpdateShippingAddressForm from "@/hooks/form/useUpdateShippingAddressForm"
import useUpdateDefaultShippingAddressForm from "@/hooks/form/useUpdateDefaultShippingAddressForm"
import useRemoveShippingAddress from "@/hooks/shipping/useRemoveShippingAddress"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import useSetDefaultShippingAddressForm from "@/hooks/form/useSetDefaultShippingAddressForm"
import { 
    EventButtonPrimary, 
    EventButtonSecondary 
} from "@/components/common/buttons/Button"
import { 
    SHIPPING_ADDRESS_MAX_COUNT, 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    SITE_MAP 
} from "@/constants/index"

const { BUTTON_SMALL } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { ACCOUNT_PATH } = SITE_MAP;

interface ShippingInfoContentProps {
    shippingAddressesData: {
        shippingAddresses: ShippingAddress[];
        totalCount: number;
    };
}

const ShippingInfoContent = ({ shippingAddressesData}: ShippingInfoContentProps) => {
    const { shippingAddresses, totalCount } = shippingAddressesData;
    
    // デフォルト住所の編集フック
    const {
        updateDefaultSuccess,
        errorMessage: updateDefaultAddressErrorMessage,
        timestamp: updateDefaultAddressTimestamp,
        optimisticDefaultAddress,
        setOptimisticDefaultAddress,
        editDefaultModalActive,
        setEditDefaultModalActive,
        handleDefaultAddressUpdate,
    } = useUpdateDefaultShippingAddressForm(shippingAddresses);

    // 既存住所の編集（更新）フック
    const {
        updateSuccess,
        errorMessage: updateAddressErrorMessage,
        timestamp: updateAddressTimestamp,
        optimisticOtherAddresses,
        setOptimisticOtherAddresses,
        editModalActive,
        setEditModalActive,
        handleEditAddressId,
        editTarget,
        handleAddressUpdate,
    } = useUpdateShippingAddressForm(shippingAddresses);

    // 新しい住所の追加フック
    const { 
        addSuccess,
        errorMessage: addAddressErrorMessage, 
        timestamp: addAddressTimestamp,
        addFormAction,
        addModalActive,
        setAddModalActive,
    } = useAddShippingAddressForm({
        optimisticOtherAddresses,
        setOptimisticOtherAddresses
    });

    // 既存住所の削除フック
    const {
        removeSuccess,
        error: removeAddressError,
        timestamp: removeAddressTimestamp,
        removeModalActive,
        setRemoveModalActive,
        handleRemoveAddressId,
        removeShippingAddress,
    } = useRemoveShippingAddress({ 
        optimisticOtherAddresses,
        setOptimisticOtherAddresses
    });

    // お届け先として設定のフック
    const {
        setDefaultSuccess,
        errorMessage: setDefaultErrorMessage,
        timestamp: setDefaultTimestamp,
        handleSetDefaultCheck,
        handleConfirmDefault,
        setDefaultModalActive,
        setSetDefaultModalActive,
    } = useSetDefaultShippingAddressForm({
        optimisticDefaultAddress,
        optimisticOtherAddresses,
        setOptimisticDefaultAddress,
        setOptimisticOtherAddresses
    });

    useToastNotifications({
        success: updateDefaultSuccess,
        error: updateDefaultAddressErrorMessage,
        successMessage: 'お届け先の住所を更新しました',
        timestamp: updateDefaultAddressTimestamp
    });

    useToastNotifications({
        success: updateSuccess,
        error: updateAddressErrorMessage,
        successMessage: '住所を更新しました',
        timestamp: updateAddressTimestamp
    });

    useToastNotifications({
        success: addSuccess,
        error: addAddressErrorMessage,
        successMessage: '住所を追加しました',
        timestamp: addAddressTimestamp
    });

    useToastNotifications({
        success: removeSuccess,
        error: removeAddressError,
        successMessage: '住所を削除しました',
        timestamp: removeAddressTimestamp
    });

    useToastNotifications({
        success: setDefaultSuccess,
        error: setDefaultErrorMessage,
        successMessage: 'お届け先の設定を更新しました',
        timestamp: setDefaultTimestamp
    });

    const renderAddress = (address: ShippingAddress) => (
        <div className="account-info-dd">
            〒{address.postal_code}<br />
            {address.state && address.state}
            {address.city && address.city}
            {address.address_line1 && address.address_line1}
            {address.address_line2 && address.address_line2}<br />
            {address.name}
        </div>
    );

    return <>
        <div className="max-w-xl mx-auto grid gap-6 md:gap-10">
            <div className="account-info-box">
                <h3 className="account-info-title">お届け先の住所</h3>

                <div className="account-address-dlbox">
                    {optimisticDefaultAddress ? <>
                        <div className="account-info-dd">
                            {renderAddress(optimisticDefaultAddress)}
                        </div>
                        <EventButtonPrimary
                            size={BUTTON_SMALL}
                            text={BUTTON_JA}
                            customClass="account-address-btn"
                            onClick={() => setEditDefaultModalActive(true)}
                        >
                            編集
                        </EventButtonPrimary>
                    </> : (
                        <p className="order-no-data w-full">
                            まだデータがありません
                        </p>
                    )}
                </div>
            </div>

            <div className="account-info-box">
                <h3 className="account-info-title">その他の住所</h3>

                {optimisticOtherAddresses.length === 0 ? <>
                    <p className="order-no-data">
                        まだデータがありません
                    </p>
                    <hr className="separate-border my-6" />
                </> : <>
                    {optimisticOtherAddresses.map((shippingAddress) => (
                        <div key={shippingAddress.id}>
                            <div className="account-address-dlbox">
                                {renderAddress(shippingAddress)}
                                <div className="account-address-btn">
                                    <button 
                                        type="submit"
                                        className="border-b border-foreground flex items-center gap-[6px] text-sm leading-[28px] font-medium mb-4 ml-auto"
                                        onClick={() => handleSetDefaultCheck(shippingAddress.id)}
                                    >
                                        お届け先として設定
                                        <Truck 
                                            className="w-[22px] h-[22px]" 
                                            strokeWidth={1.5} 
                                        />
                                    </button>
                                    <div className="flex items-center gap-[10px] md:gap-[12px]">
                                        <EventButtonSecondary
                                            size={BUTTON_SMALL}
                                            text={BUTTON_JA}
                                            onClick={() => handleRemoveAddressId(shippingAddress.id)}
                                        >
                                            削除
                                        </EventButtonSecondary>
                                        <EventButtonPrimary
                                            size={BUTTON_SMALL}
                                            text={BUTTON_JA}
                                            onClick={() => handleEditAddressId(shippingAddress.id)}
                                        >
                                            編集
                                        </EventButtonPrimary>
                                    </div>
                                </div>
                            </div>
        
                            <hr className="separate-border my-6" />
                        </div>
                    ))}
                </>}

                {totalCount <= SHIPPING_ADDRESS_MAX_COUNT ? (
                    <button 
                        onClick={() => setAddModalActive(true)}
                        className="flex flex-col justify-center items-center gap-[6px] md:gap-3 text-center max-w-[296px] md:max-w-[320px] mx-auto w-full rounded-[8px] border border-dashed border-foreground py-4 px-2 md:px-5 md:pb-5 md:mt-8 disabled:opacity-40"
                    >
                        <span className="flex items-center gap-1 text-base leading-none font-bold ml-2">
                            追加する
                            <CirclePlus className="w-[18px] h-[18px]" strokeWidth={2} />
                        </span>
                        <span className="text-sm leading-[20px] font-bold text-sub">
                            お届け先の追加は<br className="md:hidden" />
                            {SHIPPING_ADDRESS_MAX_COUNT}件まで追加が可能です
                        </span>
                    </button>
                ) : (
                    <p className="attention-text text-center text-sub">
                        お届け先の追加は{SHIPPING_ADDRESS_MAX_COUNT}件までです
                    </p>
                )}
            </div>
        </div>

        <UnderlineLink 
            href={ACCOUNT_PATH} 
            text="Back" 
            customClass="mt-10 md:mt-[64px]" 
        />

        {/* デフォルト住所の編集モーダル */}
        <AccountInfoModal
            text="住所を編集する"
            modalActive={editDefaultModalActive}
            setModalActive={setEditDefaultModalActive}
            onConfirm={handleDefaultAddressUpdate}
            defaultValues={optimisticDefaultAddress as ShippingDefaultValues}
        />

        {/* 既存住所の編集モーダル */}
        <AccountInfoModal
            text="住所を編集する"
            modalActive={editModalActive}
            setModalActive={setEditModalActive}
            onConfirm={handleAddressUpdate}
            defaultValues={editTarget as ShippingDefaultValues}
        />

        {/* 新しい住所の追加モーダル */}
        <AccountInfoModal
            text="新しい住所を入力してください"
            modalActive={addModalActive}
            setModalActive={setAddModalActive}
            onConfirm={addFormAction}
            defaultValues={{}}
        />

        {/* 住所の削除モーダル */}
        <ConfirmModal 
            text="住所を削除してもよろしいですか？"
            modalActive={removeModalActive}
            setModalActive={setRemoveModalActive}
            onConfirm={removeShippingAddress}
        />
        
        {/* お届け先として設定の確認モーダル */}
        <ConfirmModal 
            text={<>
                お届け先として設定しても<br />
                よろしいですか？
            </>}
            modalActive={setDefaultModalActive}
            setModalActive={setSetDefaultModalActive}
            onConfirm={handleConfirmDefault}
        />
    </>
}

export default ShippingInfoContent