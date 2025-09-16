interface FormSelectProps {
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { label: string; value: string }[];
    customClass?: string;
}

const FormSelect = ({ 
    name, 
    value, 
    onChange, 
    options,
    customClass
}: FormSelectProps) => {
    return (
        <div className="form-selectbox">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`form-select${customClass ? ` ${customClass}` : ''}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default FormSelect