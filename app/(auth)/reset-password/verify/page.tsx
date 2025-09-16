import { Metadata } from "next"

import VerifyPageContent from "@/components/ui/auth/VerifyPageContent"
import { generatePageMetadata } from "@/lib/metadata/page"
import { SITE_MAP } from "@/constants/index"
import { ACCOUNT_METADATA } from "@/constants/metadata/auth"

const { LOGIN_PATH } = SITE_MAP;

export const metadata: Metadata = generatePageMetadata({
    ...ACCOUNT_METADATA.RESET_PASSWORD_VERIFY
})

const ResetPasswordVerifyPage = () => {
    return (
        <VerifyPageContent 
            description={<>
                パスワードの変更が完了しました。<br />
                以下のボタンからログインしてください。
            </>}
            buttonPath={LOGIN_PATH}
            buttonText="ログイン"
        />
    )
}

export default ResetPasswordVerifyPage