#!/usr/bin/env node

// Hook for appending github issue number to commit and linting the commit msg via commitlint.
const
  fs = require('fs'),
  { execSync } = require('child_process'),
  message = fs.readFileSync(process.argv[2], 'utf8').trim(),
  splitBranchName = execSync('git branch').toString().split('\n').find(b => b.trim().charAt(0) === '*').trim().substring(2).split('-'),
  lastIndex = splitBranchName.length - 1

// Append issue number if branch name ends with -#ISSUE_NUMBER.
if (!isNaN(+splitBranchName[lastIndex])) fs.writeFileSync(process.argv[2], `${message} #${splitBranchName[lastIndex]}`)

// Lint commit msg.
try {
  execSync(`node ui/node_modules/@commitlint/cli/cli.js --config ui/.commitlintrc.js -e`, { stdio: 'inherit' })
} catch (error) {
  process.exit(1)
}
