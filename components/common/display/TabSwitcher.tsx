import { TAB_TEXT_TYPES } from "@/constants/index"

const { TAB_EN } = TAB_TEXT_TYPES;

interface TabSwitcherProps<T extends string = string> {
    categories: Record<string, string>;
    activeTab: T;
    setActiveTab: (tab: T) => void;
    text?: TabTextType;
    customClass?: string;
}

const TabSwitcher = <T extends string = string> ({ 
    categories,
    activeTab, 
    setActiveTab,
    text = TAB_EN,
    customClass
}: TabSwitcherProps<T>) => {
    const isEnglish = text === TAB_EN;
    
    return (
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
            <ul 
                role="list" 
                className={`menu-linkbox${customClass ? ` ${customClass}` : ''}`}
            >
                {Object.entries(categories).map(([_, value]) => (
                    <li 
                        key={value} 
                        className={`menu-link${
                            isEnglish ? " uppercase font-poppins" : " font-zen"}${
                            value === activeTab ? ' is-active' : ''
                        }`}
                        onClick={() => setActiveTab(value as T)}
                    >
                        {value}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TabSwitcher