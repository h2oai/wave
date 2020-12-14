#!/usr/bin/env node

// Hook for appending github issue number to commit and linting the commit msg via commitlint.
const
  fs = require('fs'),
  { execSync } = require('child_process'),
  message = fs.readFileSync(process.argv[2], 'utf8').trim()

const splitBranchName = execSync('git branch').toString().split('\n').find(b => b.trim().charAt(0) === '*').trim().substring(2).split('-')
if (!isNaN(+splitBranchName[splitBranchName.length - 1])) fs.writeFileSync(process.argv[2], `${message} #${splitBranchName[1]}`)