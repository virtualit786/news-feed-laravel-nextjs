import { Tooltip } from "primereact/tooltip"
import { FC } from "react"

interface TooltipTemplateProps {
  message: string
  target: string
}

export const TooltipTemplate: FC<TooltipTemplateProps> = ({ target, message }) => {
  return (
    <Tooltip
      target={target}
      content={message || "No information found!"}
      position="top"
      style={{ maxWidth: '400px' }}
    />
  )
}