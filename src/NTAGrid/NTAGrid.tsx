import React, { useState } from 'react';
import DataGrid, { Column, DataGridProps, HeaderRendererProps } from 'react-data-grid';
import { DraggableHeaderRenderer } from './DraggableHeaderRenderer';
import NTAPagination from './NTAPagination';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './style.scss';
import ColumnsSetting from './ColumnsSetting';
import { Box, CircularProgress } from '@material-ui/core';
import { HeaderFilter, FilterItemValue, HeaderFilterType, HeaderFilterElm, FilterCondition } from './type';
import moment from 'moment';
export interface INTAGridRef {
    reload: () => void;
}
const hasValue = (v: any) => {
    return v !== '' && v !== undefined && v !== null;
};
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
    headerFilter?: HeaderFilter<R>;
    columnsKeyConfig?: string;
}

function NTAGrid<R, SR = unknown, K extends string | number = number>(props: IProps<R, SR, K> & { tableRef?: React.Ref<INTAGridRef> }) {
    const { columns: _columns, rows, columnsKeyConfig, headerFilter, loading, rowKey, pagination, onPageIndexChange, onPageSizeChange, ...otherProps } = props;
    const [headerFilterData, setHeaderFilterData] = React.useState<{ [key: string]: FilterItemValue }>({});
    // state

    const [columns, setColumns] = useState<readonly Column<R, SR>[]>(_columns);

    // meno

    const draggableColumns: any = React.useMemo(() => {
        function HeaderRenderer(props: HeaderRendererProps<R>) {
            return (
                <DraggableHeaderRenderer
                    {...props}
                    onColumnsReorder={handleColumnsReorder}
                    headerFilter={headerFilter}
                    enableDrag={true}
                    headerFilterData={headerFilterData}
                    onFilterChange={onFilterChange}
                />
            );
        }
        function NoDraggableHeaderRenderer(props: HeaderRendererProps<R>) {
            return (
                <DraggableHeaderRenderer
                    {...props}
                    onColumnsReorder={handleColumnsReorder}
                    headerFilter={headerFilter}
                    enableDrag={false}
                    headerFilterData={headerFilterData}
                    onFilterChange={onFilterChange}
                />
            );
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
            if (c.key === rowKey) return { ...c, headerRenderer: NoDraggableHeaderRenderer };
            return { ...c, headerRenderer: HeaderRenderer };
        });
    }, [columns, rowKey, headerFilter, headerFilterData]);

    // effect

    React.useEffect(() => {
        setColumns(_columns);
    }, [_columns]);

    const data = React.useMemo(() => {
        if (headerFilter && headerFilterData && Object.keys(headerFilterData).length) {
            return rows.filter((row: any) => {
                return Object.keys(headerFilterData).every((k) => {
                    const fdata = headerFilterData[k];
                    const fconfig: HeaderFilterElm<R> = headerFilter[k];
                    // text
                    if (fdata.type === HeaderFilterType.TEXT) {
                        const colValue: string = fconfig.toValue ? fconfig.toValue(row) : row[k];
                        if (fdata.condition === FilterCondition.Contains) {
                            return colValue?.includes(fdata.value);
                        } else if (fdata.condition === FilterCondition.StartsWith) {
                            return colValue?.startsWith(fdata.value);
                        } else if (fdata.condition === FilterCondition.EndWith) {
                            return colValue?.endsWith(fdata.value);
                        } else if (fdata.condition === FilterCondition.Equal) {
                            return colValue === fdata.value;
                        } else if (fdata.condition === FilterCondition.NotEqual) {
                            return colValue !== fdata.value;
                        }
                    }
                    // datetime
                    if (fdata.type === HeaderFilterType.DATETIME) {
                        let isValid = true;
                        const colValue: string = fconfig.toValue ? fconfig.toValue(row) : row[k];
                        if (hasValue(colValue)) {
                            const colDateValue = moment(colValue).toDate().getTime();
                            if (fdata.from) {
                                isValid = colDateValue >= moment(fdata.from).toDate().getTime();
                            }
                            if (isValid && fdata.to) {
                                isValid = colDateValue <= moment(fdata.to).add(1, 'day').toDate().getTime();
                            }
                            return isValid;
                        }
                        return false;
                    }
                    // number
                    if (fdata.type === HeaderFilterType.NUMBER) {
                        let isValid = true;
                        const colValue: string = fconfig.toValue ? fconfig.toValue(row) : row[k];
                        if (hasValue(colValue)) {
                            const colNumberValue = parseFloat(colValue);
                            if (hasValue(fdata.from)) {
                                isValid = colNumberValue >= parseFloat(fdata.from);
                            }
                            if (isValid && fdata.to) {
                                isValid = colNumberValue <= parseFloat(fdata.to);
                            }
                            return isValid;
                        }
                        return false;
                    }
                    // list
                    if (fdata.type === HeaderFilterType.LIST) {
                        const colValue: string = fconfig.toValue ? fconfig.toValue(row) : row[k];
                        return colValue === fdata.value;
                    }
                    // default
                    return true;
                });
            });
        }
        return rows;
    }, [rows, headerFilterData, headerFilter]);
    // function

    const onColumnsDisplayChange = (hiddenCols: string[]) => {
        setColumns(_columns.filter((col) => !hiddenCols.includes(col.key)));
    };
    const onColumnsChange = (c: readonly Column<R, SR>[]) => {
        setColumns(c);
    };
    const rowKeyGetter = (r: any) => r[rowKey || 'id'] as K;
    const onFilterChange = (key: string, value: FilterItemValue | undefined) => {
        if (value) {
            setHeaderFilterData((f) => ({ ...f, [key]: value }));
        } else {
            setHeaderFilterData((f) => {
                delete f[key];
                return { ...f };
            });
        }
    };

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
                <ColumnsSetting
                    onColumnsChange={onColumnsChange}
                    originColumns={_columns}
                    columns={columns}
                    onColumnsDisplayChange={onColumnsDisplayChange}
                    columnsKeyConfig={columnsKeyConfig}
                />
                <DataGrid<R, SR, K> rowKeyGetter={rowKeyGetter} rows={data} className="rdg-light" columns={draggableColumns} {...otherProps} />
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
