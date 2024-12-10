module.exports = {
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!bson|mongodb)/', // Add bson and mongodb for transpilation
    ],
  };
  