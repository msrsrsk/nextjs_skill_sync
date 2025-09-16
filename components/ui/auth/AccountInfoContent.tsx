"use client"

import Image from "next/image"

import UnderlineLink from "@/components/common/buttons/UnderlineLink"
import EditIconImageBox from "@/components/ui/form/EditIconImageBox"
import EditNameBox from "@/components/ui/form/EditNameBox"
import EditTelBox from "@/components/ui/form/EditTelBox"
import useUpdateIconImageForm from "@/hooks/form/useUpdateIconImageForm"
import useUpdateNameForm from "@/hooks/form/useUpdateNameForm"
import useUpdateTelForm from "@/hooks/form/useUpdateTelForm"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary, LinkButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_SMALL } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { 
    ACCOUNT_PATH, 
    SHIPPING_INFO_PATH, 
    EDIT_EMAIL_PATH, 
    EDIT_PASSWORD_PATH 
} = SITE_MAP;

const AccountInfoContent = ({ 
    user,
}: { user: UserWithShippingAddresses }) => {
    const { 
        icon_url, 
        lastname, 
        firstname, 
        email, 
        tel,
        shipping_addresses
    } = user;

    const address = shipping_addresses[0];

    /* アイコン画像の編集フック */
    const {
        IconSuccess,
        errorMessage: IconErrorMessage,
        timestamp: IconTimestamp,
        optimisticIconImage,
        updateIconModalActive,
        setUpdateIconModalActive,
        handleIconUpdate
    } = useUpdateIconImageForm(icon_url);

    /* お名前の編集フック */
    const {
        NameSuccess,
        errorMessage: NameErrorMessage,
        timestamp: NameTimestamp,
        optimisticName,
        updateNameModalActive,
        setUpdateNameModalActive,
        handleNameUpdate
    } = useUpdateNameForm(lastname, firstname);

    /* 電話番号の編集フック */
    const {
        TelSuccess,
        errorMessage: TelErrorMessage,
        timestamp: TelTimestamp,
        optimisticTel,
        updateTelModalActive,
        setUpdateTelModalActive,
        handleTelUpdate
    } = useUpdateTelForm(tel);

    useToastNotifications({
        success: IconSuccess,
        error: IconErrorMessage,
        successMessage: 'アイコンを更新しました',
        timestamp: IconTimestamp
    });

    useToastNotifications({
        success: NameSuccess,
        error: NameErrorMessage,
        successMessage: 'お名前を更新しました',
        timestamp: NameTimestamp
    });

    useToastNotifications({
        success: TelSuccess,
        error: TelErrorMessage,
        successMessage: '電話番号を更新しました',
        timestamp: TelTimestamp
    });

    const accountInfoData = [
        {
            id: 'icon',
            title: 'アイコン',
            content: (
                <Image 
                    src={optimisticIconImage} 
                    alt="アイコン画像" 
                    width={56} 
                    height={56} 
                    className="image-common w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full"
                />
            ),
            onClick: () => setUpdateIconModalActive(true),
            isSpecialLayout: true
        },
        {
            id: 'name',
            title: 'お名前',
            content: `${optimisticName.lastname} ${optimisticName.firstname}`,
            onClick: () => setUpdateNameModalActive(true)
        },
        {
            id: 'tel',
            title: '電話番号',
            content: optimisticTel ? optimisticTel : "未登録",
            onClick: () => setUpdateTelModalActive(true)
        },
        {
            id: 'email',
            title: 'メールアドレス',
            content: email,
            link: EDIT_EMAIL_PATH
        },
        {
            id: 'password',
            title: 'パスワード',
            content: <>
                ••••••︎
                <span className="text-xs leading-4 font-medium text-sub block">
                    ※セキュリティのため非表示
                </span>
            </>,
            link: EDIT_PASSWORD_PATH
        }
    ];

    return <>
        <div className="max-w-xl mx-auto grid gap-6 md:gap-10">
            <div className="account-info-box">
                <h3 className="account-info-title">会員情報</h3>
                <dl>
                    {accountInfoData.map((item, index) => (
                        <div key={item.id}>
                            <div className="account-info-dlbox">
                                <div className={
                                    item.isSpecialLayout ? 
                                        "flex items-center gap-3 md:gap-10" : 
                                        "account-info-dtddbox"
                                }>
                                    <dt className="account-info-dt">
                                        {item.title}
                                    </dt>
                                    <dd className="account-info-dd">
                                        {item.content}
                                    </dd>
                                </div>
                                {item.link ? (
                                    <LinkButtonPrimary
                                        link={item.link}
                                        size={BUTTON_SMALL}
                                        text={BUTTON_JA}
                                    >
                                        編集
                                    </LinkButtonPrimary>
                                ) : (
                                    <EventButtonPrimary
                                        onClick={item.onClick}
                                        size={BUTTON_SMALL}
                                        text={BUTTON_JA}
                                    >
                                        編集
                                    </EventButtonPrimary>
                                )}
                            </div>

                            {index < accountInfoData.length - 1 && (
                                <hr className="separate-border my-6" />
                            )}
                        </div>
                    ))}
                </dl>
            </div>
            
            <div className="account-info-box">
                <h3 className="account-info-title">登録住所</h3>
                <dl>
                    <div className="account-address-dlbox">
                        <div className="account-info-dtddbox">
                            <dt className="account-info-dt">お届け先住所</dt>
                            <dd className="account-info-dd">
                                {address ? <>
                                    〒{address.postal_code}<br />
                                    {address.state && address.state}
                                    {address.city && address.city}
                                    {address.address_line1 && address.address_line1}
                                    {address.address_line2 && address.address_line2}<br />
                                    {address.name}
                                </> : (
                                    "未登録"
                                )}
                            </dd>
                        </div>
                        <LinkButtonPrimary
                            link={SHIPPING_INFO_PATH}
                            customClass="account-address-btn"
                            size={BUTTON_SMALL}
                            text={BUTTON_JA}
                        >
                            編集
                        </LinkButtonPrimary>
                    </div>
                </dl>
            </div>
        </div>

        <UnderlineLink 
            href={ACCOUNT_PATH} 
            text="Back" 
            customClass="mt-10 md:mt-[64px]" 
        />

        {/* アイコン画像の編集モーダル */}
        <EditIconImageBox
            optimisticIconImage={optimisticIconImage}
            modalActive={updateIconModalActive}
            setModalActive={setUpdateIconModalActive}
            handleSaveClick={handleIconUpdate}
        />

        {/* お名前の編集モーダル */}
        <EditNameBox
            optimisticName={optimisticName}
            modalActive={updateNameModalActive}
            setModalActive={setUpdateNameModalActive}
            onConfirm={handleNameUpdate}
        />

        {/* 電話番号の編集モーダル */}
        <EditTelBox
            optimisticTel={optimisticTel}
            modalActive={updateTelModalActive}
            setModalActive={setUpdateTelModalActive}
            onConfirm={handleTelUpdate}
        />
    </>
}

export default AccountInfoContent