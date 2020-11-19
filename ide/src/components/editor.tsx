import { bond, Box, on } from '@/dataflow'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker'
import React from 'react'

declare global {
  interface Window { MonacoEnvironment: monaco.Environment | undefined }
}
self.MonacoEnvironment = { getWorker: () => new EditorWorker() }

type EditorProps = {
  contentB: Box<string>,
  cursorPositionB: Box<monaco.Position | null>,
  onContentSave: (val: string) => Promise<void>
  onContentChange: (val: string) => void
  onCursorChange: (position: monaco.Position | null) => void
}

export default bond(({ contentB, cursorPositionB, onContentSave, onContentChange, onCursorChange }: EditorProps) => {
  let ed: monaco.editor.IStandaloneCodeEditor

  const
    divEl = React.createRef<HTMLDivElement>(),
    init = () => {
      if (!divEl.current) return
      ed = monaco.editor.create(divEl.current, {
        value: contentB(),
        language: 'python',
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true
      })

      // Save on Ctrl+S
      ed.addAction({
        id: 'save-content',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        run: ed => onContentSave(ed.getValue())
      })
      // Flush means the content was changed programatically.
      ed.onDidChangeModelContent(({ isFlush }) => { if (!isFlush) onContentChange(ed.getValue()) })
      // Save cursor only on user action, not content flush.
      ed.onDidChangeCursorPosition(({ position, reason }) => { if (reason === monaco.editor.CursorChangeReason.Explicit) onCursorChange(position) })

      on(contentB, content => ed.setValue(content))
      on(cursorPositionB, position => {
        ed.focus()
        ed.setPosition(position || new monaco.Position(1, 1))
      })
    },
    dispose = () => ed.dispose(),
    render = () => <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} ref={divEl}></div>
  return { init, render, contentB, cursorPositionB, dispose }
})