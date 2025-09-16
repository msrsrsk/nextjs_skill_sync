import { CheckIcon } from "@/components/common/icons/SvgIcons"

interface AgreementCheckboxesProps {
    checkList: { 
        id: string, 
        label: string, 
        items: string[] 
    }[]
    agreements: { [key: string]: boolean }
    onAgreementChange: (id: string) => void
    isUnshippedOrders: boolean
}

const AgreementCheckboxes = ({ 
    checkList, 
    agreements, 
    onAgreementChange,
    isUnshippedOrders
}: AgreementCheckboxesProps) => {
    return (
        <div className={`bg-soft-white rounded-sm pt-6 px-5 pb-7 md:pt-10 md:px-[64px] md:pb-11 grid gap-4 md:gap-6${
            isUnshippedOrders ? ' opacity-60 pointer-events-none' : ''
        }`}>
            {checkList.map((list, index) => 
                <>
                    <div 
                        key={list.id} 
                        className="flex items-start"
                    >
                        <input
                            type="checkbox"
                            id={list.id}
                            checked={agreements[list.id] || false}
                            onChange={() => onAgreementChange(list.id)}
                            className="opacity-0 absolute appearance-none"
                        />
                        <label 
                            htmlFor={list.id} 
                            className="cursor-pointer pr-3 md:pr-6"
                        >
                            <CheckIcon 
                                customClass="w-8 h-8 md:w-10 md:h-10" 
                                color={agreements[list.id] ? "#39cc6f" : ""}
                            />
                        </label>
                        <div>
                            <label 
                                htmlFor={list.id} 
                                className="text-base md:text-lg font-bold leading-7 md:leading-8 block mb-1 md:mb-2 cursor-pointer select-none"
                            >
                                {list.label}
                            </label>
                            <ul className="text-sm md:text-base leading-6 md:leading-7 font-medium space-y-2 select-none">
                                {list.items.map((item: string, index: number) => (
                                    <li key={index}>・ {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {index < checkList.length - 1 && 
                        <hr className="separate-border" />
                    }
                </>
            )}
        </div>
    )
}

export default AgreementCheckboxes