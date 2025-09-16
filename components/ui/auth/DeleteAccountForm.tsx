import PendingContent from "@/components/common/buttons/PendingContent"
import { EventButtonPrimary, LinkButtonSecondary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, BUTTON_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { ACCOUNT_PATH } = SITE_MAP;

interface DeleteAccountFormProps {
    isAllChecked: boolean;
    isDeleting: boolean;
    deleteAccount: () => Promise<void>;
    isUnshippedOrders: boolean;
}

const DeleteAccountForm = ({ 
    isAllChecked, 
    isDeleting, 
    deleteAccount,
    isUnshippedOrders
}: DeleteAccountFormProps) => {

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAllChecked) return;
        await deleteAccount();
    }

    const isDisabled = !isAllChecked || isDeleting || isUnshippedOrders;

    return (
        <form 
            onSubmit={handleDeleteAccount} 
            className="button-space-default flex items-center justify-center gap-4 md:gap-6"
        >
            <LinkButtonSecondary
                link={ACCOUNT_PATH}
            >
                戻る
            </LinkButtonSecondary>

            <EventButtonPrimary
                text={BUTTON_JA}
                type={SUBMIT_TYPE}
                disabled={isDisabled}
            >
                <PendingContent 
                    pending={isDeleting} 
                    text="退会する" 
                />
            </EventButtonPrimary>
        </form>
    )
}

export default DeleteAccountForm