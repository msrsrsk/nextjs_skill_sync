import Link from "next/link"

import { 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    BUTTON_POSITIONS,
    BUTTON_TYPES,
    BUTTON_VARIANTS
} from "@/constants/index"

const { BUTTON_SMALL, BUTTON_MEDIUM } = BUTTON_SIZES;
const { BUTTON_EN } = BUTTON_TEXT_TYPES;
const { POSITION_CENTER, POSITION_LEFT } = BUTTON_POSITIONS;
const { BUTTON_TYPE } = BUTTON_TYPES;
const { BUTTON_PRIMARY, BUTTON_SECONDARY } = BUTTON_VARIANTS;

interface BaseButtonProps {
    children: React.ReactNode;
    ariaLabel?: string;
    customClass?: string;
    size?: ButtonSizeType;
    text?: ButtonTextType;
    position?: ButtonPositionType;
    variant?: ButtonVariantType;
}

interface LinkButtonProps extends BaseButtonProps {
    link: string;
    isExternal?: boolean;
}

interface EventButtonProps extends BaseButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: ButtonType;
    disabled?: boolean;
}

const LinkButton = ({ 
    children, 
    link = "/", 
    ariaLabel = "",
    customClass, 
    size = BUTTON_MEDIUM, 
    text = BUTTON_EN,
    position = POSITION_CENTER,
    isExternal = false,
    variant = BUTTON_PRIMARY
}: LinkButtonProps) => {
    return (
        <div className={`${
            position === POSITION_CENTER ? ` text-center` : 
            position === POSITION_LEFT ? " text-left" : " text-right"
        }`}>
            <Link 
                href={link} 
                className="inline-block"
                target={isExternal ? "_blank" : "_self"}
                rel={isExternal ? "noopener noreferrer" : undefined}
            >
                <button 
                    className={`${
                        variant === BUTTON_PRIMARY ? "button-primary" : "button-secondary"}${
                        size === BUTTON_SMALL ? " button-small" : 
                        size === BUTTON_MEDIUM ? " button-medium" : " button-large"}${
                        text === BUTTON_EN ? " font-poppins" : ""}${
                        customClass ? ` ${customClass}` : ''
                    }`}
                    aria-label={ariaLabel}
                >
                    {children}
                </button>
            </Link>
        </div>
    );
};

const EventButton = ({ 
    children, 
    onClick,
    customClass, 
    size = BUTTON_MEDIUM, 
    text = BUTTON_EN,
    position = POSITION_CENTER,
    variant = BUTTON_PRIMARY,
    type = BUTTON_TYPE,
    disabled = false
}: EventButtonProps) => {
    return (
        <div className={`flex${
            position === POSITION_CENTER ? ` justify-center` : 
            position === POSITION_LEFT ? " justify-start" : " justify-end"
        }`}>
            <button 
                onClick={onClick}
                type={type}
                className={`${
                    variant === BUTTON_PRIMARY ? "button-primary" : "button-secondary"}${
                    size === BUTTON_SMALL ? " button-small" : 
                    size === BUTTON_MEDIUM ? " button-medium" : " button-large"}${
                    text === BUTTON_EN ? " font-poppins" : ""}${
                    customClass ? ` ${customClass}` : ''}${
                    disabled ? " disabled:opacity-40" : ""
                }`}
                disabled={disabled}
            >
                {children}
            </button>
        </div>
    );
};

export const LinkButtonPrimary = (
    props: LinkButtonProps
) => <LinkButton {...props} variant={BUTTON_PRIMARY} />;
export const LinkButtonSecondary = (
    props: LinkButtonProps
) => <LinkButton {...props} variant={BUTTON_SECONDARY} />;
export const EventButtonPrimary = (
    props: EventButtonProps
) => <EventButton {...props} variant={BUTTON_PRIMARY} />;
export const EventButtonSecondary = (
    props: EventButtonProps
) => <EventButton {...props} variant={BUTTON_SECONDARY} />;