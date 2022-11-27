import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import '../scss/app.scss';

/**
 * @file
 * Renders our application inside the provided app-container, with USWDS support.
 */

const container = document.getElementById('app-container');
render(<App />, container);
