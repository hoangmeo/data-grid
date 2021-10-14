import React from 'react';
import { Box, Typography, Select, FormControl, MenuItem, makeStyles } from '@material-ui/core';
import { Pagination, PaginationItem } from '@material-ui/lab';

// Create styles for select option change page size
const selectStyles = makeStyles((theme) => ({
    root: {
        marginLeft: '10px',
        '& .MuiInputBase-root': {
            fontSize: '0.875rem',
            lineHeight: '1.375',
            '& .MuiOutlinedInput-notchedOutline': {
                top: 0,
            },
            '& .MuiOutlinedInput-inputMarginDense': {
                padding: '0.42rem 1.15625rem',
                paddingRight: '2rem',
                backgroundColor: '#ffffff',
            },
            '&.Mui-disabled': {
                '& fieldset': {
                    top: 0,
                },
                '& .MuiSelect-root': {
                    backgroundColor: '#E9ECEE',
                },
            },
        },
    },
    wrapper: {
        margin: '10px 20px',
    },
}));

const paginationItem = makeStyles((theme) => ({
    root: {
        '& .MuiPaginationItem-page': {
            border: '1px solid #d9d9d9',
            borderRadius: '2px',
            margin: '2px',
        },
        '& .Mui-selected': {
            background: '#fff',
            border: '1px solid #004f94',
        },
    },
}));

interface Props {
    rowCount: number;
    page: number;
    pageSize: number;
    onPageSizeChange?: (pageSize: number) => void;
    onPageIndexChange?: (page: number) => void;
}
const rowsPerPageOptions = [10, 20, 30, 40, 50, 100, 200, 500, 1000];

const CustomPagination = ({ rowCount, page, pageSize, onPageIndexChange, onPageSizeChange }: Props): JSX.Element => {
    // Get Loading status

    // Calculate from/to value
    const totalPage = React.useMemo(() => {
        return Math.ceil(rowCount / (pageSize || 1));
    }, [rowCount, pageSize]);

    const from = rowCount === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = rowCount !== -1 ? Math.min(rowCount, page * pageSize) : page * pageSize;

    return (
        <Box display="flex" width="100%" justifyContent="space-between" flex="2" className={selectStyles().wrapper}>
            <Box display="flex" alignItems="center">
                <Typography color="inherit" variant="body2">
                    ページあたりの行数:
                </Typography>
                <FormControl size="small" variant="outlined" className={selectStyles().root}>
                    <Select
                        value={pageSize}
                        onChange={(e) => {
                            onPageSizeChange && onPageSizeChange(e.target.value as any);
                        }}
                    >
                        {rowsPerPageOptions?.map((r) => (
                            <MenuItem key={`${r}-rowPerPageOption`} value={r}>
                                {r}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography color="inherit" variant="body2">
                    {`${rowCount}項目中${from}〜${to}項目`}
                </Typography>
                <Pagination
                    className={paginationItem().root}
                    count={totalPage}
                    page={page}
                    onChange={(event, value) => {
                        onPageIndexChange && onPageIndexChange(value);
                    }}
                    shape="rounded"
                    size="medium"
                    renderItem={(item) => <PaginationItem {...item} />}
                />
            </Box>
        </Box>
    );
};

export default CustomPagination;
