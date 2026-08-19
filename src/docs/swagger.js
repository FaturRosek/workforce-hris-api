const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "MM Tailor HRIS API",
    version: "1.0.0",
    description:
      "REST API for MM Tailor HRIS and tailoring order management system",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "Authentication and authorization",
    },
    {
      name: "Dashboard",
      description: "Dashboard statistics",
    },
    {
      name: "Customers",
      description: "Customer management",
    },
    {
      name: "Employees",
      description: "Employee management",
    },
    {
      name: "Positions",
      description: "Position management",
    },
    {
      name: "Services",
      description: "Tailoring service management",
    },
    {
      name: "Orders",
      description: "Order and production management",
    },
    {
      name: "Payments",
      description: "Payment management",
    },
    {
      name: "Reports",
      description: "Sales and financial reports",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login employee",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: {
                    type: "string",
                    example: "admin",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Login successful",
          },
          400: {
            description: "Username and password are required",
          },
          401: {
            description: "Invalid credentials",
          },
          500: {
            description: "Server error",
          },
        },
      },
    },

    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard statistics",
        description:
          "Get customer, employee, order, revenue, payment, outstanding, and order status statistics.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "start_date",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date",
            },
            example: "2026-08-01",
          },
          {
            name: "end_date",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date",
            },
            example: "2026-08-31",
          },
        ],

        responses: {
          200: {
            description: "Dashboard data retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get dashboard data",
          },
        },
      },
    },

    "/api/customers": {
      get: {
        tags: ["Customers"],
        summary: "Get customers",
        description: "Get customers with pagination and optional search.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            example: 1,
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            example: 10,
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            example: "Ahmad",
          },
        ],
        responses: {
          200: {
            description: "Customers retrieved successfully",
          },
          400: {
            description: "Invalid pagination parameters",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get customers",
          },
        },
      },

      post: {
        tags: ["Customers"],
        summary: "Create customer",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customer_code", "full_name"],
                properties: {
                  customer_code: {
                    type: "string",
                    example: "CUS-004",
                  },
                  full_name: {
                    type: "string",
                    example: "Budi Santoso",
                  },
                  phone: {
                    type: "string",
                    example: "081234567890",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "budi@example.com",
                  },
                  address: {
                    type: "string",
                    example: "Jl. Raya Bangkalan No. 10",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Customer created successfully",
          },
          400: {
            description: "Customer code and full name are required",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to create customer",
          },
        },
      },
    },

    "/api/customers/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Get customer by ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Customer retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Customer not found",
          },
          500: {
            description: "Failed to get customer",
          },
        },
      },

      put: {
        tags: ["Customers"],
        summary: "Update customer",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  customer_code: {
                    type: "string",
                    example: "CUS-001",
                  },
                  full_name: {
                    type: "string",
                    example: "Ahmad Fauzi",
                  },
                  phone: {
                    type: "string",
                    example: "081234567890",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "ahmad@example.com",
                  },
                  address: {
                    type: "string",
                    example: "Jl. Raya Bangkalan No. 15",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Customer updated successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Customer not found",
          },
          500: {
            description: "Failed to update customer",
          },
        },
      },

      delete: {
        tags: ["Customers"],
        summary: "Delete customer",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Customer deleted successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Customer not found",
          },
          500: {
            description: "Failed to delete customer",
          },
        },
      },
    },

    "/api/employees": {
      get: {
        tags: ["Employees"],
        summary: "Get employees",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            example: 1,
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            example: 10,
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            example: "Dimas",
          },
        ],
        responses: {
          200: {
            description: "Employees retrieved successfully",
          },
          400: {
            description: "Invalid pagination parameters",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get employees",
          },
        },
      },

      post: {
        tags: ["Employees"],
        summary: "Create employee",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["employee_code", "full_name", "email", "password"],
                properties: {
                  employee_code: {
                    type: "string",
                    example: "EMP-004",
                  },
                  full_name: {
                    type: "string",
                    example: "Budi Santoso",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "budi@example.com",
                  },
                  phone: {
                    type: "string",
                    example: "081234567890",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "password123",
                  },
                  position_id: {
                    type: "integer",
                    example: 1,
                  },
                  status: {
                    type: "string",
                    enum: ["Active", "Inactive"],
                    example: "Active",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Employee created successfully",
          },
          400: {
            description: "Invalid employee data",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to create employee",
          },
        },
      },
    },

    "/api/employees/{id}": {
      get: {
        tags: ["Employees"],
        summary: "Get employee by ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Employee retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Employee not found",
          },
          500: {
            description: "Failed to get employee",
          },
        },
      },

      put: {
        tags: ["Employees"],
        summary: "Update employee",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  employee_code: {
                    type: "string",
                    example: "EMP-001",
                  },
                  full_name: {
                    type: "string",
                    example: "Dimas Saputra",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "dimas@example.com",
                  },
                  phone: {
                    type: "string",
                    example: "081234567890",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "password123",
                  },
                  position_id: {
                    type: "integer",
                    example: 1,
                  },
                  status: {
                    type: "string",
                    enum: ["Active", "Inactive"],
                    example: "Active",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Employee updated successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Employee not found",
          },
          500: {
            description: "Failed to update employee",
          },
        },
      },

      delete: {
        tags: ["Employees"],
        summary: "Delete employee",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Employee deleted successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Employee not found",
          },
          500: {
            description: "Failed to delete employee",
          },
        },
      },
    },

    "/api/positions": {
      get: {
        tags: ["Positions"],
        summary: "Get all positions",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Positions retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get positions",
          },
        },
      },

      post: {
        tags: ["Positions"],
        summary: "Create position",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["position_name"],
                properties: {
                  position_name: {
                    type: "string",
                    example: "Tailor",
                  },
                  description: {
                    type: "string",
                    example: "Employee responsible for sewing garments",
                  },
                  salary: {
                    type: "number",
                    example: 3500000,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Position created successfully",
          },
          400: {
            description: "Invalid position data",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to create position",
          },
        },
      },
    },

    "/api/positions/{id}": {
      get: {
        tags: ["Positions"],
        summary: "Get position by ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Position retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Position not found",
          },
          500: {
            description: "Failed to get position",
          },
        },
      },

      put: {
        tags: ["Positions"],
        summary: "Update position",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  position_name: {
                    type: "string",
                    example: "Senior Tailor",
                  },
                  description: {
                    type: "string",
                    example: "Senior garment tailor",
                  },
                  salary: {
                    type: "number",
                    example: 4500000,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Position updated successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Position not found",
          },
          500: {
            description: "Failed to update position",
          },
        },
      },

      delete: {
        tags: ["Positions"],
        summary: "Delete position",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Position deleted successfully",
          },
          400: {
            description: "Position cannot be deleted",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Position not found",
          },
          500: {
            description: "Failed to delete position",
          },
        },
      },
    },
  },
};

module.exports = {
  swaggerUi,
  swaggerDocument,
};
