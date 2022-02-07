/* eslint-disable @typescript-eslint/no-var-requires */
const
  fs = require('fs'),
  baseSnippets = require('./base-snippets.json'),
  componentSnippets = require('./component-snippets.json'),
  mergedSnippets = { ...baseSnippets, ...componentSnippets },
  toMdTable = require('json-to-markdown-table'),
  mdSnippets = Object.values(mergedSnippets)
    .sort((a, b) => a.prefix > b.prefix ? 1 : -1)
    .map(({ prefix, description }) => ({ Snippet: prefix, Description: description }))

fs.writeFileSync('snippets.json', JSON.stringify(mergedSnippets, null, 1))
fs.writeFileSync('README.md', [fs.readFileSync('README.template.md'), toMdTable(mdSnippets, ['Snippet', 'Description'])].join('\n'))