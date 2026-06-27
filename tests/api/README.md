# API Integration Tests

Comprehensive integration tests for the Invoicer API endpoints using Jest.

## Structure

```
tests/api/
├── README.md              # This file
├── setup.ts               # Global test setup and utilities
├── helpers/               # Test helper functions
│   ├── auth.helper.ts     # Authentication helpers
│   ├── invoice.helper.ts  # Invoice test data helpers
│   └── request.helper.ts  # Request mocking utilities
├── auth/                  # Authentication endpoint tests
│   └── register.test.ts
├── invoices/              # Invoice endpoint tests
│   ├── get-invoices.test.ts
│   ├── create-invoice.test.ts
│   └── update-invoice.test.ts
└── user/                  # User endpoint tests
    └── company.test.ts
```

## Running Tests

```bash
# Run all API tests
npm run test:api

# Run tests in watch mode
npm run test:api:watch

# Run with coverage
npm run test:api:coverage

# Run specific test file
npm run test:api -- register.test.ts

# Run tests matching pattern
npm run test:api -- --testNamePattern="should create"

# Run with custom BASE_URL
BASE_URL=http://localhost:4000 npm run test:api
```

## Environment Variables

Tests use the following environment variables:

- `BASE_URL` - Base URL for API endpoints (default: `http://localhost:3000`)
- `NEXTAUTH_URL` - Fallback if BASE_URL not set
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth

Create a `.env.test` file based on `.env.test.example` for local testing.

## Test Coverage

### Authentication (`/api/register`)
- ✅ User registration with valid data
- ✅ Password hashing
- ✅ Validation errors (missing fields)
- ✅ Duplicate user prevention
- ✅ Edge cases (special characters, long passwords)

### Invoices (`/api/invoices`)

#### GET /api/invoices
- ✅ Authentication required
- ✅ Return empty array for new users
- ✅ Return all user's invoices
- ✅ Sorted by creation date (newest first)
- ✅ Only return invoices owned by authenticated user
- ✅ Correct data structure

#### POST /api/invoices
- ✅ Authentication required
- ✅ Create invoice with valid data
- ✅ Auto-generate invoice number
- ✅ Include sender information from user company data
- ✅ Default currency to USD
- ✅ Validation (required fields)
- ✅ Database persistence

#### PATCH /api/invoices/[id]
- ✅ Authentication required
- ✅ Update invoice status
- ✅ Validate status values (DRAFT, SENT, PAID)
- ✅ Authorization (only owner can update)
- ✅ 404 for non-existent invoices
- ✅ 403 for unauthorized access

### User Company (`/api/user/company`)

#### GET /api/user/company
- ✅ Authentication required
- ✅ Return empty object when no company info
- ✅ Return company information when available

#### PUT /api/user/company
- ✅ Authentication required
- ✅ Update company information
- ✅ Partial updates
- ✅ Database persistence

## Writing New Tests

### 1. Create Test File

```typescript
import { GET } from '@/app/api/your-endpoint/route';
import { createTestUser } from '../helpers/auth.helper';
import { createMockRequest, parseResponse } from '../helpers/request.helper';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('GET /api/your-endpoint', () => {
  it('should do something', async () => {
    const user = await createTestUser();
    mockGetServerSession.mockResolvedValue({
      user: { id: user.id, email: user.email, name: user.name },
      expires: new Date().toISOString(),
    } as any);

    const request = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/your-endpoint',
    });

    const response = await GET(request);
    const data = await parseResponse(response);

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('someField');
  });
});
```

### 2. Use Helper Functions

**Authentication:**
```typescript
// Create basic user
const user = await createTestUser();

// Create user with company data
const user = await createTestUserWithCompany({
  companyName: 'Test Company',
  companyAddress: 'Test Address',
  companyIco: '12345678',
});
```

**Invoices:**
```typescript
// Create test invoice
const invoice = await createTestInvoice(userId);

// Create with custom data
const invoice = await createTestInvoice(userId, {
  invoiceNumber: 'INV-001',
  totalAmount: 5000,
  currency: 'EUR',
});

// Generate invoice payload
const payload = generateInvoicePayload({
  clientName: 'Custom Client',
});
```

**Requests:**
```typescript
// Create mock request
const request = createMockRequest({
  method: 'POST',
  url: 'http://localhost:3000/api/endpoint',
  body: { key: 'value' },
  headers: { 'Custom-Header': 'value' },
  searchParams: { query: 'search' },
});

// Parse response
const data = await parseResponse(response);
```

### 3. Mock NextAuth Session

```typescript
mockGetServerSession.mockResolvedValue({
  user: { id: user.id, email: user.email, name: user.name },
  expires: new Date().toISOString(),
} as any);
```

## Test Patterns

### Authentication Tests
```typescript
describe('Authentication', () => {
  it('should return 401 when user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);
    // ... test code
    expect(response.status).toBe(401);
  });
});
```

### Validation Tests
```typescript
describe('Validation', () => {
  it('should return 400 when field is missing', async () => {
    // ... test code
    expect(response.status).toBe(400);
    expect(data.message).toBe('Missing required fields');
  });
});
```

### Authorization Tests
```typescript
describe('Authorization', () => {
  it('should return 403 when user tries to access another users resource', async () => {
    // ... test code
    expect(response.status).toBe(403);
  });
});
```

## Best Practices

1. **Clean Database**: Each test starts with a clean database (handled in `setup.ts`)
2. **Isolation**: Tests should not depend on each other
3. **Descriptive Names**: Use clear test descriptions
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Mock External Dependencies**: Mock NextAuth, external APIs, etc.
6. **Test Edge Cases**: Include validation, errors, and edge cases
7. **Verify Database State**: Check database after mutations
8. **Use Helpers**: Leverage helper functions for common operations

## Custom Matchers

```typescript
// Check if value is a valid date
expect(invoice.createdAt).toBeValidDate();

// Check if value is a valid UUID
expect(invoice.id).toBeValidUUID();
```

## Global Test Utilities

```typescript
// Generate unique test email
const email = global.testUtils.generateTestEmail();

// Generate test user data
const userData = global.testUtils.generateTestUser();
```

## Debugging

```bash
# Run single test file
npm run test:api -- register.test.ts

# Run with verbose output
npm run test:api -- --verbose

# Run only failed tests
npm run test:api -- --onlyFailures

# Update snapshots
npm run test:api -- --updateSnapshot
```

## CI/CD Integration

Tests run automatically in GitHub Actions:
- On push to main/develop
- On pull requests
- With Docker Compose for database

See `.github/workflows/api-tests.yml` for configuration.

## Coverage Reports

Coverage reports are generated in `coverage/api/`:
- `lcov-report/index.html` - HTML coverage report
- `coverage-summary.json` - JSON summary

Target coverage: 80%+ for all API routes.
