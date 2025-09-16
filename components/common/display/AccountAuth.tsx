import { UserRound } from "lucide-react"

import IconBox from "@/components/common/icons/IconBox"
import useAuth from "@/hooks/auth/useAuth"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { LOGIN_PATH, ACCOUNT_PATH } = SITE_MAP;

const AccountIcon = () => {
    const { isAuthenticated } = useAuth();

    return <>
        <IconBox 
            link={isAuthenticated ? ACCOUNT_PATH : LOGIN_PATH} 
            label={isAuthenticated ? 'Account' : 'Login'} 
        >
            <UserRound className="w-6 h-6 md:w-7 md:h-7" />
        </IconBox>
    </>
}

const AccountButton = () => {
    const { isAuthenticated } = useAuth();

    return (
        <LinkButtonPrimary
            link={isAuthenticated ? ACCOUNT_PATH : LOGIN_PATH}
            text={BUTTON_JA}
            customClass="mb-6"
        >
            {isAuthenticated ? "アカウント" : "ログイン"}
            <UserRound 
                width={20} 
                height={20} 
                strokeWidth={2.2} 
            />
        </LinkButtonPrimary>
    )
}

export { AccountIcon, AccountButton }