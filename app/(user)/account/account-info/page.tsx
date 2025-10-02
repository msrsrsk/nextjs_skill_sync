import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import AccountInfoContent from "@/components/ui/auth/AccountInfoContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { generatePageMetadata } from "@/lib/metadata/page"
import { requireServerAuth } from "@/lib/middleware/auth"
import { getUserRepository } from "@/repository/user"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { USER_METADATA } from "@/constants/metadata/user"

const { USER_ERROR } = ERROR_MESSAGES;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.ACCOUNT_INFO
})

const AccountInfoPage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Account Info" 
                customClass="mt-6 mb-10 md:mt-10 md:mb-[56px]" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <AccountInfoWrapper />
            </Suspense>
        </div>
    </>
}

const AccountInfoWrapper = async () => {
    const { userId } = await requireServerAuth();

    const repository = getUserRepository();
    const userResult = await repository.getUserById({ userId });
    // const userResult = undefined;

    if (!userResult) {
        return <ErrorMessage message={USER_ERROR.FETCH_FAILED} />
    }

    return (
        <AccountInfoContent 
            user={userResult as UserWithShippingAddresses}
        />
    )
}

export default AccountInfoPage