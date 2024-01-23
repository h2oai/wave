require.config({
  paths: {
    'vs': '$base_url' + 'assets/monaco',
    'pyodide': '$base_url' + 'assets/pyodide/pyodide.js'
  }
})
window.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    const { origin } = window.location
    return `$${origin}$${'$base_url'}assets/monaco/base/worker/workerMain.js`
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
require(['vs/editor/editor.main', 'pyodide'], async () => {
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
    value: `$file_content`,
    language: 'python',
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollbar: { vertical: 'hidden' },
    overviewRulerBorder: false,
    automaticLayout: true
  })
  window.editor = editor
  window.emit_debounced = window.wave.debounce(1000, window.wave.emit)
  window.pyodide = await window.loadPyodide()
  await window.pyodide.loadPackage('parso')
  await window.pyodide.loadPackage('jedi')
  await window.pyodide.runPythonAsync(`$py_content`)
  editor.onDidChangeModelContent(e => {
    if (e.isFlush) return
    emit_debounced('editor', 'change', editor.getValue())
  })
})

const iconLabels = {
  'css': 'language-css3',
  'gif': 'file-gif-box',
  'html': 'language-html5',
  'jpeg': 'file-jpg-box',
  'jpg': 'file-jpg-box',
  'js': 'language-javascript',
  'json': 'code-json',
  'md': 'book-open',
  'png': 'file-png-box',
  'py': 'language-python',
  'svg': 'svg',
  'txt': 'file-document',
  'xml': 'file-xml-box',
  'zip': 'folder-zip',
}

const baseUrl = '$base_url'

const
  getIconSrc = (folder, isSubtreeOpen) => {
    if (folder.isFolder) return isSubtreeOpen ? baseUrl + 'assets/img/folder-open.svg' : baseUrl + 'assets/img/folder.svg'
    if (folder.path) return baseUrl + `assets/img/file-icons/$${iconLabels[folder.path.split('.').pop()] || 'file'}.svg`
  },
  getItemLeftPadding = (folder) => {
    if (folder.path) return (folder.path.split('/').length - (folder.action === 'new' ? 0 : 1)) * 0.7 + 'rem'
  }

