import { Suspense } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import DeleteAccountContent from "@/components/ui/other/DeleteAccountContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { requireServerAuth } from "@/lib/middleware/auth"
import { getUnshippedOrdersCountData } from "@/lib/database/prisma/actions/orders"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR } = ERROR_MESSAGES;

const PrivateDeleteAccount = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Delete Account" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <DeleteAccountWrapper />
            </Suspense>
        </div>
    </>
}

const DeleteAccountWrapper = async () => {
    const { userId } = await requireServerAuth();

    const unshippedOrdersCount = await getUnshippedOrdersCountData({ userId });

    if (unshippedOrdersCount === null || unshippedOrdersCount === undefined) return (
        <ErrorMessage message={USER_ERROR.UNSHIPPED_ORDERS_COUNT_MISSING_DATA} />
    )

    return (
        <DeleteAccountContent 
            unshippedOrdersCount={unshippedOrdersCount}
        />
    )
}

export default PrivateDeleteAccount