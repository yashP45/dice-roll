import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {store , persistor} from './store/store';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react';

import './index.css';
import Login from './components/Login';
import Betting from './components/Betting';
import Register from './components/Register';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<Login/>
    ),
  },
  {
    path: "register",
    element: (<Register/>
    ),
  },
  {
    path: "bet",
    element: (<Betting/>)
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);