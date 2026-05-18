import { POST } from '@/app/api/register/route';
import { prisma } from '@/lib/db';
import { createMockRequest, parseResponse, BASE_URL } from '../helpers/request.helper';

describe('POST /api/register', () => {
  describe('Successful Registration', () => {
    it('should create a new user with valid data', async () => {
      const userData = global.testUtils.generateTestUser();
      const request = createMockRequest({
        method: 'POST',
        url: `${BASE_URL}/api/register`,
        body: userData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.email).toBe(userData.email);
      expect(data.name).toBe(userData.name);
      expect(data).not.toHaveProperty('password'); // Password should not be returned

      // Verify user was created in database
      const dbUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser?.email).toBe(userData.email);
    });

    it('should hash the password before storing', async () => {
      const userData = global.testUtils.generateTestUser();
      const request = createMockRequest({
        method: 'POST',
        url: `${BASE_URL}/api/register`,
        body: userData,
      });

      await POST(request);

      const dbUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      expect(dbUser?.password).not.toBe(userData.password);
      expect(dbUser?.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash format
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 when name is missing', async () => {
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });

    it('should return 400 when email is missing', async () => {
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: {
          name: 'Test User',
          password: 'password123',
        },
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });

    it('should return 400 when password is missing', async () => {
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });
  });

  describe('Duplicate User', () => {
    it('should return 400 when user already exists', async () => {
      const userData = global.testUtils.generateTestUser();

      // Create user first time
      const request1 = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: userData,
      });
      await POST(request1);

      // Try to create same user again
      const request2 = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: userData,
      });
      const response = await POST(request2);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('User already exists');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name', async () => {
      const userData = {
        name: 'Test Üser Ñame',
        email: global.testUtils.generateTestEmail(),
        password: 'password123',
      };

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: userData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.name).toBe(userData.name);
    });

    it('should handle long passwords', async () => {
      const userData = {
        name: 'Test User',
        email: global.testUtils.generateTestEmail(),
        password: 'a'.repeat(100),
      };

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/register',
        body: userData,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
