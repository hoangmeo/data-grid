import React from 'react';
import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions';
import TextMessage from './TextMessage';
import { replaceMentionValues } from './utils';
import DemoTable from './DemoTable';
const demoData: SuggestionDataItem[] = [
    { id: 1, display: 'Hoang' },
    { id: 2, display: 'Dat' },
    { id: 3, display: 'Nguyen Hoang' },
    { id: 4, display: 'Nguyen Duc Dat' },
];

function App() {
    const [value, setValue] = React.useState('');
    const mentionUserIds = React.useMemo(() => {
        const ids: string[] = [];
        replaceMentionValues(value, (info) => {
            ids.push(info.id);
            return info.id;
        });
        return ids;
    }, [value]);
    return (
        <div className="App">
            {/* demo mentions */}
            <MentionsInput value={value} onChange={(e, v) => setValue(v)} allowSpaceInQuery={true}>
                <Mention trigger="@" data={demoData} />
            </MentionsInput>
            <TextMessage message={value} />
            <div>mentions ids :{mentionUserIds.join(',')}</div>
            {/* demo data grid */}
            <DemoTable />
        </div>
    );
}

export default App;
