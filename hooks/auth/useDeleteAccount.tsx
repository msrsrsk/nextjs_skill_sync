import { useState } from "react"

import useAuth from "@/hooks/auth/useAuth"
import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { DELETE_ACCOUNT_PUBLIC_PATH, USER_API_PATH } = SITE_MAP;
const { USER_ERROR } = ERROR_MESSAGES;

const useDeleteAccount = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState(0);
    
    const { signOut } = useAuth();

    const deleteAccount = async () => {
        if (loading) return;

        setLoading(true)
        setError(null)

        try {
            // throw new Error('test error');

            const response = await fetch(USER_API_PATH, {
                method: 'DELETE'
            });

            const userResult = await response.json();
            
            if (userResult.success) {
                await signOut();
                window.location.href = `${DELETE_ACCOUNT_PUBLIC_PATH}?token=success`;
            } else {
                setError(userResult.message);
                setTimestamp(Date.now());
            }
        } catch (error) {
            console.error('Hook Error - Delete Account error:', error);
            setError(USER_ERROR.DELETE_FAILED);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        timestamp,
        deleteAccount
    }
}

export default useDeleteAccount