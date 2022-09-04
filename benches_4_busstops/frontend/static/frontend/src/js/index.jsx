import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import '../scss/app.scss';

const container = document.getElementById('app-container');
render(<App />, container);
