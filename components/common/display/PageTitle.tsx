interface PageTitleProps {
    title: string;
    customClass?: string;
}

const PageTitle = ({ 
    title, 
    customClass 
}: PageTitleProps) => {
    return (
        <h2 className={`page-title${customClass ? ` ${customClass}` : ''}`}>
            {title}
        </h2>
    )
}

export default PageTitle