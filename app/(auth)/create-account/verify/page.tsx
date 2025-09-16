import { Metadata } from "next"

import VerifyContentWithStatus from "@/components/ui/auth/VerifyContentWithStatus"
import { generatePageMetadata } from "@/lib/metadata/page"
import { VERIFY_EMAIL_TYPES, SITE_MAP } from "@/constants/index"
import { ACCOUNT_METADATA } from "@/constants/metadata/auth"

const { VERIFY_CREATE_ACCOUNT } = VERIFY_EMAIL_TYPES;
const { 
    CREATE_ACCOUNT_PATH, 
    LOGIN_PATH 
} = SITE_MAP;

export const metadata: Metadata = generatePageMetadata({
    ...ACCOUNT_METADATA.CREATE_ACCOUNT_VERIFY
})

const AccountVerifyPage = () => {
    return (
        <VerifyContentWithStatus
            verifyEmailType={VERIFY_CREATE_ACCOUNT}
            errorButtonPath={CREATE_ACCOUNT_PATH}
            errorButtonText="アカウント作成に戻る"
            successDescription={<>
                アカウントの登録が完了しました。<br />
                以下のボタンからログインしてください。
            </>}
            successButtonPath={LOGIN_PATH}
            successButtonText="ログイン"
        />
    )
}

export default AccountVerifyPage