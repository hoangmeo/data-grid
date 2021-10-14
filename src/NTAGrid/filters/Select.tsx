import { ReactElement } from 'react';
import { FilterItemValue, HeaderFilterElm, HeaderFilterType } from '../type';
interface Props {
    onChange: (v: FilterItemValue) => void;
    filterValue: FilterItemValue;
    filter: HeaderFilterElm;
}
const defaultValue = { type: HeaderFilterType.LIST };
export default function SelectFilter({ filterValue = defaultValue, onChange, filter }: Props): ReactElement {
    return (
        <div>
            <select value={filterValue.value} onChange={(e) => onChange({ ...filterValue, value: e.target.value })}>
                <option value={''}>----</option>;
                {filter.list?.map((l) => {
                    return <option value={l.value}>{l.label}</option>;
                })}
            </select>
        </div>
    );
}
