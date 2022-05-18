require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } })
window.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    return `data:text/javascript;charset=utf-8,$${encodeURIComponent(`
      self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/'
      };
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/base/worker/workerMain.js');`
    )}`
  }
};

(async () => {
  window.pyodide = await loadPyodide()
  window.pyodide.loadPackage('parso')
})()

require(['vs/editor/editor.main'], function () {
  const snippetToCompletionItem = item => ({
    label: item.prefix,
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: item.description,
    insertText: item.body.join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  })
  const completionToCompletionItem = item => ({
    label: item.get('label'),
    kind: item.get('kind'),
    insertText: item.get('label'),
    sortText: item.get('sort_text'),
  })
  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', "'", '"'],
    provideCompletionItems: async (model, position) => {
      if (!window.code_snippets) {
        const [snippets1, snippets2] = await Promise.all([
          fetch('$snippets1').then(r => r.json()),
          fetch('$snippets2').then(r => r.json()),
        ])
        window.code_snippets = [
          ...Object.values(snippets1).map(snippetToCompletionItem),
          ...Object.values(snippets2).map(snippetToCompletionItem)
        ]
      }
      const pyRes = window.pyodide.runPython(`$py_content`)
      const completions = pyRes ? pyRes.toJs().map(completionToCompletionItem) : []
      return { suggestions: [...completions, ...window.code_snippets] }
    }
  })
  const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: '',
    language: 'python',
    minimap: {
      enabled: false
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollbar: {
      vertical: 'hidden'
    },
    overviewRulerBorder: false,
  })
  window.editor = editor
  window.emit_debounced = window.wave.debounce(2000, window.wave.emit)
  editor.onDidChangeModelContent(e => {
    if (e.isFlush) return
    emit_debounced('editor', 'change', editor.getValue())
  })
})