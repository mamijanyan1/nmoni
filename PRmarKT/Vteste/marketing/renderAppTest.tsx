import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';
try {
  renderToString(<App />);
  console.log('APP SUCCESS');
} catch (e) {
  console.error('APP ERROR:', e);
}
