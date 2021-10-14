import { ReactElement } from 'react';
import { FilterItemValue, HeaderFilterType } from '../type';
interface Props {
    onChange: (v: FilterItemValue) => void;
    filterValue: FilterItemValue;
}
const defaultValue = { type: HeaderFilterType.NUMBER };
export default function NumberFilter({ filterValue = defaultValue, onChange }: Props): ReactElement {
    return (
        <div>
            <div>
                <label>From</label>
                <input
                    type="number"
                    value={filterValue?.from}
                    onChange={(event) => {
                        onChange({ ...filterValue, from: event.target.value });
                    }}
                />
            </div>
            <div>
                <label>To</label>
                <input
                    type="number"
                    value={filterValue?.to}
                    onChange={(event) => {
                        onChange({ ...filterValue, to: event.target.value });
                    }}
                />
            </div>
        </div>
    );
}
