import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Invoicer API',
      version: '1.0.0',
      description: 'API documentation for invoicing system with Czech IČO and ARES integration support',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
        },
      },
      schemas: {
        Invoice: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            invoiceNumber: { type: 'string' },
            clientName: { type: 'string' },
            clientAddress: { type: 'string' },
            clientEmail: { type: 'string' },
            clientIco: { type: 'string', nullable: true },
            senderName: { type: 'string', nullable: true },
            senderAddress: { type: 'string', nullable: true },
            senderIco: { type: 'string', nullable: true },
            issueDate: { type: 'string', format: 'date' },
            dueDate: { type: 'string', format: 'date' },
            items: { type: 'array', items: { $ref: '#/components/schemas/InvoiceItem' } },
            totalAmount: { type: 'number' },
            currency: { type: 'string', enum: ['USD', 'EUR', 'CZK'] },
            status: { type: 'string', enum: ['DRAFT', 'SENT', 'PAID'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        InvoiceItem: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            quantity: { type: 'number' },
            unit: { type: 'string', nullable: true },
            price: { type: 'number' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            ico: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
          },
        },
        UserCompany: {
          type: 'object',
          properties: {
            companyName: { type: 'string', nullable: true },
            companyAddress: { type: 'string', nullable: true },
            companyIco: { type: 'string', nullable: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
