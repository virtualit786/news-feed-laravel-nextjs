import React from 'react'
import { InputText } from "primereact/inputtext";
import styles from './InputSearchTextField.module.scss';

interface InputSearchFieldProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
  InputTextClassName?: string;
  dataAttribute?: string;
  isLoading?: boolean;
}

export const InputSearchTextField: React.FC<InputSearchFieldProps> = (props) => {

  return (
    <>
      <div className={`relative ${props?.className}`}>
        <span className="p-input-icon-right w-full">
          {props?.value && (<i className={`pi ${props?.isLoading ? "pi-spin pi-spinner" : "pi-times"} ${styles?.clearIcon}`} onClick={props?.onClear} />)}
          <InputText className={`w-full ${props?.InputTextClassName}`} value={props?.value} onChange={(e) => props?.onChange(e?.target?.value)}
            placeholder={props?.placeholder ?? "Enter text to search"} disabled={props?.disabled ?? props?.isLoading ? props?.isLoading : false}
            data-attribute={props?.dataAttribute} onFocus={(event) => props?.onFocus && props?.onFocus(event?.target?.value)} />
        </span>
      </div>
    </>
  )
}