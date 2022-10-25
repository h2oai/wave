require.config({
  paths: {
    'vs': 'assets/monaco',
    'pyodide': 'assets/pyodide/pyodide.js'
  }
})
window.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    const { origin } = window.location
    return `$${origin}$${'$baseURL'}assets/monaco/base/worker/workerMain.js`
  }
}
const completionToCompletionItem = item => ({
  label: item.get('label'),
  kind: item.get('kind'),
  insertText: item.get('label'),
  sortText: item.get('sort_text'),
})
const snippetToCompletionItem = item => ({
  label: item.prefix,
  kind: monaco.languages.CompletionItemKind.Snippet,
  documentation: item.description,
  insertText: item.body.join('\n'),
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
})
require(['vs/editor/editor.main', 'pyodide'], async () => {
  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', "'", '"'],
    provideCompletionItems: async (model, position) => {
      const pyRes = await window.pyodide.runPython(`get_wave_completions($${position.lineNumber - 1}, $${position.column - 1}, \'\'\'$${model.getValue()}\'\'\')`)
      const completions = pyRes ? pyRes.toJs().map(completionToCompletionItem) : []
      // HACK: Fetch on every keystroke due to weird bug in monaco - showing snippets only for first example.
      let [snippets1, snippets2] = await Promise.all([
        fetch('$snippets1').then(r => r.json()),
        fetch('$snippets2').then(r => r.json()),
      ])
      snippets1 = Object.values(snippets1).map(snippetToCompletionItem)
      snippets2 = Object.values(snippets2).map(snippetToCompletionItem)
      return { suggestions: [...completions, ...snippets1, ...snippets2] }
    }
  })
  const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: '',
    language: 'python',
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollbar: { vertical: 'hidden' },
    overviewRulerBorder: false,
  })
  editor.onDidChangeModelContent(e => {
    if (e.isFlush) return
    emit_debounced('editor', 'change', editor.getValue())
  })
  window.editor = editor
  window.emit_debounced = window.wave.debounce(2000, window.wave.emit)
  window.pyodide = await window.loadPyodide()
  await window.pyodide.loadPackage('parso')
  await window.pyodide.loadPackage('jedi')
  await window.pyodide.runPythonAsync(`$py_content`)
})
