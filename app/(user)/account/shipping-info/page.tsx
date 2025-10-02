import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ShippingInfoContent from "@/components/ui/other/ShippingInfoContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { generatePageMetadata } from "@/lib/metadata/page"
import { requireServerAuth } from "@/lib/middleware/auth"
import { getShippingAddressRepository } from "@/repository/shippingAddress"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { USER_METADATA } from "@/constants/metadata/user"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.SHIPPING_INFO
})

const ShippingInfoPage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Shipping Info" 
                customClass="mt-6 mb-10 md:mt-10 md:mb-[56px]" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <ShippingInfoWrapper />
            </Suspense>
        </div>
    </>
}

const ShippingInfoWrapper = async () => {
    const { userId } = await requireServerAuth();

    const repository = getShippingAddressRepository();
    const { data } = await repository.getUserAllShippingAddresses({ userId });
    // const { data } = { data: undefined };

    if (!data) {
        return <ErrorMessage message={SHIPPING_ADDRESS_ERROR.ALL_FETCH_FAILED} />
    }

    return (
        <ShippingInfoContent shippingAddressesData={data} />
    )
}

export default ShippingInfoPage