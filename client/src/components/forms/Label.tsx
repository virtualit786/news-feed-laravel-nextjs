import React from "react";

interface LabelProps {
  text: string;
  className?: string
  onClick?: React.MouseEventHandler<HTMLLabelElement>

}

export const Label: React.FC<LabelProps> = (props) => {
  return <label className={props.className} onClick={props?.onClick}>{props.text}  </label>;
};

