import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppUI from './AppUI';
import AppStats from './AppStats';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppUI />, document.getElementById('app-ui'))
ReactDOM.render(<AppStats />, document.getElementById('app-stats'))
registerServiceWorker();
