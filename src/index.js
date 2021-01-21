import React from 'react';
import { render } from 'react-dom';

import App from './App';
import RedditContext from './components/RedditContext';

render(
  <RedditContext>
    <App />
  </RedditContext>,
  document.getElementById('root'),
);