interface FormTextareaProps {
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    error?: string | string[];
    customClass?: string;
}

const FormTextarea = ({ 
    name, 
    value, 
    onChange, 
    placeholder, 
    error,
    customClass
}: FormTextareaProps) => {
    const isInvalid = error && error.length > 0;

    return (
        <textarea
            id={name}
            name={name}
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

export default FormTextarea