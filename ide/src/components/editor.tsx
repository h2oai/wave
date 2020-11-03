import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { editor } from './model'
import { on } from './dataflow'


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
  let ed: monaco.editor.IStandaloneCodeEditor
  useEffect(() => {
    if (divEl.current) {
      ed = monaco.editor.create(divEl.current, {
        value: editor.contentB(),
        language: 'python',
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true
      })

      // Save on Ctrl+S
      let isCapturing = false
      ed.addAction({
        id: 'save-content',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        run: (ed) => {
          isCapturing = true
          editor.contentB(ed.getValue())
          isCapturing = false
        }
      })

      on(editor.contentB, (content) => {
        if (isCapturing) return
        ed.setValue(content)
      })
    }
    return () => {
      ed.dispose()
    }
  }, [])
  return <div style={{ width: '100%', height: '100%' }} ref={divEl}></div>
}
