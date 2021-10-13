import { HeaderRendererProps, SortableHeaderCell } from 'react-data-grid';
import { useDrag, useDrop } from 'react-dnd';
import { useCombinedRefs } from './useCombinedRefs';
import { ReactComponent as FilterIconSVG } from './icons/FilterIcon.svg';
import React from 'react';
import { Popover } from 'react-tiny-popover';
import { Box } from '@material-ui/core';

interface DraggableHeaderRendererProps<R> extends HeaderRendererProps<R> {
    onColumnsReorder: (sourceKey: string, targetKey: string) => void;
    headerFilter?: HeaderFilter;
    enableDrag: boolean;
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
}: DraggableHeaderRendererProps<R>) {
    const [isOpen, setOpen] = React.useState<boolean>(false);

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

    const handleClick = () => {
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

    return (
        <div {...props}>
            <div style={{ flex: 1 }}>{headerName}</div>
            {headerFilter && headerFilter[column.key] && (
                <Popover
                    align="end"
                    positions={['bottom']}
                    onClickOutside={() => setOpen(false)}
                    isOpen={isOpen}
                    content={<Box style={{ padding: 10, backgroundColor: 'white', border: '1px solid #cccccc80' }}>{headerFilter[column.key]}</Box>}
                >
                    <div className="filter" onClick={handleClick} style={{ cursor: 'pointer' }}>
                        <FilterIconSVG width={15} />
                    </div>
                </Popover>
            )}
        </div>
    );
}

export interface HeaderFilter {
    [key: string]: JSX.Element;
}
