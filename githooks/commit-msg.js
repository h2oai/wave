#!/usr/bin/env node

// Hook for appending github issue number to commit.
const fs = require('fs');
const childProcessExec = require('child_process').exec;
const util = require('util');
const TIMEOUT_THRESHOLD = 3000;
const exec = util.promisify(childProcessExec);

checkCommitMessage();
hookCleanup();

async function checkCommitMessage() {
  const message = fs.readFileSync(process.argv[2], 'utf8').trim();
  try {
    branchName = await getCurrentBranch();
    const splitBranchName = branchName.split('-')
    if (splitBranchName.length === 2 && !isNaN(+splitBranchName[1])) {
      fs.writeFileSync(process.argv[2], `${message} #${splitBranchName[1]}`)
    }
  }
  catch (e) {
    console.error(e)
    process.exit(1);
  }
  process.exit(0);
}

async function getCurrentBranch() {
  const branchesOutput = await exec('git branch');
  if (branchesOutput.stderr) throw new Error(stderr);
  return branchesOutput.stdout.split('\n').find(b => b.trim().charAt(0) === '*').trim().substring(2);
}

function hookCleanup() {
  setTimeout(() => {
    process.exit(1);
  }, TIMEOUT_THRESHOLD);
}