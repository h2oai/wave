// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
  return <div className="Editor" ref={divEl}></div>
}
