import { Button, FormControlLabel, Popover, Switch, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Column } from 'react-data-grid';

interface Props {
    columns: readonly Column<any, any>[];
    onColumnsDisplayChange: (hiddenCols: string[]) => void;
}

export default function ColumnsSetting({ columns, onColumnsDisplayChange }: Props): ReactElement {
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
        onColumnsDisplayChange(hiddenCols);
    }, [hiddenCols]);

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
