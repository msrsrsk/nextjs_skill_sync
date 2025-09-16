interface FormInputProps {
    name: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string | string[];
    customClass?: string;
}

const FormInput = ({ 
    name, 
    type, 
    value, 
    onChange, 
    placeholder, 
    error,
    customClass
}: FormInputProps) => {
    const isInvalid = error && error.length > 0;
    
    return (
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input${
                isInvalid ? ' is-invalid' : ''}${
                customClass ? ` ${customClass}` : ''
            }`}
        />
    )
}

export default FormInput