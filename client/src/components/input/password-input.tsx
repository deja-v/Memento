import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


interface PasswordInputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>)=>void;
    placeholder?: string;
}

const PasswordInput:React.FC<PasswordInputProps> = ({value, onChange , placeholder}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);
    return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3">
        <input
            value={value}
            onChange={onChange}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder || "Password"}
            className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
        />
        {showPassword ? <FaRegEye
            size={22}
            className="text-blue-400 cursor-pointer"
            onClick={()=>toggleShowPassword()}
            />
        : <FaRegEyeSlash
            size={22}
            className="text-slate-400 cursor-pointer"
            onClick={()=>toggleShowPassword()}
            />}
    </div>
  )
}

export default PasswordInput