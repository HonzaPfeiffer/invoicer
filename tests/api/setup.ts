import { prisma } from '@/lib/db';

// Increase timeout for database operations
jest.setTimeout(30000);

// Clean up database before each test
beforeEach(async () => {
  // Clean up in correct order due to foreign key constraints
  await prisma.invoice.deleteMany({});
  await prisma.user.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Global test utilities
global.testUtils = {
  generateTestEmail: () => `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
  generateTestUser: () => ({
    name: 'Test User',
    email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
    password: 'TestPassword123!',
  }),
};

// Extend Jest matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      pass,
      message: () => `expected ${received} to be a valid Date`,
    };
  },
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);
    return {
      pass,
      message: () => `expected ${received} to be a valid UUID`,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R;
      toBeValidUUID(): R;
    }
  }
  
  var testUtils: {
    generateTestEmail: () => string;
    generateTestUser: () => { name: string; email: string; password: string };
  };
}
