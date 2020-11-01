import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { write_file } from './ide'


// @ts-ignore
self.MonacoEnvironment = {
	getWorkerUrl: function (_moduleId: any, label: string) {
		if (label === 'json') {
			return './json.worker.bundle.js'
		}
		if (label === 'css') {
			return './css.worker.bundle.js'
		}
		if (label === 'html') {
			return './html.worker.bundle.js'
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js'
		}
		return './editor.worker.bundle.js'
	}
}

export const Editor: React.FC = () => {
	const divEl = useRef<HTMLDivElement>(null)
	let editor: monaco.editor.IStandaloneCodeEditor
	useEffect(() => {
		if (divEl.current) {
			editor = monaco.editor.create(divEl.current, {
				value: "@app('/demo')\nasync def serve(q: Q):\n\tpass",
				language: 'python',
				theme: 'vs-dark',
			})
			// Save on Ctrl+S
			editor.addAction({
				id: 'save-content',
				label: 'Save',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
				run: async (editor) => {
					const src = editor.getValue()
					await write_file('sample_app', 'app.py', src)
				}
			})
		}
		return () => {
			editor.dispose()
		}
	}, [])
	return <div className="Editor" ref={divEl}></div>
}
