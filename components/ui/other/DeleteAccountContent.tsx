"use client"

import { useEffect } from "react"

import DeleteAccountForm from "@/components/ui/auth/DeleteAccountForm"
import AgreementCheckboxes from "@/components/ui/form/AgreementCheckboxes"
import useAgreements from "@/hooks/form/useAgreements"
import useDeleteAccount from "@/hooks/auth/useDeleteAccount"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import AlertBox from "@/components/common/forms/AlertBox"
import { deleteAccountCheckList } from "@/data"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR } = ERROR_MESSAGES;

const DeleteAccountContent = ({ 
    unshippedOrdersCount 
}: { unshippedOrdersCount: number }) => {
    const { 
        agreements, 
        handleAgreementChange, 
        isAllChecked, 
        resetAgreements 
    } = useAgreements({ checkList: deleteAccountCheckList });
    
    const { 
        loading,
        error, 
        timestamp, 
        deleteAccount 
    } = useDeleteAccount();

    useEffect(() => {
        if (error) {
            resetAgreements();
        }
    }, [error]);

    useToastNotifications({
        error: error,
        timestamp: timestamp
    });

    const isUnshippedOrders = unshippedOrdersCount > 0;

    return (
        <div className="max-w-2xl mx-auto">
            <p className="legal-subtitle">
                退会手続き
            </p>

            {isUnshippedOrders && (
                <div className="mb-4 md:mb-6">
                    <AlertBox 
                        message={USER_ERROR.UNSHIPPED_ORDERS_COUNT_WARNING} 
                        showError={isUnshippedOrders}
                    />
                </div>
            )}

            <p className="text-sm md:text-base font-medium leading-6 text-center mb-5 md:mb-6">
                下記項目をご確認の上、<br className="md:hidden" />
                チェックを入れてお進みください
            </p>

            <AgreementCheckboxes 
                checkList={deleteAccountCheckList}
                agreements={agreements}
                onAgreementChange={handleAgreementChange}
                isUnshippedOrders={isUnshippedOrders}
            />

            <DeleteAccountForm 
                isAllChecked={isAllChecked} 
                isDeleting={loading}
                deleteAccount={deleteAccount}
                isUnshippedOrders={isUnshippedOrders}
            />
        </div>
    )
}

export default DeleteAccountContent