// Tree file viewer.
const Tree = {
  mounted() {
    this.bus.on('openFolder', (path) => {
      if (this.folder.path === path) this.isSubtreeOpen = true
    })
  },
  props: {
    folder: { type: Object, required: false },
    activeFile: { type: String, required: true }
  },
  data() { return { isSubtreeOpen: !this.folder.path } },
  methods: {
    onContextMenu(e) {
      eventBus.emit('menu', { e, folder: this.folder })
    },
    onCreated() {
      this.folder.action = null
      window.parent.wave.emit('file_viewer', this.folder.isFolder ? 'new_folder' : 'new_file', { path: this.folder.path, name: this.folder.label })
    },
    onRenamed() {
      this.folder.action = null
      window.parent.wave.emit('file_viewer', this.folder.isFolder ? 'rename_folder' : 'rename_file', { path: this.folder.path, name: this.folder.label })
    },
    onCreateCanceled() {
      this.folder.label = ''
      this.folder.action = null
    },
    onRenameCanceled() {
      this.folder.action = null
      // HACK: blur is fired after keyup resulting in calling onRenameCanceled twice 
      // condition prevents from assigning 'null' to 'folder.label' on second call
      // TODO: prevent blur event after keyup
      if (this.folder._labelCache) this.folder.label = this.folder._labelCache
      this.folder._labelCache = null
    },
    handleSelect(e) {
      const
        labelLength = this.folder.label.length,
        extensionLength = this.folder.label.split('.').pop().length
      this.$$nextTick(() => {
        e.target.setSelectionRange(0, labelLength - (extensionLength ? extensionLength + 1 : 0))
      })
    },
    onClick(e) {
      if (this.folder.action === 'rename') return
      if (!document.querySelector('.menu')) this.isSubtreeOpen = !this.isSubtreeOpen
      eventBus.emit('documentClick', e)
      if (!this.folder.isFolder) {
        this.activeFile = this.folder.path
        window.parent.wave.emit('file_viewer', 'open', this.folder.path)
      }
    },
  },
  template: `
<li v-if="folder.label || folder.action === 'new'">
  <span @contextmenu.prevent="onContextMenu" @click.stop="onClick" :class="{ 'tree-item-active': activeFile == folder.path, 'tree-item': true }" ref="sample" :style="{paddingLeft: getItemLeftPadding(folder)}">
    <img class="tree-item-img" :src="getIconSrc(folder, isSubtreeOpen)" :alt="folder.isFolder ? 'Folder' : 'File'" />
    <input v-if="folder.action === 'new'" v-focus type="text" spellcheck="false" v-model="folder.label" @keyup.enter="onCreated" @keyup.esc="onCreateCanceled" @blur="onCreateCanceled">
    <input v-else-if="folder.action === 'rename'" v-focus type="text" spellcheck="false" v-model="folder.label" @keyup.enter="onRenamed" @keyup.esc="onRenameCanceled" @blur="onRenameCanceled" @focus="handleSelect">
    <span v-else class="tree-item-label">{{folder.label}}</span>
  </span>
    <ul v-show="isSubtreeOpen && folder.isFolder && folder.children">
      <li v-for="folder in folder.children">
        <Tree :folder="folder" :activeFile="activeFile"></Tree>
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
      eventBus.emit('openFolder', this.folder.path)
      this.folder.children.push({ label: '', action: 'new', isFolder: false, path: this.folder.path })
      this.menuPosition = null
    },
    newFolder() {
      eventBus.emit('openFolder', this.folder.path)
      this.folder.children.push({ label: '', action: 'new', isFolder: true, path: this.folder.path })
      this.menuPosition = null
    },
    remove() {
      this.folder.children = []
      this.folder.label = ''
      window.parent.wave.emit('file_viewer', this.folder.isFolder ? 'remove_folder' : 'remove_file', this.folder.path)
      this.menuPosition = null
    },
    rename() {
      this.folder.action = 'rename'
      this.folder._labelCache = this.folder.label
      this.menuPosition = null
    },
  },
  template: `
      <ul v-if="menuPosition && folder" class='menu' :style="{top: menuPosition.y + 'px', left: menuPosition.x + 'px'}">
        <li v-if="folder.isFolder" @click="newFile"><img class="menu-item-img" src="$${baseUrl}assets/img/file-plus.svg" alt="Folder" />New file</li>
        <li v-if="folder.isFolder" @click="newFolder"><img class="menu-item-img" src="$${baseUrl}assets/img/folder-plus.svg" alt="Folder" />New folder</li>
        <li @click="rename"><img class="menu-item-img" src="$${baseUrl}assets/img/pencil.svg" alt="Folder" />Rename</li>
        <li @click="remove" class='delete'><img class="menu-item-img" src="$${baseUrl}assets/img/trash-can.svg" alt="Folder" />Delete</li>
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
    this.bus.on('activeFile', activeFile => this.activeFile = activeFile)
  },
  data() {
    return {
      folder: {},
      activeFile: 'project/app.py' // TODO: Inject from python in case of Windows FS.
    }
  },
  template: `
      <ul><Tree :folder="folder" :activeFile="activeFile" /></ul>
      <Teleport to="#file-tree-menu"><Menu/></Teleport>
      `
})
app.config.globalProperties = { bus: eventBus, getIconSrc, getItemLeftPadding }
app.component('Tree', Tree)
app.component('Menu', Menu)
app.mount('#file-tree')
app.directive('focus', { mounted: el => el.focus() })
document.onclick = e => eventBus.emit('documentClick', e)
eventBus.emit("folder", $folder)

const handleHorizontalResize = () => {
  let mouseX, elementWidth = 0
  const
    element = document.getElementById('explorer'),
    resizer = document.getElementById('width-resizer'),
    mouseMoveHandler = (e) => {
      const dx = e.clientX - mouseX
      if (elementWidth + dx > 60) element.style.width = elementWidth + dx + 'px'
    },
    mouseUpHandler = () => {
      // handlers registered on document - events not fired when mouse is moved too quickly while registered on resizer itself
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    },
    mouseDownHandler = (e) => {
      mouseX = e.clientX
      const styles = window.getComputedStyle(element)
      elementWidth = parseInt(styles.width, 10)
      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    }

  resizer.addEventListener('mousedown', mouseDownHandler)
}

handleHorizontalResize()