import { Metadata } from "next"

import VerifyContentWithStatus from "@/components/ui/auth/VerifyContentWithStatus"
import { generatePageMetadata } from "@/lib/metadata/page"
import { BUTTON_SIZES, VERIFY_EMAIL_TYPES, SITE_MAP } from "@/constants/index"
import { USER_METADATA } from "@/constants/metadata/user"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { VERIFY_UPDATE_EMAIL } = VERIFY_EMAIL_TYPES;
const { EDIT_EMAIL_PATH, ACCOUNT_INFO_PATH } = SITE_MAP;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.EDIT_EMAIL_VERIFY
})

const EditEmailVerifyPage = () => {
    return (
        <VerifyContentWithStatus
            verifyEmailType={VERIFY_UPDATE_EMAIL}
            errorButtonPath={EDIT_EMAIL_PATH}
            errorButtonText="パスワード変更に戻る"
            successDescription={<>メールアドレスの変更が完了しました。</>}
            successButtonPath={ACCOUNT_INFO_PATH}
            successButtonText="お客様情報に戻る"
            successButtonSize={BUTTON_LARGE}
        />
    )
}

export default EditEmailVerifyPage