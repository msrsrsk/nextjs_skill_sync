"use client"

import PageTitle from "@/components/common/display/PageTitle"
import usePageScrollReset from "@/hooks/layout/usePageScrollReset"
import { EventButtonPrimary, LinkButtonPrimary } from "@/components/common/buttons/Button"
import { 
    EMAIL_VERIFICATION_TOKEN_CONFIG, 
    BUTTON_SIZES,
    BUTTON_TEXT_TYPES 
} from "@/constants/index"

const { EXPIRATION_TEXT } = EMAIL_VERIFICATION_TOKEN_CONFIG;
const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;

interface EmailSentProps {
    email: UserEmail;
    success: boolean;
    pathname?: string;
    buttonText: string;
}

const EmailSent = ({ 
    email, 
    success, 
    pathname,
    buttonText 
}: EmailSentProps) => {
    usePageScrollReset({
        dependencies: [success],
        condition: !!success && !!email
    });

    return <>
        <PageTitle 
            title="Email Sent" 
            customClass="mt-6 mb-8 md:my-10" 
        />

        <div className="max-w-sm mx-auto">
            <p className="attention-text text-center">
                {email} 宛に<br />
                認証メールを送信しました。<br />
                {EXPIRATION_TEXT}時間以内に認証を完了してください。
            </p>

            {pathname ? (
                <LinkButtonPrimary
                    link={pathname}
                    customClass="button-space-default"
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                >
                    {buttonText}に戻る
                </LinkButtonPrimary>
            ) : (
                <EventButtonPrimary
                    customClass="button-space-default"
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                    onClick={() => window.location.reload()}
                >
                    {buttonText}に戻る
                </EventButtonPrimary>
            )}
        </div>
    </>
}

export default EmailSent