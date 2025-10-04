import { useEffect, useState, useCallback } from "react"
import { useFormState } from "react-dom"

import { createReviewAction } from "@/services/review/form-actions"

const useReviewSubmissionForm = () => {
    const [createState, createFormAction] = useFormState(createReviewAction, { 
        success: false, 
        error: null,
        timestamp: 0
    })

    const [postModalActive, setPostModalActive] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (createState.error || createState.success) {
            setPostModalActive(false);
        }
        if (createState.success) {
            setShowSuccessModal(true);
        }
    }, [createState])

    const handleSubmit = useCallback((formData: FormData, files: File[]) => {
        files.forEach(file => {
            formData.append('files', file);
        });
        
        createFormAction(formData);
    }, [createFormAction])

    return {
        errorMessage: createState.error,
        timestamp: createState.timestamp,
        handleSubmit,
        postModalActive,
        setPostModalActive,
        showSuccessModal,
        setShowSuccessModal,
    }
}

export default useReviewSubmissionForm