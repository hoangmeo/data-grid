import { Column, SelectColumn } from 'react-data-grid';
import faker from 'faker';

export interface CompanyType {
    id: number;
    title: string;
    client: string;
    area: string;
    country: string;
    contact: string;
    assignee: string;
    progress: number;
    startTimestamp: number;
    endTimestamp: number;
    budget: number;
    transaction: string;
    account: string;
    version: string;
    available: boolean;
}
export const columns: Column<CompanyType>[] = [
    SelectColumn,
    {
        key: 'id',
        name: 'ID',
        width: 60,
        frozen: true,
        sortable: true,
        resizable: true,
        formatter: (x) => {
            return <div style={{ color: 'red' }}>{x.row.id}</div>;
        },
        editor: () => {
            return <input autoFocus />;
        },
    },
    {
        key: 'title',
        name: 'Task',
        width: 120,
        frozen: true,
        sortable: true,
    },
    {
        key: 'client',
        name: 'Client',
        width: 220,
        sortable: true,
        resizable: true,
    },
    {
        key: 'area',
        name: 'Area',
        width: 120,
    },
    {
        key: 'country',
        name: 'Country',
        width: 180,
    },
    {
        key: 'contact',
        name: 'Contact',
        width: 160,
    },
    {
        key: 'assignee',
        name: 'Assignee',
        width: 150,
    },
    {
        key: 'progress',
        name: 'Completion',
        width: 110,
    },
    {
        key: 'startTimestamp',
        name: 'Start date',
        width: 100,
    },
    {
        key: 'endTimestamp',
        name: 'Deadline',
        width: 100,
    },
    {
        key: 'budget',
        name: 'Budget',
        width: 100,
    },
    {
        key: 'transaction',
        name: 'Transaction type',
    },
    {
        key: 'account',
        name: 'Account',
        width: 150,
    },
    {
        key: 'version',
        name: 'Version',
    },
    {
        key: 'available',
        name: 'Available',
        width: 80,
    },
];
const createFakeData = () => {
    const now = Date.now();

    const rows: CompanyType[] = [];
    for (let i = 0; i < 10; i++) {
        rows.push({
            id: i,
            title: `Task #${i + 1}`,
            client: faker.company.companyName(),
            area: faker.name.jobArea(),
            country: faker.address.country(),
            contact: faker.internet.exampleEmail(),
            assignee: faker.name.findName(),
            progress: Math.random() * 100,
            startTimestamp: now - Math.round(Math.random() * 1e10),
            endTimestamp: now + Math.round(Math.random() * 1e10),
            budget: 500 + Math.random() * 10500,
            transaction: faker.finance.transactionType(),
            account: faker.finance.iban(),
            version: faker.system.semver(),
            available: Math.random() > 0.5,
        });
    }

    return rows;
};
export const fakeData = createFakeData();
