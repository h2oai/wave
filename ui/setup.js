const hljs = require('highlight.js/lib/core')
const fs = require('fs')
const path = require('path')
const aliasesToLanguages = fs.readdirSync(path.join('node_modules', 'highlight.js', 'lib', 'languages'))
  .filter(file => !file.endsWith('.js.js'))
  .reduce((prev, file) => {
    file = file.replace('.js', '')
    const lang = require(`highlight.js/lib/languages/${file}`)
    const aliases = lang(hljs).aliases || []
    aliases.forEach(alias => prev[alias] = file)
    prev[file] = file
    return prev
  }, {})

console.log(JSON.stringify(aliasesToLanguages, null, 2))