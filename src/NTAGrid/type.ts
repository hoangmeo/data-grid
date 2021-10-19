export enum HeaderFilterType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    LIST = 'LIST',
    DATETIME = 'DATETIME',
}
export enum FilterCondition {
    StartsWith = 'StartsWith',
    EndWith = 'EndWith',
    Contains = 'Contains',
    Equal = 'Equal',
    NotEqual = 'NotEqual',
}
export interface HeaderFilterElm<T = any> {
    type: HeaderFilterType;
    list?: { value: string | number; label: string }[];
    toValue?: (v: T) => string | number;
}
export interface HeaderFilter<T> {
    [key: string]: HeaderFilterElm<T>;
}

export interface FilterItemValue {
    type: HeaderFilterType;
    value?: any;
    from?: any;
    to?: any;
    condition?: FilterCondition;
}
