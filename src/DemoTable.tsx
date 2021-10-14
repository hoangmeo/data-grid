import React, { ReactElement, useState } from 'react';
import { SortColumn } from 'react-data-grid';
import { CompanyType, columns, fakeData } from './demodata';
import NTAGrid from './NTAGrid/NTAGrid';
import { HeaderFilterType } from './NTAGrid/type';
export default function DemoTable(): ReactElement {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(() => new Set());
    const [pageIndex, setPageIndex] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [sortColumns, setSortColumns] = useState<SortColumn[]>([
        {
            columnKey: 'id',
            direction: 'ASC',
        },
    ]);

    const getData = () => {
        setLoading(true);
        window.setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    React.useEffect(() => {
        getData();
        console.log(sortColumns);
    }, [sortColumns, pageIndex, pageSize]);

    return (
        <NTAGrid<CompanyType, unknown, number>
            loading={loading}
            columns={columns}
            rows={fakeData}
            selectedRows={selectedRows}
            sortColumns={sortColumns}
            pagination={{
                page: pageIndex,
                pageSize: pageSize,
                rowCount: 21,
            }}
            onPageIndexChange={(v) => setPageIndex(v)}
            onPageSizeChange={(v) => setPageSize(v)}
            onSortColumnsChange={setSortColumns}
            onSelectedRowsChange={(t: Set<number>) => {
                setSelectedRows(t);
            }}
            headerFilter={{
                id: { type: HeaderFilterType.NUMBER },
                title: { type: HeaderFilterType.TEXT },
                startTimestamp: { type: HeaderFilterType.DATETIME },
                transaction: {
                    type: HeaderFilterType.LIST,
                    list: [
                        {
                            label: 'Deposit',
                            value: 'deposit',
                        },
                        {
                            label: 'Payment',
                            value: 'payment',
                        },
                        {
                            label: 'Withdrawal',
                            value: 'withdrawal',
                        },
                    ],
                },
            }}
        />
    );
}
