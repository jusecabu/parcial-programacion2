import './index.css';
import { createRoot } from 'react-dom/client';
import { $ } from './lib/functions/dom.ts';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { StrictMode } from 'react';

const root = $('#root')!;

createRoot(root).render(
    <BrowserRouter>
        <StrictMode>
            <App />
        </StrictMode>
    </BrowserRouter>
);
