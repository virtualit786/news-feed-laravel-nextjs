import React from 'react'
import { Button as PButton, ButtonProps } from 'primereact/button';
import { IconType } from 'primereact/utils';
import { TooltipOptions } from 'primereact/tooltip/tooltipoptions';

interface IButtonProps {
  label?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disable?: boolean
  icon?: IconType<ButtonProps>
  className?: string
  style?: React.CSSProperties;
  dataAttribute?: string
  tooltip?: string
  tooltipOptions?: TooltipOptions;
  size?: 'small' | 'large' | undefined;
  iconPos?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  raised?: boolean
  rounded?: boolean
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | undefined;
  outlined?: boolean
}

export const Button: React.FC<IButtonProps> = (props) => {
  return (
    <>
      <PButton
        icon={props?.icon}
        label={props?.label}
        disabled={props?.disable ?? false}
        className={`${props?.className ?? ""}`}
        style={props?.style}
        onClick={props?.onClick}
        data-test={props?.dataAttribute}
        tooltip={props?.tooltip}
        tooltipOptions={props?.tooltipOptions ?? {}}
        iconPos={props?.iconPos}
        raised={props?.raised ?? false}
        rounded={props?.rounded ?? false}
        severity={props?.severity}
        size={props?.size}
        outlined={props?.outlined ?? false}
      />
    </>
  )
}