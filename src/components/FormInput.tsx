interface FormInputProps {
  label: string
  id: string
  type?: string
  className?: string
  value?: string
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
  className,
  value,
  onChange,
}) => {
  return (
    <label className={`input-wrapper ${className}`}>
      <p className="placeholder">{label}</p>
      {value !== undefined && onChange ? (
        <input
          type={type}
          placeholder=" "
          name={id}
          minLength={6}
          maxLength={50}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          placeholder=" "
          name={id}
          minLength={6}
          maxLength={50}
        />
      )}
    </label>
  )
}
