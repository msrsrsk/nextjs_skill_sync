import Link from "next/link"

interface IconBoxProps {
    link: string;
    label: string;
    children: React.ReactNode;
}

const IconBox = ({ 
    link, 
    label, 
    children 
}: IconBoxProps) => (
    <Link 
        className="icon" 
        href={link} 
        aria-label={label}
    >
        {children}
    </Link>
);

export default IconBox;