import React from 'react';
import "./style.css"
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';

const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        staleTime: 60*1000
      }
    }
  })
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </QueryClientProvider>
    </AuthContextProvider>
);