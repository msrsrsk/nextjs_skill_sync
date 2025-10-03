import { useEffect, useState, useCallback } from "react"
import { useFormState } from "react-dom"

import { updateTelAction } from "@/services/user/server-actions"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ALREADY_SAVED_MESSAGE } = ERROR_MESSAGES;

const useUpdateTelForm = (tel: UserTel) => {
    const [updateTelState, updateTelFormAction] = useFormState(updateTelAction, { 
        success: false, 
        error: null,
        data: null,
        timestamp: 0
    });

    const [optimisticTel, setOptimisticTel] = useState(tel);
    const [updateTelModalActive, setUpdateTelModalActive] = useState(false);

    const isTelChanged = useCallback((formData: FormData) => {
        const tel = formData.get('tel') as string;
        return tel !== optimisticTel;
    }, [optimisticTel])

    const handleTelUpdate = useCallback((formData: FormData) => {
        if (!isTelChanged(formData)) {
            setUpdateTelModalActive(false);
            showSuccessToast(ALREADY_SAVED_MESSAGE);
            return;
        }
        updateTelFormAction(formData);
    }, [isTelChanged, updateTelFormAction])

    useEffect(() => {
        if (updateTelState.success && updateTelState.data) {
            setOptimisticTel(updateTelState.data);
            setUpdateTelModalActive(false);
        } else if (updateTelState.error) {
            setUpdateTelModalActive(false);
        }
    }, [updateTelState]);

    return {
        TelSuccess: updateTelState.success,
        errorMessage: updateTelState.error,
        timestamp: updateTelState.timestamp,
        optimisticTel,
        setOptimisticTel,
        updateTelModalActive,
        setUpdateTelModalActive,
        handleTelUpdate,
    };
};

export default useUpdateTelForm