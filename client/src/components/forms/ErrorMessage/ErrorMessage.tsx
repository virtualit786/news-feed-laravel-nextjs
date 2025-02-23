import React from 'react'
import styles from './ErrorMessage.module.scss'

export interface ErrorMessageProps {
  text: string | undefined
}

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  return (
    <>
      {props?.text && <div className={`${styles['errorText']}`}>{props?.text}</div>}</>
  )
}