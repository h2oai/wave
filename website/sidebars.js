const
  examples = require('./examples'),
  capitalize = str => str.charAt(0).toUpperCase() + str.slice(1),
  { groups, plainFiles } = require('./showcase')
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
      'tour',
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
      'cards',
      'color-theming',
      'buffers',
      'components',
      'arguments',
      'state',
      'routing',
      'realtime',
      'background',
      'expressions',
      'files',
      'plotting',
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
    'Examples': examples.map(e => `examples/${e.slug}`),
    'Components': [...plainFiles.sort(), ...sortedGroups],
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
