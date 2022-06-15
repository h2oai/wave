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
    automaticLayout: true
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

// Tree file viewer.
const Tree = {
  props: { folder: { type: Object, required: false }, },
  data() { return { isSubtreeOpen: true } },
  methods: {
    onContextMenu(e) {
      eventBus.emit('menu', { e, folder: this.folder })
    },
    onClick(e) {
      if (!document.querySelector('.menu')) this.isSubtreeOpen = !this.isSubtreeOpen
      eventBus.emit('documentClick', e)
    }
  },
  template: `
<li>
    <input v-if="folder.action === 'new'" type="text" v-model="folder.label" @keyup.enter="folder.action=null">
    <input v-else-if="folder.action === 'rename'" type="text" v-model="folder.label" @keyup.enter="folder.action=null">
    <span v-else @contextmenu.prevent="onContextMenu" @click.stop="onClick">{{folder.label}}</span>
    <ul v-if="isSubtreeOpen && folder.isFolder && folder.children">
      <li v-for="folder in folder.children">
        <Tree :folder="folder"></Tree>
      </li>
    </ul>  
</li>
    `}
const Menu = {
  mounted() {
    this.bus.on('menu', ({ e, folder }) => {
      this.menuPosition = { x: e.x + 10, y: e.y - 20 }
      this.folder = folder
    })
    this.bus.on('documentClick', e => { if (!this.$$el.contains(e.target)) this.menuPosition = null })
  },
  data() {
    return {
      menuPosition: null,
      folder: null
    }
  },
  methods: {
    newFile() {
      this.folder.children.push({ label: '', action: 'new', isFolder: false })
      this.menuPosition = null
      // window.parent.wave.emit('editor', 'new_file', {path:this.folder.path, name: this})
    },
    newFolder() {
      this.folder.children.push({ label: '', action: 'new', isFolder: true })
      this.menuPosition = null
    },
    remove() {
      this.folder.children = []
      this.folder.label = ''
      window.parent.wave.emit('editor', 'remove', this.folder.path)
      this.menuPosition = null
    },
    rename() {
      this.folder.action = 'rename'
      this.menuPosition = null
    },
  },
  template: `
      <ul v-if="menuPosition && folder" class='menu' :style="{top: menuPosition.y + 'px', left: menuPosition.x + 'px'}">
        <li @click="newFile">New file</li>
        <li @click="newFolder">New folder</li>
        <li @click="remove">Delete</li>
        <li @click="rename">Rename</li>
      </ul>
    `}
class EventBus {
  constructor() {
    this.events = {}
  }
  on(eventName, fn) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  }
  emit(eventName, data) {
    if (this.events[eventName]) this.events[eventName].forEach(fn => fn(data))
  }
}
const eventBus = new EventBus()
const app = Vue.createApp({
  mounted() {
    this.bus.on('folder', folder => this.folder = folder)
  },
  data() { return { folder: {} } },
  template: `
      <ul><Tree :folder="folder" /></ul>
      <Teleport to="#file-tree-menu"><Menu/></Teleport>
      `
})
app.config.globalProperties.bus = eventBus
app.component('Tree', Tree)
app.component('Menu', Menu)
app.mount('#file-tree')
document.onclick = e => eventBus.emit('documentClick', e)
eventBus.emit("folder", $folder)