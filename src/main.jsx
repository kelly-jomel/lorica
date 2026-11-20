import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerWebMCPTools } from './services/webMcpService';

// Initialize WebMCP tools for in-browser AI agents
registerWebMCPTools();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
