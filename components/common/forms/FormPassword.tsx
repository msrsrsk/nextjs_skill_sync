import { Eye, EyeOff } from "lucide-react"

interface FormPasswordProps {
    value?: string;
    isRevealPassword: boolean;
    setIsRevealPassword: (isRevealPassword: boolean) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | string[];
    customClass?: string;
    name?: string;
}

const FormPassword = ({ 
    value, 
    isRevealPassword,
    setIsRevealPassword,
    onChange, 
    error,
    customClass,
    name = "password"
}: FormPasswordProps) => {
    const isInvalid = error && error.length > 0;

    return (
        <div className={`form-password${
            isInvalid ? ' is-invalid' : ''}${
            customClass ? ` ${customClass}` : ''
        }`}
        >
            <input
                id={name}
                name={name}
                type={isRevealPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder="•••••"
                className="bg-transparent text-base leading-7 w-full outline-none"
            />
            <button 
                type="button" 
                onClick={() => setIsRevealPassword(!isRevealPassword)}
                aria-label={isRevealPassword ? "パスワードを非表示にする" : "パスワードを表示する"}
            >
                {isRevealPassword ? 
                    <Eye className="w-[22px] h-[22px]" /> : 
                    <EyeOff className="w-[22px] h-[22px]" />
                }
            </button>
        </div>
    )
}

export default FormPassword