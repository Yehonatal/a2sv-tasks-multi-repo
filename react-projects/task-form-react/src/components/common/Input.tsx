import { UseFormRegister, FieldError } from 'react-hook-form';

type InputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  name: string;
  error?: FieldError;
  required?: boolean;
};

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  name,
  error,
  required = false,
}: InputProps) => {
  return (
    <div className="mb-6">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium mb-2 text-gray-700 transition-colors duration-200"
      >
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`
            w-full px-4 py-3 
            bg-white/5 backdrop-blur-sm 
            border-[1.5px] rounded-lg 
            shadow-sm 
            transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-teal-300/40 focus:border-teal-400/40 
            ${error ? 'border-rose-300' : 'border-gray-200/60 hover:border-teal-200/60'}
          `}
        />
      </div>
      {error && (
        <p className="text-rose-400 text-xs mt-2 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;
