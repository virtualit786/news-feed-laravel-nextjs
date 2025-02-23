import _ from 'lodash';
import React from 'react'
import styles from './FormFieldWithLabel.module.scss';
import { Tooltip } from 'primereact/tooltip';
interface FormFieldWithLabelProps {
  label: string;
  labelClassName?: string;
  containerClassName?: string;
  formField: React.ReactNode;
  isRequired?: boolean;
  labelContainerClassName?: string;
}

export const FormFieldWithLabel: React.FC<FormFieldWithLabelProps> = ({ containerClassName, labelContainerClassName, label, labelClassName, formField, isRequired}) => {

  return (
    <>
      <div className={`${styles["field"]} ${containerClassName}`}>
        <div className={`flex justify-content-${labelContainerClassName ?? 'between'}`}>
          <Tooltip target="#show-delivery-info" className="info-icon-tooltip" position='top' />
          <label className={labelClassName}>
            {label}{isRequired ? <span className="text-red-600"> * </span> : ""}
          </label>
        </div>
        {formField}
      </div >
    </>
  )
}