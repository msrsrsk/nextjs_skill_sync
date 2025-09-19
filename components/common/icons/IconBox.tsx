import Link from "next/link"

interface IconBoxProps {
    link: string;
    label: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const IconBox = ({ 
    link, 
    label, 
    children,
    onClick
}: IconBoxProps) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        window.location.href = link;
    };

    return <>
        {onClick ? (
            <button 
                onClick={handleClick}
                aria-label={label}
                className="icon" 
            >
                {children}
            </button>
        ) : (
            <Link 
                className="icon" 
                href={link} 
                aria-label={label}
            >
                {children}
            </Link>
        )}
    </>
}

export default IconBox;