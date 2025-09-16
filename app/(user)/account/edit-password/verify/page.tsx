import { Metadata } from "next"

import VerifyPageContent from "@/components/ui/auth/VerifyPageContent"
import { generatePageMetadata } from "@/lib/metadata/page"
import { BUTTON_SIZES, SITE_MAP } from "@/constants/index"
import { USER_METADATA } from "@/constants/metadata/user"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { ACCOUNT_INFO_PATH } = SITE_MAP;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.EDIT_PASSWORD_VERIFY
})

const EditEmailVerifyPage = () => {
    return (
        <VerifyPageContent 
            description={<>パスワードの変更が完了しました。</>}
            buttonPath={ACCOUNT_INFO_PATH}
            buttonText="お客様情報に戻る"
            buttonSize={BUTTON_LARGE}
        />
    )
}

export default EditEmailVerifyPage