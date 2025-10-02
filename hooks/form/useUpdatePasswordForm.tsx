import { useEffect, useMemo } from "react"
import { useFormState } from "react-dom"

import { updatePasswordAction } from "@/services/auth/actions"
import { SITE_MAP, UPDATE_PASSWORD_PAGE_TYPES } from "@/constants/index"

const { RESET_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { RESET_PASSWORD_VERIFY_PATH, EDIT_PASSWORD_VERIFY_PATH } = SITE_MAP;

const useUpdatePasswordForm = (type: UpdatePasswordPageType) => {
    const [updateState, updateFormAction]  = useFormState((
        prevState: ActionStateWithEmailAndTimestamp, 
        formData: FormData
    ) => updatePasswordAction(prevState, formData, type), { 
        success: false, 
        error: null,
        timestamp: 0
    })

    const redirectPath = useMemo(() => 
        type === RESET_PASSWORD_PAGE ? RESET_PASSWORD_VERIFY_PATH : EDIT_PASSWORD_VERIFY_PATH, 
        [type]
    )

    useEffect(() => {
        if (updateState.success) {
            window.location.href = `${redirectPath}?token=success`;
        }
    }, [updateState, redirectPath])

    return {
        updateSuccess: updateState.success,
        errorMessage: updateState.error,
        timestamp: updateState.timestamp,
        updateFormAction,
    }
}

export default useUpdatePasswordForm