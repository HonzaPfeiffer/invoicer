import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

export async function createTestUser(userData?: Partial<TestUser>): Promise<TestUser> {
  const defaultData = global.testUtils.generateTestUser();
  const hashedPassword = await bcrypt.hash(userData?.password || defaultData.password, 10);

  const user = await prisma.user.create({
    data: {
      name: userData?.name || defaultData.name,
      email: userData?.email || defaultData.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: userData?.password || defaultData.password,
  };
}

export async function createTestUserWithCompany(companyData?: {
  companyName?: string;
  companyAddress?: string;
  companyIco?: string;
}): Promise<TestUser> {
  const defaultData = global.testUtils.generateTestUser();
  const hashedPassword = await bcrypt.hash(defaultData.password, 10);

  const user = await prisma.user.create({
    data: {
      name: defaultData.name,
      email: defaultData.email,
      password: hashedPassword,
      companyName: companyData?.companyName || 'Test Company Ltd.',
      companyAddress: companyData?.companyAddress || 'Test Address 123',
      companyIco: companyData?.companyIco || '12345678',
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: defaultData.password,
  };
}

export async function getAuthCookie(email: string, password: string): Promise<string> {
  // This is a helper to simulate authentication
  // In real tests, we'll use the actual NextAuth flow
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  // Return a mock session cookie format
  // In real implementation, this would use NextAuth's session creation
  return `next-auth.session-token=mock-session-${user.id}`;
}
