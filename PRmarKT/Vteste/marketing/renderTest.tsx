import React from 'react';
import { renderToString } from 'react-dom/server';
import AnalyticsCenter from './src/components/AnalyticsCenter';

try {
  console.log(renderToString(<AnalyticsCenter />).substring(0, 50));
  console.log('SUCCESS');
} catch (e) {
  console.error('ERROR RENDER:', e);
}
