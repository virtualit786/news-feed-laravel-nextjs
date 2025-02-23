import { SelectItemOptionsType } from "primereact/selectitem";
import { MultiSelect } from "primereact/multiselect";
import _ from 'lodash';

interface MultiSelectDropdownProps {
  value: string[];
  options: SelectItemOptionsType;
  placeholder?: string;
  filterPlaceholder?: string;
  dataAttribute?: string;
  className?: string;
  enableFilter?: boolean;
  filterMatchMode?: 'endsWith' | 'startsWith' | 'contains' | 'equals' | 'notEquals';
  maxSelectedLabels?: number;
  panelClassName?: string;
  showSelectAll?: boolean;
  scrollHeight?: string;
  resetFilterOnHide?: boolean;
  selectionLimit?: number;
  onChange: (value: string[]) => void;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = (props) => {

  return (
    <MultiSelect
      value={props?.value}
      className={props?.className}
      options={props?.options}
      placeholder={props?.placeholder}
      filter={(_.size(props?.options) > 6 && props?.enableFilter) ? true : false}
      filterMatchMode={props?.filterMatchMode}
      filterPlaceholder={props?.filterPlaceholder ?? "Select"}
      onChange={(e) => props?.onChange(e?.target?.value)}
      data-test={props?.dataAttribute}
      panelClassName={props?.panelClassName}
      showSelectAll={props?.showSelectAll ?? false}
      scrollHeight={props?.scrollHeight}
      resetFilterOnHide={props?.resetFilterOnHide ?? false}
      maxSelectedLabels={props?.maxSelectedLabels}
      selectionLimit={props?.selectionLimit}
    />
  )
}