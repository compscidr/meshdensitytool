import React from 'react';
import ReactDOM from 'react-dom';
import AppUI from './AppUI';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppUI />, div);
  ReactDOM.unmountComponentAtNode(div);
});
