import _ from 'lodash';
import React, { useEffect, useState } from 'react'
import { Dropdown as DropdownP, DropdownChangeEvent } from 'primereact/dropdown';
import { v4 as uuid } from "uuid";
import { truncateText } from '../../../shared/utils/truncateText';
import { TooltipTemplate } from '../../TooltipTemplate';
import { ValueLabelModel } from '../../../shared/types';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

interface DropdownProps {
  value: string;
  options: ValueLabelModel[];
  placeholder?: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  onEnterKey?: (value: string) => void;
  errorMessage?: string;
  className?: string;
  panelClassName?: string;
  disabled?: boolean;
  scrollHeight?: string;
  resetFilterOnHide?: boolean;
  onHide?: () => void;
  dataAttribute?: string;
  style?: React.CSSProperties;
  editable?: boolean;
  itemLabelSize?: number;
}

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const [lastChangeValue, setLastChangeValue] = useState<string>('');

  const dropdownItemTemplate = (item: string) => {
    const showCharacters = props?.itemLabelSize ?? 50;
    const uniqueId = uuid();
    const truncatedDropdownItem = truncateText(item, showCharacters);
    return (
      <div className={`dropdown-item-tooltip-target-${uniqueId}`}>
        <span className="dropdown-label">{truncatedDropdownItem}</span>
        {_.size(item) > showCharacters && (
          <TooltipTemplate target={`.dropdown-item-tooltip-target-${uniqueId}`} message={item} />
        )}
      </div>
    );
  };

  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void; }) => {
      if (event?.key === 'Enter') {
        props?.onEnterKey && props?.onEnterKey(lastChangeValue)
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [lastChangeValue])

  return (
    <>
      <DropdownP
        data-test={props?.dataAttribute}
        filterBy="label"
        optionValue='value'
        optionLabel="label"
        value={props?.value ?? ""}
        options={props?.options ?? []}
        placeholder={props?.placeholder ?? ""}
        className={`${props?.className} ${props?.errorMessage ? "p-invalid" : ''}`}
        panelClassName={props?.panelClassName}
        filter={_.size(props?.options) > 10 ? true : false}
        onChange={(e: DropdownChangeEvent) => { setLastChangeValue(e?.value); props.onChange(e?.value); }}
        disabled={props?.disabled}
        onSelect={(e) => { props?.onSelect && props?.onSelect(lastChangeValue) }}
        style={props?.style}
        scrollHeight={props?.scrollHeight ?? "200px"}
        resetFilterOnHide={props?.resetFilterOnHide}
        onHide={props?.onHide}
        editable={props?.editable}
        itemTemplate={(event) => dropdownItemTemplate(event?.label)}
      />
      <ErrorMessage text={props?.errorMessage} />
    </>
  )
}