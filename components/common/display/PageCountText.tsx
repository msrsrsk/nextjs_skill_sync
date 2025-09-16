interface PageCountTextProps {
    countText: string;
    children: React.ReactNode;
    customClass?: string;
}

const PageCountText = ({
    countText,
    children,
    customClass
}: PageCountTextProps) => {
    return (
        <div className={`page-numtext-box${customClass ? ` ${customClass}` : ''}`}>
            <h3 className="page-numtext">{countText}
                {children}
            </h3>
        </div>
    )
}

export default PageCountText