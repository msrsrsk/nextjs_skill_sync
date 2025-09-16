interface FormLabelProps {
    name: string
    label: string
    required?: boolean
}

const FormLabel = ({ 
    name, 
    label, 
    required 
}: FormLabelProps) => {
    return (
        <label htmlFor={name} className="form-label">
            {label}
            {required && <span className="form-required">*</span>}
        </label>
    )
}

export default FormLabel