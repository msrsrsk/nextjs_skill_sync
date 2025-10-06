import Image from "next/image"
import { useEffect } from "react"
import { useFormStatus } from "react-dom"

import Modal from "@/components/common/modals/Modal"
import PendingContent from "@/components/common/buttons/PendingContent"
import useIconUpload from "@/hooks/file/useIconUpload"
import { accountInfoIconImages } from "@/data"
import { EventButtonPrimary, EventButtonSecondary } from "@/components/common/buttons/Button"
import { 
    FILE_UPLOAD_CONFIG, 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES,
    FILE_MIME_TYPES
} from "@/constants/index"

const { MAX_ACCOUNT_INFO_ICON_SIZE_TEXT } = FILE_UPLOAD_CONFIG;
const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { IMAGE_JPEG, IMAGE_JPG, IMAGE_PNG } = FILE_MIME_TYPES;

interface EditIconImageBoxProps extends ModalStateProps {
    optimisticIconImage: UserProfileIconUrl;
    handleSaveClick: (icon_url: UserProfileIconUrl) => void;
}

interface SaveButtonProps {
    modalIconImage: UserProfileIconUrl;
    handleSaveClick: (icon_url: UserProfileIconUrl) => void;
}

const EditIconImageBox = ({ 
    optimisticIconImage,
    modalActive,
    setModalActive,
    handleSaveClick
}: EditIconImageBoxProps) => {
    const { 
        fileInputRef, 
        handleFileChange, 
        triggerIconUpload,
        modalIconImage,
        setModalIconImage
    } = useIconUpload(optimisticIconImage);

    useEffect(() => {
        if (modalActive) {
            setModalIconImage(optimisticIconImage);
        }
    }, [modalActive]);

    return (
        <Modal
            modalActive={modalActive}
            setModalActive={setModalActive}
        >
            <p className="account-modal-title">新しいアイコンを選択してください</p>

            <form>
                <input 
                    type="hidden" 
                    name="icon_url" 
                    value={modalIconImage} 
                />

                <div className="flex justify-center mb-5 md:mb-8">
                    <Image 
                        src={modalIconImage} 
                        alt="アイコン画像" 
                        width={160} 
                        height={160} 
                        className="image-common max-w-[120px] md:max-w-[160px]"
                    />
                </div>

                <div className="grid grid-cols-5 gap-x-3 gap-y-4 md:gap-x-6 md:gap-y-6 max-w-[376px] mx-auto">
                    {accountInfoIconImages.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setModalIconImage(image.src)}
                            aria-label={`アイコン画像${index + 1}を選択`}
                            className={`account-modal-iconbtn${
                                modalIconImage === image.src ? ' is-active' : ''
                            }`}
                        >
                            <Image 
                                key={image.title}
                                src={image.src}
                                alt={image.title}
                                width={56} 
                                height={56} 
                                className="image-common"
                            />
                        </button>
                    ))}
                </div>

                <div className="text-divider my-4 md:my-6">
                    <p className="!bg-soft-white">または</p>
                </div>

                <input 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    type="file" 
                    accept={`${IMAGE_JPEG}, ${IMAGE_JPG}, ${IMAGE_PNG}`}
                    className="hidden" 
                />
                <EventButtonSecondary
                    onClick={triggerIconUpload}
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                >
                    ファイルを選択
                </EventButtonSecondary>

                <p className="small-note mt-3">
                    ※対応形式：JPG/JPEG/PNG（最大{MAX_ACCOUNT_INFO_ICON_SIZE_TEXT}まで）
                </p>

                <SaveButton 
                    modalIconImage={modalIconImage}
                    handleSaveClick={handleSaveClick}
                />
            </form>
        </Modal>
    )
}

const SaveButton = ({ modalIconImage, handleSaveClick }: SaveButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            text={BUTTON_JA}
            customClass="mt-6"
            disabled={pending}
            onClick={() => handleSaveClick(modalIconImage)}
        >
            <PendingContent pending={pending} text="保存する" />
        </EventButtonPrimary>
    )
}

export default EditIconImageBox