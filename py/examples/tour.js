require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } })

window.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/'
      };
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/base/worker/workerMain.js');`
    )}`
  }
}

require(['vs/editor/editor.main'], function () {
  const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: ['def x(): ', '\tprint("Hello world!")'].join('\\n'),
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
  const toCompletionItem = item => ({
    label: item.prefix,
    kind: monaco.languages.CompletionItemKind.Snippet,
    documentation: item.description,
    insertText: item.body,
  })
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: async () => {
      const [snippets1, snippets2] = await Promise.all([
        fetch('/snippets/python/1.json').then(r => r.json()),
        fetch('/snippets/python/1.json').then(r => r.json()),
      ])
      return { suggestions: [...snippets1.map(toCompletionItem), ...snippets2.map(toCompletionItem)] }
    }
  })
})