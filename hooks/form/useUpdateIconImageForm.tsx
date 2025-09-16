import { useEffect, useState, useCallback } from "react"
import { useFormState } from "react-dom"

import { updateIconImageAction } from "@/lib/services/user/actions"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ALREADY_SAVED_MESSAGE } = ERROR_MESSAGES;

const useUpdateIconImageForm = (icon_url: string) => {
    const [optimisticIconImage, setOptimisticIconImage] = useState(icon_url);
    const [updateIconModalActive, setUpdateIconModalActive] = useState(false);

    const [updateIconState, updateIconFormAction] = useFormState((
        prevState: ActionStateWithTimestamp, 
        formData: FormData
    ) => updateIconImageAction(prevState, formData, optimisticIconImage), { 
        success: false, 
        error: null,
        data: icon_url,
        timestamp: 0
    })

    const isIconChanged = useCallback((icon_url: string) => {
        return icon_url !== optimisticIconImage;
    }, [optimisticIconImage])

    const handleIconUpdate = useCallback((icon_url: UserIconUrl) => {
        if (!isIconChanged(icon_url)) {
            setUpdateIconModalActive(false);
            showSuccessToast(ALREADY_SAVED_MESSAGE);
            return;
        }
        
        const formData = new FormData();
        formData.append('icon_url', icon_url);
        updateIconFormAction(formData);
    }, [isIconChanged, updateIconFormAction])

    useEffect(() => {
        if (updateIconState.success && updateIconState.data) {
            setOptimisticIconImage(updateIconState.data);
            setUpdateIconModalActive(false);
        } else if (updateIconState.error) {
            setUpdateIconModalActive(false);
        }
    }, [updateIconState]);

    return {
        IconSuccess: updateIconState.success,
        errorMessage: updateIconState.error,
        timestamp: updateIconState.timestamp,
        optimisticIconImage,
        setOptimisticIconImage,
        updateIconModalActive,
        setUpdateIconModalActive,
        handleIconUpdate,
    }
}

export default useUpdateIconImageForm