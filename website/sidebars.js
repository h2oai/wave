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
    Migrating: [
      'migrating-0',
    ],
    Meta: [
      'change-log',
    ],
  },
};
