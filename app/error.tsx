"use client"

import { Send } from "lucide-react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import { LinkButtonPrimary, LinkButtonSecondary } from "@/components/common/buttons/Button"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { HOME_PATH, CONTACT_PATH } = SITE_MAP;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;

const ErrorPage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Error (500)"
                 customClass="mt-6 mb-8 md:my-10" 
            />

            <div className="max-w-sm mx-auto">
                <div>
                    <p className="attention-text text-center">
                        一時的な問題が発生しました<br />
                        時間をおいて再度お試しください
                    </p>
                    <div>
                        <LinkButtonPrimary
                            link={HOME_PATH}
                            customClass="button-space-default"
                            size={BUTTON_LARGE}
                            text={BUTTON_JA}
                        >
                            トップページに戻る
                        </LinkButtonPrimary>
                        <LinkButtonSecondary
                            link={CONTACT_PATH}
                            customClass="mt-6"
                        >
                            Contact
                            <Send className="w-[18px] h-[18px]" strokeWidth={2} />
                        </LinkButtonSecondary>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ErrorPage