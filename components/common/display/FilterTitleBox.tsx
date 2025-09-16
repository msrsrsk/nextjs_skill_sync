interface FilterTitleBoxProps {
    title: string;
    children: React.ReactNode;
}

const FilterTitleBox = ({ 
    title, 
    children 
}: FilterTitleBoxProps) => {
    return (
        <div className="filter-titlebox">
            <h2 className="filter-title">{title}</h2>
            {children}
        </div>
    );
};

export default FilterTitleBox;