import '@/assets/styles/tailwind.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import 'mantine-datatable/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
