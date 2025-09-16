import ContactStatus from "@/components/common/forms/ContactStatus"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, CONTACT_STEPS, SITE_MAP } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { COMPLETE } = CONTACT_STEPS;
const { CATEGORY_PATH } = SITE_MAP;

const ContactThanks = () => {
    return (
        <div className="contact-form-wrapper">
            <ContactStatus activeStep={COMPLETE} />

            <div>
                <p className="text-sm md:text-base leading-[28px] font-medium text-center">
                    お問い合わせいただきありがとうございます。<br />
                    メッセージが送信されました。
                </p>
                <LinkButtonPrimary
                    link={CATEGORY_PATH}
                    customClass="button-space-default"
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                >
                    商品一覧へ
                    <MoreIcon customClass="mt-[2px]" />
                </LinkButtonPrimary>
            </div>
        </div>
    )
}

export default ContactThanks