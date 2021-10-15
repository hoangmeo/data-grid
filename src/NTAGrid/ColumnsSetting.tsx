import { Button, FormControlLabel, Popover, Switch, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Column } from 'react-data-grid';
import { useLocation } from 'react-router-dom';
import { getColConfig, saveColConfig, clearColConfig } from './utils';

interface Props {
    originColumns: readonly Column<any, any>[];
    columns: readonly Column<any, any>[];
    onColumnsChange: (c: readonly Column<any, any>[]) => void;
    onColumnsDisplayChange: (hiddenCols: string[]) => void;
    columnsKeyConfig?: string;
}
export default function ColumnsSetting({ originColumns, columns, onColumnsDisplayChange, onColumnsChange, columnsKeyConfig }: Props): ReactElement {
    const { pathname } = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorPinEl, setAnchorPinEl] = React.useState(null);
    const [hiddenCols, setHiddenCols] = React.useState<string[]>([]);

    React.useEffect(() => {
        setHiddenCols(getColConfig(pathname, columnsKeyConfig));
    }, [pathname, columnsKeyConfig]);

    React.useEffect(() => {
        saveColConfig(pathname, hiddenCols, columnsKeyConfig);
    }, [hiddenCols]);

    // function

    const onChange = (checked: boolean, key: string) => {
        let _hiddenCols = [];
        if (checked) {
            _hiddenCols = hiddenCols.filter((x) => x !== key);
        } else {
            _hiddenCols = Array.from(new Set([...hiddenCols, key]));
        }
        setHiddenCols(_hiddenCols);
        onColumnsDisplayChange(_hiddenCols);
    };

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePinClick = (event: any) => {
        setAnchorPinEl(event.currentTarget);
    };
    const onPinColChange = (col: Column<any, any>, checked: boolean) => {
        let _cols: any[] = [...columns.map((c) => ({ ...c }))];
        for (var i = 0; i < _cols.length; i++) {
            if (_cols[i].key === col.key) {
                _cols[i].frozen = checked;
                break;
            }
        }
        onColumnsChange(_cols);
    };
    const reset = () => {
        clearColConfig(pathname, columnsKeyConfig);
        setHiddenCols([]);
        onColumnsChange([...originColumns]);
    };
    const isOpen = Boolean(anchorEl);
    const isPinOpen = Boolean(anchorPinEl);

    return (
        <div>
            <Button onClick={handleClick}>Columns Config</Button>
            <Button onClick={handlePinClick}>Pin column</Button>
            <Button onClick={reset}>Reset</Button>

            <Popover
                anchorEl={anchorEl}
                open={isOpen}
                onClose={() => setAnchorEl(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{ padding: 20 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Columns Config
                    </Typography>

                    {originColumns
                        ?.filter((x) => x.name)
                        .map((col) => {
                            return (
                                <div key={col.key}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                defaultChecked={!hiddenCols.includes(col.key)}
                                                onChange={(e, checked) => {
                                                    onChange(checked, col.key);
                                                }}
                                            />
                                        }
                                        label={col.name}
                                    />
                                </div>
                            );
                        })}
                </div>
            </Popover>
            <Popover
                anchorEl={anchorPinEl}
                open={isPinOpen}
                onClose={() => setAnchorPinEl(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{ padding: 20 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Pin column
                    </Typography>

                    {columns
                        ?.filter((x) => x.name)
                        .map((col) => {
                            return (
                                <div key={col.key}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                defaultChecked={!!col.frozen}
                                                onChange={(e, checked) => {
                                                    onPinColChange(col, checked);
                                                }}
                                            />
                                        }
                                        label={col.name}
                                    />
                                </div>
                            );
                        })}
                </div>
            </Popover>
        </div>
    );
}
