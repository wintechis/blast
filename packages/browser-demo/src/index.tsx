import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;

// Create a root.
const root = ReactDOM.createRoot(container);

// Render into the root.
root.render(<App />);
