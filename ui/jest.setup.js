// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import "jest-location-mock";
import { loadEnvConfig } from '@next/env'

const loadEnvironments = () => loadEnvConfig(process.cwd())

loadEnvironments();


jest.isolateModules(() => {
  const preloadAll = require('jest-next-dynamic');
  beforeAll(async () => {
    await preloadAll();
  });
  jest.mock("axios");
});