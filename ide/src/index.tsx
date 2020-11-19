import { initializeIcons } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

initializeIcons()

ReactDOM.render(<App />, document.getElementById('root'))