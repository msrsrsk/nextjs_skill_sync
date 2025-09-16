interface SectionTitleProps {
    title: string;
    customClass?: string;
}

const SectionTitle = ({ 
    title, 
    customClass 
}: SectionTitleProps) => {
    return (
        <h2 
            className={`main-title${customClass ? ` ${customClass}` : ''}`}
            aria-label={title}
        >
            <span aria-hidden="true">
                &lt; {title} &gt;
            </span>
        </h2>
    )
}

export default SectionTitle