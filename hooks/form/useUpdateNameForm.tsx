import { useEffect, useState, useCallback } from "react"
import { useFormState } from "react-dom"

import { updateNameAction } from "@/services/user/server-actions"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ALREADY_SAVED_MESSAGE } = ERROR_MESSAGES;

const useUpdateNameForm = (lastname: UserLastname, firstname: UserFirstname) => {
    const [updateNameState, updateNameFormAction] = useFormState(updateNameAction, { 
        success: false, 
        error: null,
        data: {
            lastname: lastname,
            firstname: firstname
        },
        timestamp: 0
    })

    const [optimisticName, setOptimisticName] = useState({ lastname,firstname });
    const [updateNameModalActive, setUpdateNameModalActive] = useState(false);

    const isNameChanged = useCallback((formData: FormData) => {
        const lastName = formData.get('lastname') as string;
        const firstName = formData.get('firstname') as string;

        return lastName !== optimisticName.lastname || 
               firstName !== optimisticName.firstname;
    }, [optimisticName])

    const handleNameUpdate = useCallback((formData: FormData) => {
        if (!isNameChanged(formData)) {
            setUpdateNameModalActive(false);
            showSuccessToast(ALREADY_SAVED_MESSAGE);
            return;
        }
        updateNameFormAction(formData);
    }, [isNameChanged, updateNameFormAction])

    useEffect(() => {
        if (updateNameState.success && updateNameState.data) {
            if (updateNameState.data.lastname && updateNameState.data.firstname) {
                setOptimisticName({
                    lastname: updateNameState.data.lastname,
                    firstname: updateNameState.data.firstname
                });
            }
            setUpdateNameModalActive(false);
        } else if (updateNameState.error) {
            setUpdateNameModalActive(false);
        }
    }, [updateNameState])

    return {
        NameSuccess: updateNameState.success,
        errorMessage: updateNameState.error,
        timestamp: updateNameState.timestamp,
        optimisticName,
        setOptimisticName,
        updateNameModalActive,
        setUpdateNameModalActive,
        handleNameUpdate,
    }
}

export default useUpdateNameForm