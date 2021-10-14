import React, { ReactElement } from 'react';
import { FilterItemValue, HeaderFilterElm, HeaderFilterType } from '../type';
import TextFilter from './Text';
import DateTimeFilter from './DateTime';
import NumberFilter from './Number';
import SelectFilter from './Select';

interface Props {
    filter: HeaderFilterElm;
    filterValue: FilterItemValue;
    onFilterChange: (key: string, value: FilterItemValue | undefined) => void;
    isOpen: boolean;
    filterKey: string;
}

export default function ColumsFilter({ filter, filterValue, onFilterChange, isOpen, filterKey }: Props): ReactElement {
    const [currentFilter, setCurrentFilter] = React.useState<FilterItemValue>(filterValue);
    React.useEffect(() => {
        if (isOpen) {
            console.log(filterValue);
            setCurrentFilter(filterValue);
        }
    }, [filterValue, isOpen]);
    const cpn = React.useMemo(() => {
        if (filter.type === HeaderFilterType.TEXT) {
            return (
                <TextFilter
                    filterValue={currentFilter}
                    onChange={(v) => {
                        setCurrentFilter(v);
                    }}
                />
            );
        }
        if (filter.type === HeaderFilterType.DATETIME) {
            return (
                <DateTimeFilter
                    filterValue={currentFilter}
                    onChange={(v) => {
                        setCurrentFilter(v);
                    }}
                />
            );
        }
        if (filter.type === HeaderFilterType.NUMBER) {
            return (
                <NumberFilter
                    filterValue={currentFilter}
                    onChange={(v) => {
                        setCurrentFilter(v);
                    }}
                />
            );
        }
        if (filter.type === HeaderFilterType.LIST) {
            return (
                <SelectFilter
                    filter={filter}
                    filterValue={currentFilter}
                    onChange={(v) => {
                        setCurrentFilter(v);
                    }}
                />
            );
        }
    }, [filter, currentFilter, setCurrentFilter]);
    // function
    const clear = () => {
        onFilterChange(filterKey, undefined);
    };
    const search = () => {
        if (!currentFilter) {
            clear();
            return;
        }
        switch (filter.type) {
            case HeaderFilterType.TEXT:
            case HeaderFilterType.LIST:
                onFilterChange(filterKey, currentFilter.value ? currentFilter : undefined);
                return;
            case HeaderFilterType.DATETIME:
            case HeaderFilterType.NUMBER:
                onFilterChange(filterKey, currentFilter.from || currentFilter.to ? currentFilter : undefined);
                return;
        }
    };
    return (
        <div style={{ display: 'block' }}>
            <div>{cpn}</div>
            <div style={{ marginTop: 5, display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={search}>Search</button>
                <button onClick={clear}>Clear</button>
            </div>
        </div>
    );
}
