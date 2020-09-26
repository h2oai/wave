const examples = require('./examples');

module.exports = {
  someSidebar: {
    Guide: [
      'doc1', 
      'doc2', 
      'doc3',
      'testing',
    ],
    Examples: examples.map(e => `examples/${e.slug}`),
    API: [
      'api/index',
      'api/core',
      'api/ui',
      'api/server',
      'api/graphics',
      'api/types',
      'api/test',
    ],
    Migrating: [
      'migrating-0',
    ],
    Meta: [
      'change-log',
    ],
  },
};
