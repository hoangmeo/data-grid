import { HeaderRendererProps, SortableHeaderCell } from 'react-data-grid';
import { useDrag, useDrop } from 'react-dnd';
import { useCombinedRefs } from './useCombinedRefs';
import { ReactComponent as FilterIconSVG } from './icons/FilterIcon.svg';
import React from 'react';
import { Popover } from 'react-tiny-popover';
import { FilterItemValue, HeaderFilter, HeaderFilterElm } from './type';
import ColumsFilter from './filters';

interface DraggableHeaderRendererProps<R> extends HeaderRendererProps<R> {
    onColumnsReorder: (sourceKey: string, targetKey: string) => void;
    headerFilter?: HeaderFilter<R>;
    enableDrag: boolean;
    headerFilterData: { [key: string]: any };
    onFilterChange: (key: string, value: FilterItemValue | undefined) => void;
}

export function DraggableHeaderRenderer<R>({
    onColumnsReorder,
    column,
    sortDirection,
    onSort,
    priority,
    isCellSelected,
    headerFilter,
    enableDrag,
    headerFilterData,
    onFilterChange,
}: DraggableHeaderRendererProps<R>) {
    const [isOpen, setOpen] = React.useState<boolean>(false);
    // poper

    //
    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN_DRAG',
        item: { key: column.key },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'COLUMN_DRAG',
        drop({ key }: { key: string }) {
            onColumnsReorder(key, column.key);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const combinedRefs = useCombinedRefs(drag, drop);

    const props = React.useMemo(() => {
        if (enableDrag) {
            return {
                ref: combinedRefs,
                style: {
                    opacity: isDragging ? 0.5 : 1,
                    backgroundColor: isOver ? '#ececec' : undefined,
                    cursor: 'move',
                    display: 'flex',
                    justifyContent: 'space-between',
                },
            };
        }
        return {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
            },
        };
    }, [enableDrag, combinedRefs, isDragging, isOver]);

    const handleClick = (e: any) => {
        setOpen(true);
    };
    const headerName = React.useMemo(() => {
        if (column.sortable) {
            return (
                <SortableHeaderCell sortDirection={sortDirection} onSort={onSort} priority={priority} isCellSelected={isCellSelected}>
                    {column.name}
                </SortableHeaderCell>
            );
        }
        return <div>{column.name}</div>;
    }, [column, sortDirection, onSort, priority, isCellSelected]);

    const filter: HeaderFilterElm<R> | undefined = React.useMemo(() => {
        if (headerFilter) {
            return headerFilter[column.key];
        }
        return undefined;
    }, [column, headerFilter]);

    const filterValue = React.useMemo(() => {
        if (headerFilterData) {
            return headerFilterData[column.key];
        }
        return undefined;
    }, [column, headerFilterData]);

    return (
        <div {...props}>
            <div style={{ flex: 1 }}>{headerName}</div>
            {filter && (
                <Popover
                    containerClassName="nta-grid-header-filter"
                    align="center"
                    positions={['bottom']}
                    onClickOutside={(e) => {
                        setOpen(false);
                    }}
                    isOpen={isOpen}
                    content={
                        <div
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                            style={{ padding: 10, backgroundColor: 'white', border: '1px solid #cccccc80' }}
                        >
                            <ColumsFilter filter={filter} filterValue={filterValue} onFilterChange={onFilterChange} isOpen={isOpen} filterKey={column.key} />
                        </div>
                    }
                >
                    <div className="filter" onPointerDown={handleClick} style={{ cursor: 'pointer', width: 20, display: 'flex', alignItems: 'center' }}>
                        <FilterIconSVG width={15} style={{ fill: filterValue ? 'red' : '#333' }} />
                    </div>
                </Popover>
            )}
        </div>
    );
}
