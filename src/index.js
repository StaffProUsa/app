/* global __DEV__ */
import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';

export const registerServiceWorker = () => {
    console.log("Try register")
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then(function (registration) {
                return registration.scope;
            })
            .catch(function (err) {
                return err;
            });
    }
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

registerServiceWorker();
