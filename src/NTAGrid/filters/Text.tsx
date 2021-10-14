import React, { ReactElement } from 'react';
import { FilterCondition, FilterItemValue, HeaderFilterType } from '../type';

interface Props {
    onChange: (v: FilterItemValue) => void;
    filterValue: FilterItemValue;
}
const defaultValue = { type: HeaderFilterType.TEXT, condition: FilterCondition.Contains };
export default function TextFilter({ filterValue = defaultValue, onChange }: Props): ReactElement {
    console.log(filterValue);
    return (
        <div>
            <select
                value={filterValue.condition}
                onChange={(event) => {
                    onChange({ ...filterValue, condition: event.currentTarget.value as FilterCondition });
                }}
            >
                <option value={FilterCondition.Contains}>Contains</option>
                <option value={FilterCondition.StartsWith}>StartsWith</option>
                <option value={FilterCondition.EndWith}>EndWith</option>
                <option value={FilterCondition.Equal}>Equal</option>
            </select>
            <input
                autoFocus
                value={filterValue?.value || ''}
                onChange={(event) => {
                    onChange({ ...filterValue, value: event.currentTarget.value });
                }}
            />
        </div>
    );
}
