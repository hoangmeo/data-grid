import React, { useState } from 'react';
import DataGrid, { Column, DataGridProps, HeaderRendererProps } from 'react-data-grid';
import { DraggableHeaderRenderer, HeaderFilter } from './DraggableHeaderRenderer';
import NTAPagination from './NTAPagination';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './style.scss';
import ColumnsSetting from './ColumnsSetting';
import { Box, CircularProgress } from '@material-ui/core';
export interface INTAGridRef {
    reload: () => void;
}

export interface IProps<R, SR, K extends string | number> extends DataGridProps<R, SR, K> {
    rowKey?: string;
    pagination?: {
        rowCount: number;
        page: number;
        pageSize: number;
    };
    loading?: boolean;
    onPageSizeChange?: (pageSize: number) => void;
    onPageIndexChange?: (page: number) => void;
    headerFilter?: HeaderFilter;
    columnsKeyConfig?: string;
}

function NTAGrid<R, SR = unknown, K extends string | number = number>(props: IProps<R, SR, K> & { tableRef?: React.Ref<INTAGridRef> }) {
    const { columns: _columns, columnsKeyConfig, headerFilter, loading, rowKey, pagination, onPageIndexChange, onPageSizeChange, ...otherProps } = props;

    // state

    const [columns, setColumns] = useState<readonly Column<R, SR>[]>(_columns);

    // meno

    const draggableColumns: any = React.useMemo(() => {
        function HeaderRenderer(props: HeaderRendererProps<R>) {
            return <DraggableHeaderRenderer {...props} onColumnsReorder={handleColumnsReorder} headerFilter={headerFilter} enableDrag={true} />;
        }
        function NoDraggableHeaderRenderer(props: HeaderRendererProps<R>) {
            return <DraggableHeaderRenderer {...props} onColumnsReorder={handleColumnsReorder} headerFilter={headerFilter} enableDrag={false} />;
        }
        function handleColumnsReorder(sourceKey: string, targetKey: string) {
            const sourceColumnIndex = columns.findIndex((c) => c.key === sourceKey);
            const targetColumnIndex = columns.findIndex((c) => c.key === targetKey);
            const reorderedColumns = [...columns];
            reorderedColumns.splice(targetColumnIndex, 0, reorderedColumns.splice(sourceColumnIndex, 1)[0]);
            setColumns(reorderedColumns);
        }
        return columns.map((c) => {
            if (!c.name) {
                return c;
            }
            if (c.key === rowKey || c.frozen) return { ...c, headerRenderer: NoDraggableHeaderRenderer };
            return { ...c, headerRenderer: HeaderRenderer };
        });
    }, [columns, rowKey, headerFilter]);

    // effect

    React.useEffect(() => {
        setColumns(_columns);
    }, [_columns]);

    // function

    const onColumnsDisplayChange = (hiddenCols: string[]) => {
        setColumns(_columns.filter((col) => !hiddenCols.includes(col.key)));
    };

    const rowKeyGetter = (r: any) => r[rowKey || 'id'] as K;

    return (
        <div className="nta-data-grid">
            {loading && (
                <div className="loading-container">
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                </div>
            )}
            <DndProvider backend={HTML5Backend}>
                <ColumnsSetting columns={_columns} onColumnsDisplayChange={onColumnsDisplayChange} columnsKeyConfig={columnsKeyConfig} />
                <DataGrid<R, SR, K> rowKeyGetter={rowKeyGetter} className="rdg-light" columns={draggableColumns} {...otherProps} />
                {pagination && (
                    <div className="data-grid-pagination">
                        <NTAPagination {...pagination} onPageIndexChange={onPageIndexChange} onPageSizeChange={onPageSizeChange} />
                    </div>
                )}
            </DndProvider>
        </div>
    );
}
NTAGrid.defaultProps = {
    rowKey: 'id',
};
export default NTAGrid;
