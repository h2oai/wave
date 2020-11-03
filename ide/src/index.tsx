import { initializeIcons } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

initializeIcons()

ReactDOM.render(<App />, document.getElementById('root'))

// ReactDOM.render(
// 	<React.StrictMode>
// 		<div>
// 			<button onClick={editor.loadApp}>Load app</button>
// 			<button onClick={editor.startApp}>Start app</button>
// 			<button onClick={editor.stopApp}>Stop app</button>
// 		</div>
// 		<Editor />
// 		<iframe src='/sample_app' width='100%' height='400' />
// 	</React.StrictMode>,
// 	document.getElementById('root')
// );