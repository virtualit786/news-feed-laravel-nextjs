import { Password as PasswordP } from 'primereact/password';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import './password.scss';

interface PasswordProps {
  value: string;
  onChange: (value: string) => void;
  showToggleMask?: boolean
  errorMessage?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
  placeholder?: string
  dataAttribute?: string
  feedback?: boolean
}

export const Password: React.FC<PasswordProps> = (props) => {
  return (
    <div className={"password-container"}>
      <PasswordP
        value={props?.value ?? ""}
        onChange={(e) => props?.onChange(e?.target?.value)}
        toggleMask={props?.showToggleMask ?? true}
        className={`cursor-pointer ${props?.errorMessage ? "p-invalid" : ''} ${props?.className}`}
        disabled={props?.disabled}
        placeholder={props?.placeholder}
        data-test={props?.dataAttribute}
        inputClassName={`${props?.inputClassName}`}
        feedback={props?.feedback}
      />
      <ErrorMessage text={props?.errorMessage} />
    </div>
  )
}