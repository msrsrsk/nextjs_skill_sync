import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import SupportChatContent from "@/components/ui/other/SupportChatContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { generatePageMetadata } from "@/lib/metadata/page"
import { requireServerAuth } from "@/lib/middleware/auth"
import { getChatRoomRepository } from "@/repository/chatRoom"
import { BUSINESS_HOURS_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { USER_METADATA } from "@/constants/metadata/user"

const { HOURS_TIME, HOURS_NOTE } = BUSINESS_HOURS_CONFIG;
const { CHAT_ERROR } = ERROR_MESSAGES;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.SUPPORT_CHAT
})

const SupportChatPage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Support Chat" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <SupportChatWrapper />
            </Suspense>
        </div>
    </>
}

const SupportChatWrapper = async () => {
    const { userId } = await requireServerAuth();

    const chatRoomRepository = getChatRoomRepository();
    const chatResult = await chatRoomRepository.getChatRoom({ userId });
    // const chatResult = undefined;

    if (!chatResult) {
        return <ErrorMessage message={CHAT_ERROR.FETCH_FAILED} />
    }

    const { chats, user } = chatResult;

    return <>
        <div className="text-center flex flex-col md:flex-row justify-center mb-6 md:mb-10">
            <p className="text-base md:text-lg leading-[24px] md:leading-[30px] font-medium">
                営業時間：
                <span className="ml-2 text-lg md:text-xl leading-[22px] md:leading-[28px] font-semibold font-poppins">
                    {HOURS_TIME}
                </span>
            </p>
            <p className="text-sm leading-[24px] md:leading-[30px] font-medium text-sub">
                {HOURS_NOTE}
            </p>
        </div>

        <SupportChatContent chats={chats} user={user} />
    </>
}

export default SupportChatPage