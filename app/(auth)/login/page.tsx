"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import AuthenticateFormContent from "@/components/ui/auth/AuthenticateFormContent"
import useSignInForm from "@/hooks/form/useSignInForm"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { showErrorToast } from "@/components/common/display/Toasts"
import { 
    AUTH_TYPES, 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    LOGIN_REDIRECT_TIMEOUT,
    SITE_MAP 
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { AUTH_LOGIN } = AUTH_TYPES;
const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { CREATE_ACCOUNT_PATH, ACCOUNT_PATH } = SITE_MAP;
const { AUTH_ERROR } = ERROR_MESSAGES;

const SignInPage = ({ 
    searchParams 
}: { searchParams: { callbackUrl: string } }) => {
    const { callbackUrl } = searchParams;
    const { update } = useSession();
    const router = useRouter();
    const searchParamsHook = useSearchParams();

    const {
        signInSuccess,
        errorMessage,
        timestamp,
        SignInFormAction,
    } = useSignInForm(AUTH_LOGIN);

    useEffect(() => {
        const redirectTo = searchParamsHook.get('redirectTo');
        
        if (redirectTo 
            && (redirectTo.includes('cart') 
            || redirectTo.includes('book-mark'))
        ) {
            const timer = setTimeout(() => {
                showErrorToast(AUTH_ERROR.REQUIRED_LOGIN);
            }, LOGIN_REDIRECT_TIMEOUT);
            
            return () => clearTimeout(timer);
        }
    }, [searchParamsHook]);

    useEffect(() => {
        if (!signInSuccess) return;

        if (callbackUrl) {
            update().then(() => router.push(callbackUrl));
        } else {
            update().then(() => router.push(ACCOUNT_PATH));
        };
    }, [signInSuccess]);

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Login" 
                customClass="mt-6 mb-8 md:my-10" 
            />

            <div className="max-w-sm mx-auto">
                <AuthenticateFormContent
                    formAction={SignInFormAction}
                    errorMessage={errorMessage}
                    signInTimestamp={timestamp}
                    buttonText="ログイン"
                />

                <div className="text-divider my-6 md:my-8">
                    <p>または</p>
                </div>

                <p className="text-center text-sm leading-8 font-medium">
                    まだアカウントをお持ちでない方
                </p>
                
                <LinkButtonPrimary
                    link={CREATE_ACCOUNT_PATH}
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                    customClass="mt-4"
                >
                    アカウントを作成
                </LinkButtonPrimary>
            </div>
        </div>
    </>
}

export default SignInPage