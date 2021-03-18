#!/usr/bin/env node

const { execSync } = require('child_process')
process.env.GIT_HOOK = true

function runLinter(linterName, command, stagedFiles) {
  const joinedFiles = stagedFiles.join(' ')
  console.log('\x1b[33m', `Running ${linterName} for ${joinedFiles}`, '\x1b[0m')
  try {
    execSync(`${command} ${joinedFiles}`, { stdio: 'inherit' })
  } catch ({ stdout }) {
    console.log('\x1b[31m', 'Please fix the linting errors above.')
    console.log('\x1b[36m', 'If you want to skip linting (not recommended) you can commit with --no-verify option.')
    process.exit(1)
  }
  console.log('\x1b[32m', `Linting finished with no linting errors.`, '\x1b[0m')
}

function runRelatedTests(command, stagedFiles) {
  try {
    execSync(`${command} ${stagedFiles.join(' ')}`, { stdio: 'inherit' })
  } catch (error) {
    console.log('\x1b[31m', 'Some unit tests failed. Please fix them.')
    process.exit(1)
  }
}

const
  files = execSync('git diff --cached --name-only --diff-filter=d').toString().split('\n').filter(Boolean).reduce((groups, f) => {
    if (f.match(/^ui.+(ts|tsx)/)) groups.uiTs.push(f)
    else if (f.match(/^tools\/wavegen.+(ts|tsx)/)) groups.wavegenTs.push(f)
    else if (f.endsWith('.py')) groups.py.push(f)
    else if (f.endsWith('.go')) groups.go.push(f)
    else if (f.endsWith('.md')) groups.md.push(f)
    return groups
  }, { uiTs: [], wavegenTs: [], py: [], go: [], md: [] })

if (files.uiTs.length) {
  runLinter('eslint', 'ui/node_modules/eslint/bin/eslint.js --resolve-plugins-relative-to ui -c ui/.eslintrc.js', files.uiTs)
  runRelatedTests('ui/node_modules/jest/bin/jest.js --config ui/jest.config.js --findRelatedTests --bail', files.uiTs)
}
if (files.wavegenTs.length) {
  runLinter('eslint', 'tools/wavegen/node_modules/eslint/bin/eslint.js --resolve-plugins-relative-to tools/wavegen -c tools/wavegen/.eslintrc.js', files.wavegenTs)
}
if (files.py.length) runLinter('flake8', './py/venv/bin/flake8', files.py)
if (files.go.length) runLinter('golint', 'golint -set_exit_status', files.go)
if (files.md.length) runLinter('markdownlint', 'ui/node_modules/markdownlint-cli/markdownlint.js', files.md)

console.log('\x1b[32m', 'No errors found. Good job!', '\x1b[0m')