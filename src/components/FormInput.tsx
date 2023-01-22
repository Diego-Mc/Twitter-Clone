interface FormInputProps {
  label: string
  id: string
  type?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
}) => {
  return (
    <label className="input-wrapper">
      <p className="placeholder">{label}</p>
      <input
        type={type}
        placeholder=" "
        name={id}
        minLength={6}
        maxLength={50}
      />
    </label>
  )
}
