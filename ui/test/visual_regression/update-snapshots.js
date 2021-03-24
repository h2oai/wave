const fs = require('fs')
const path = require('path')

if (!fs.existsSync('test-results')) {
  console.log('Nothing to approve. Run make test-ui-visual-ci first.');
  return
}

function walk(directory, filepaths = []) {
  fs.readdirSync(directory).forEach(filename => {
    const filepath = path.join(directory, filename)
    if (fs.statSync(filepath).isDirectory()) walk(filepath, filepaths)
    else if (filename.endsWith('-actual.png')) filepaths.push(filepath)
  })
  return filepaths
}

const actualFiles = walk('test-results')
actualFiles.forEach(file => {
  fs.renameSync(file, file.replace('test-results', '__snapshots__').replace('-actual', ''))
})

fs.rmdirSync('test-results', { recursive: true })
console.log('Snapshots for visual testing updated successfully.')