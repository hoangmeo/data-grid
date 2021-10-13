import { Button, FormControlLabel, Popover, Switch, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Column } from 'react-data-grid';
import { useLocation } from 'react-router-dom';

//
export const COLUMNS_CONFIG_KEY = 'COLUMNS_CONFIG_KEY';
export const getColConfig = (_path: string, key?: string): string[] => {
    let path = _path + (key || '');
    try {
        let configString = localStorage.getItem(COLUMNS_CONFIG_KEY);
        if (configString) {
            const config = JSON.parse(configString);
            if (config && config[path]) return config[path].split(',');
        }
        return [];
    } catch (error) {
        return [];
    }
};

export const saveColConfig = (_path: string, items: string[] | null, key?: string) => {
    let config: any = {};
    let path = _path + (key || '');
    try {
        let configString = localStorage.getItem(COLUMNS_CONFIG_KEY) || '';
        config = JSON.parse(configString) || {};
    } catch {}
    if (!items) {
        delete config[path];
    } else {
        config[path] = items.join(',');
    }
    localStorage.setItem(COLUMNS_CONFIG_KEY, JSON.stringify(config));
};
//
interface Props {
    columns: readonly Column<any, any>[];
    onColumnsDisplayChange: (hiddenCols: string[]) => void;
    columnsKeyConfig?: string;
}
export default function ColumnsSetting({ columns, onColumnsDisplayChange, columnsKeyConfig }: Props): ReactElement {
    const { pathname } = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [hiddenCols, setHiddenCols] = React.useState<string[]>([]);

    const onChange = (checked: boolean, key: string) => {
        if (checked) {
            setHiddenCols((cols) => cols.filter((x) => x !== key));
        } else {
            setHiddenCols((cols) => Array.from(new Set([...cols, key])));
        }
    };

    React.useEffect(() => {
        setHiddenCols(getColConfig(pathname, columnsKeyConfig));
    }, [pathname, columnsKeyConfig]);

    React.useEffect(() => {
        onColumnsDisplayChange(hiddenCols);
    }, [hiddenCols]);

    React.useEffect(() => {
        saveColConfig(pathname, hiddenCols, columnsKeyConfig);
    }, [hiddenCols]);

    // function
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const isOpen = Boolean(anchorEl);

    return (
        <div>
            <Button onClick={handleClick}>Columns Config</Button>
            <Popover
                anchorEl={anchorEl}
                open={isOpen}
                onClose={() => setAnchorEl(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{ padding: 20 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>

                    {columns
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
        </div>
    );
}
