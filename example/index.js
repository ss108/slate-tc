import { createRoot } from 'react-dom/client';

import TrackChangesExample from "./TrackChangesExample";

const container = document.getElementById('root');
const root = createRoot(container);


root.render(<TrackChangesExample />);