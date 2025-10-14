"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import { Metadata } from "next"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { showErrorToast } from "@/components/common/display/Toasts"
import { generatePageMetadata } from "@/lib/metadata/page"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"
import { MAIN_METADATA } from "@/constants/metadata/main"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { HOME_PATH } = SITE_MAP;
const { AUTH_ERROR } = ERROR_MESSAGES;

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.NOT_FOUND
})

const NotFound = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (error === 'auth_required') {
            showErrorToast(AUTH_ERROR.USER_NOT_FOUND);
        }
    }, [error]);
    
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Not Found (404)" 
                customClass="mt-6 mb-8 md:my-10" 
            />

            <div className="max-w-sm mx-auto">
                <div>
                    <p className="attention-text text-center">
                        指定されたページが見つかりません
                    </p>
                    <LinkButtonPrimary
                        link={HOME_PATH}
                        size={BUTTON_LARGE}
                        text={BUTTON_JA}
                        customClass="button-space-default"
                    >
                        トップページに戻る
                    </LinkButtonPrimary>
                </div>
            </div>
        </div>
    </>
}

export default NotFound