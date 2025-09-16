import { Suspense } from "react"

import SectionTitle from "@/components/common/display/SectionTitle"
import SyncLogSectionContent from "@/components/ui/other/SyncLogSectionContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getAllSyncLogLists } from "@/lib/services/microcms/actions"
import { SYNC_LOG_DISPLAY_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SECTION_LIMIT } = SYNC_LOG_DISPLAY_CONFIG;
const { LOG_ERROR } = ERROR_MESSAGES;

const SyncLogSection = () => {
    return (
        <section className="c-container">
            <SectionTitle 
                title="The Sync Log" 
                customClass="mb-6 md:mb-10 mr-5 md:mr-0" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <SyncLogSectionWrapper />
            </Suspense>
        </section>
    )
}

const SyncLogSectionWrapper = async () => {
    const { data, error } = await getAllSyncLogLists(SECTION_LIMIT);
    // const { data, error } = { data: undefined, error: undefined };

    if (error) return <ErrorMessage message={error} />
    if (!data) return <ErrorMessage message={LOG_ERROR.FETCH_FAILED} />

    return (
        <SyncLogSectionContent categoryData={{logLists: data}} />
    )
}

export default SyncLogSection