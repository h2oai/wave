import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './editor';
import { editor } from './model'

ReactDOM.render(
	<React.StrictMode>
		<div>
			<button onClick={editor.loadApp}>Load app</button>
			<button onClick={editor.startApp}>Start app</button>
			<button onClick={editor.stopApp}>Stop app</button>
		</div>
		<Editor />
		<iframe src='/sample_app' width='100%' height='400' />
	</React.StrictMode>,
	document.getElementById('root')
);
