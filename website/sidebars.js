const
  capitalize = str => str.charAt(0).toUpperCase() + str.slice(1),
  { groups, plainFiles } = require('./components')
    .sort((a, b) => a.path.localeCompare(b.path))
    .reduce((acc, { group, path }) => {
      path = path.replace('.md', '')
      if (group) {
        if (acc.groups.has(group)) {
          const items = acc.groups.get(group).items
          path.includes('overview') ? items.unshift(path) : items.push(path)
        }
        else acc.groups.set(group, { type: 'category', label: capitalize(group), items: [path], })
      }
      else acc.plainFiles.push(path)

      return acc
    }, { groups: new Map(), plainFiles: [] })

const sortedGroups = [...groups.values()].sort((a, b) => a.label.localeCompare(b.label))
// Move overview to be the first, sort alphabetically the rest.
plainFiles.sort().unshift(...plainFiles.splice(plainFiles.findIndex(f => f.includes('overview')), 1))

module.exports = {
  someSidebar: {
    'Prologue': [
      'change-log',
      'migrating-0-8',
      'migrating-0',
      'contributing',
    ],
    'Getting Started': [
      'getting-started',
      'installation',
      'installation-8-20',
      'tutorial-hello',
      'tutorial-beer',
      'tutorial-monitor',
      'tutorial-counter',
      'tutorial-todo',
    ],
    'Guide': [
      'guide',
      'architecture',
      'scripts',
      'apps',
      'pages',
      'layout',
      'color-theming',
      'buffers',
      'arguments',
      'state',
      'routing',
      'realtime',
      'background',
      'expressions',
      'files',
      'javascript',
      'graphics',
      'security',
      'logging',
      'cli',
      'development',
      'browser-testing',
      'configuration',
      'deployment',
      'backup',
      'wave-ml',
      'wavedb',
    ],
    'Components': [...plainFiles, ...sortedGroups],
    'API': [
      'api/index',
      'api/core',
      'api/ui',
      'api/ui_ext',
      'api/server',
      'api/graphics',
      'api/types',
      'api/test',
      'api/h2o_wave_ml/index',
      'api/h2o_wave_ml/ml',
      'api/h2o_wave_ml/types',
      'api/h2o_wave_ml/utils',
    ],
  },
}
