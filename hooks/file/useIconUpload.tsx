import { useRef, useState, useCallback } from "react"

import { showErrorToast } from "@/components/common/display/Toasts"
import { FILE_UPLOAD_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { MAX_ACCOUNT_INFO_ICON_SIZE } = FILE_UPLOAD_CONFIG;
const { USER_ERROR } = ERROR_MESSAGES;

const useIconUpload = (optimisticIconImage: UserProfileIconUrl) => {
    const [modalIconImage, setModalIconImage] = useState(optimisticIconImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_ACCOUNT_INFO_ICON_SIZE) {
            showErrorToast(USER_ERROR.FILE_SIZE_EXCEEDED);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setModalIconImage(e.target?.result as string);
        }
        reader.readAsDataURL(file);
    }, []);

    const triggerIconUpload = () => {
        fileInputRef.current?.click();
    };

    return {
        fileInputRef,
        handleFileChange,
        triggerIconUpload,
        modalIconImage,
        setModalIconImage
    }
}

export default useIconUpload