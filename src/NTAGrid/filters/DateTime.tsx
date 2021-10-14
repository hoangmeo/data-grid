import { ReactElement } from 'react';
import { FilterItemValue, HeaderFilterType } from '../type';
interface Props {
    onChange: (v: FilterItemValue) => void;
    filterValue: FilterItemValue;
}
const defaultValue = { type: HeaderFilterType.DATETIME };
export default function DateTimeFilter({ filterValue = defaultValue, onChange }: Props): ReactElement {
    return (
        <div>
            <div>
                <label>From</label>

                <input
                    type="date"
                    value={filterValue?.from}
                    onChange={(event) => {
                        onChange({ ...filterValue, from: event.target.value });
                    }}
                />
            </div>
            <div>
                <label>To</label>
                <input
                    type="date"
                    value={filterValue?.to}
                    onChange={(event) => {
                        onChange({ ...filterValue, to: event.target.value });
                    }}
                />
            </div>
        </div>
    );
}
