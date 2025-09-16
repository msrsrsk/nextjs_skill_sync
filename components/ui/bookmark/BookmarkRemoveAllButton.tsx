"use client"

import { useEffect, useState } from "react"

import ConfirmModal from "@/components/common/modals/ConfirmModal"
import useBookmark from "@/hooks/bookmark/useBookmark"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

const BookmarkRemoveAllButton = ({ 
    handleOptimisticRemoveAll 
}: { handleOptimisticRemoveAll: () => void }) => {
    const [modalActive, setModalActive] = useState(false);

    const { 
        loading, 
        error: toggleError,
        success: toggleSuccess,
        clearBookmarks,
    } = useBookmark();

    const handleRemoveAll = () => {
        clearBookmarks();
    }

    useToastNotifications({
        error: toggleError,
        timestamp: Date.now()
    });

    useEffect(() => {
        if (toggleSuccess) {
            handleOptimisticRemoveAll();
            setModalActive(false);
            showSuccessToast(BOOKMARK_ERROR.REMOVE_ALL_SUCCESS);
        }
    }, [toggleSuccess]);

    return <>
        <div className="flex justify-center md:justify-end mb-4 md:mb-5">
            <button 
                onClick={() => setModalActive(true)}
                type="button"
                className="text-sm leading-[32px] font-bold underline px-4"
                disabled={loading}
            >
                {loading ? '削除中...' : '全て削除する'}
            </button>
        </div>
    
        <ConfirmModal 
            text="全て削除してもよろしいですか？"
            modalActive={modalActive}
            setModalActive={setModalActive}
            onConfirm={handleRemoveAll}
        />
    </>
}

export default BookmarkRemoveAllButton