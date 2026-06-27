module.exports = {
  default: {
    require: ['tests/e2e/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:test-results/cucumber-report.html', 'json:test-results/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    parallel: 2,
    retry: 1,
    retryTagFilter: '@flaky',
  }
};
