import React from 'react'
import { Button } from 'primereact/button';
import styles from './IconButton.module.scss';
type ButtonPositionType = 'right';
export interface IIconButtonProps {
  label?: string
  icon: string
  iconPos?: ButtonPositionType;
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disable?: boolean
  className?: string
  style?: React.CSSProperties | undefined
}

export const IconButton: React.FC<IIconButtonProps> = (props) => {
  return (
    <Button
      className={`${styles["btn-icon"]} ${styles["btn-transparent"]}`}
      label={props?.label}
      onClick={props?.onClick}
      icon={`pi ${props?.icon} ${styles["btn-icon"]}`}
      disabled={props?.disable ?? false}
      style={props?.style}
    />

  )
}