import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import { generatePageMetadata } from "@/lib/metadata/page"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"
import { ACCOUNT_METADATA } from "@/constants/metadata/auth"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { HOME_PATH } = SITE_MAP;

export const metadata: Metadata = generatePageMetadata({
    ...ACCOUNT_METADATA.DELETE_ACCOUNT_PUBLIC
})

const PublicDeleteAccount = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Delete Account" 
                customClass="mt-6 mb-8 md:mt-10 md:mb-10" 
            />

            <div className="max-w-sm mx-auto">
                <p className="attention-text text-center">
                    退会手続きが完了しました。<br />
                    またの再会をお待ちしております。
                </p>
                <LinkButtonPrimary
                    link={HOME_PATH}
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                    customClass="button-space-default"
                >
                    トップページへ
                    <MoreIcon />
                </LinkButtonPrimary>
            </div>
        </div>
    </>
}

export default PublicDeleteAccount