//

import { Tooltip } from '@material-ui/core';
import { NTAColumnType } from './type';
import { showMessage } from '../NTAMessage';
export const COLUMNS_CONFIG_KEY = 'NTA_COLUMNS_CONFIG_KEY';

export const clearColConfig = (_path: string, key?: string) => {
    saveColConfig(_path, null, key);
};
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
export const COLUMNS_ORDER_KEY = 'NTA_COLUMNS_ORDER_KEY';
export const saveOrderColConfig = (_path: string, keys: string[], key?: string) => {
    let config: any = {};
    let path = _path + (key || '');
    try {
        let configString = localStorage.getItem(COLUMNS_CONFIG_KEY) || '';
        config = JSON.parse(configString) || {};
    } catch {}
    if (!keys) {
        delete config[path];
    } else {
        config[path] = keys.join(',');
    }
    localStorage.setItem(COLUMNS_CONFIG_KEY, JSON.stringify(config));
};
export const getOrderColConfig = (_path: string, keys: string[], key?: string) => {
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

export const ntaFormater = (value: any, type?: NTAColumnType): string | undefined | null | JSX.Element => {
    switch (type) {
        case 'CURRENCY':
            return value;
        case 'DATE':
            // return date format
            return value;
        case 'DATETIME':
            // return date format
            return value;
        case 'HTML':
            return <div onClick={() => showMessage('content', value)}>......</div>;
        case 'LONGTEXT':
            return (
                <Tooltip title={value}>
                    <span>{value}</span>
                </Tooltip>
            );
        case 'TEXT':
            return value;
        default:
            return (
                <Tooltip title={value}>
                    <span>{value}</span>
                </Tooltip>
            );
    }
};
