import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import LottieAnimation from "@/components/ui/display/LottieAnimation"
import congrats from"@/data/congrats.json"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES } from "@/constants/index"

const { BUTTON_MEDIUM } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;

interface VerifyPageContentProps {
    description: React.ReactNode;
    buttonPath: string;
    buttonText: string;
    buttonSize?: ButtonSizeType;
}

const VerifyPageContent = ({
    description,
    buttonPath,
    buttonText,
    buttonSize = BUTTON_MEDIUM,
}: VerifyPageContentProps) => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <div className="mt-6 mb-8 md:my-10 relative flex justify-center">
                <PageTitle title="Verify Account" />
                <LottieAnimation 
                    data={congrats} 
                    customClass="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                />
            </div>

            <div className="max-w-sm mx-auto relative z-10">
                <p className="attention-text text-center">
                    {description}
                </p>
                <LinkButtonPrimary
                    link={buttonPath}
                    customClass="button-space-default"
                    text={BUTTON_JA}
                    size={buttonSize}
                >
                    {buttonText}
                </LinkButtonPrimary>
            </div>
        </div>
    </>
}

export default VerifyPageContent