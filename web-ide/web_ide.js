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
}
const completionToCompletionItem = item => {
  const ret = {
    label: item.get('label'),
    insertText: item.get('label'),
    sortText: item.get('sort_text'),
  }
  if (item.has('kind')) ret.kind = item.get('kind')
  else if (item.has('type')) ret.kind = monaco.languages.CompletionItemKind[capitalize(item.get('type'))]
  return ret
}
const snippetToCompletionItem = item => ({
  label: item.prefix,
  kind: monaco.languages.CompletionItemKind.Snippet,
  documentation: item.description,
  insertText: item.body.join('\n'),
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
})
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const scrollLogsToBottom = () => {
  const logs = document.querySelector('div[data-test="logs"]').parentElement
  logs.scrollTop = logs.scrollHeight
}
require(['vs/editor/editor.main'], async () => {
  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', "'", '"'],
    provideCompletionItems: async (model, position) => {
      const pyRes = window.pyodide.runPython(`get_wave_completions($${position.lineNumber - 1}, $${position.column - 1}, \'\'\'$${model.getValue()}\'\'\')`)
      const completions = pyRes ? pyRes.toJs().map(completionToCompletionItem) : []
      // HACK: Fetch on every keystroke due to weird bug in monaco - showing snippets only for first example.
      let [snippets1, snippets2] = await Promise.all([
        fetch('$snippets1').then(r => r.json()),
        fetch('$snippets2').then(r => r.json()),
      ])
      snippets1 = Object.values(snippets1).map(snippetToCompletionItem)
      snippets2 = Object.values(snippets2).map(snippetToCompletionItem)
      const jediRes = window.pyodide.runPython(`get_jedi_completions($${position.lineNumber}, $${position.column - 1}, \'\'\'$${model.getValue()}\'\'\')`)
      const jediCompletions = jediRes ? jediRes.toJs().map(completionToCompletionItem) : []
      return { suggestions: [...completions, ...jediCompletions, ...snippets1, ...snippets2] }
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
  window.editor = editor
  window.emit_debounced = window.wave.debounce(2000, window.wave.emit)
  editor.onDidChangeModelContent(e => {
    if (e.isFlush) return
    emit_debounced('editor', 'change', editor.getValue())
  })
})

setTimeout(async () => {
  window.pyodide = await loadPyodide()
  await window.pyodide.loadPackage('parso')
  await window.pyodide.loadPackage('jedi')
  await window.pyodide.runPythonAsync(`$py_content`)
}, 100)
