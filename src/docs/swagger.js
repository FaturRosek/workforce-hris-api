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

    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "Get all services",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Services retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get services",
          },
        },
      },

      post: {
        tags: ["Services"],
        summary: "Create service",
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
                required: ["service_name", "price"],
                properties: {
                  service_name: {
                    type: "string",
                    example: "Jas Pria",
                  },
                  description: {
                    type: "string",
                    example: "Pembuatan jas pria custom",
                  },
                  price: {
                    type: "number",
                    example: 750000,
                  },
                  status: {
                    type: "string",
                    example: "Active",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Service created successfully",
          },
          400: {
            description: "Invalid service data",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to create service",
          },
        },
      },
    },

    "/api/services/{id}": {
      get: {
        tags: ["Services"],
        summary: "Get service by ID",
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
            description: "Service retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Service not found",
          },
          500: {
            description: "Failed to get service",
          },
        },
      },

      put: {
        tags: ["Services"],
        summary: "Update service",
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
                  service_name: {
                    type: "string",
                    example: "Jas Pria Premium",
                  },
                  description: {
                    type: "string",
                    example: "Pembuatan jas pria premium custom",
                  },
                  price: {
                    type: "number",
                    example: 950000,
                  },
                  status: {
                    type: "string",
                    example: "Active",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Service updated successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Service not found",
          },
          500: {
            description: "Failed to update service",
          },
        },
      },

      delete: {
        tags: ["Services"],
        summary: "Delete service",
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
            description: "Service deleted successfully",
          },
          400: {
            description: "Service cannot be deleted",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Service not found",
          },
          500: {
            description: "Failed to delete service",
          },
        },
      },
    },

    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders",
        description:
          "Get orders with pagination, optional status filter, and search.",
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
            name: "status",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: [
                "Pending",
                "Measurement",
                "Cutting",
                "Sewing",
                "Finishing",
                "Ready Pickup",
                "Completed",
                "Cancelled",
              ],
            },
            example: "Finishing",
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            example: "INV-20260808",
          },
        ],
        responses: {
          200: {
            description: "Orders retrieved successfully",
          },
          400: {
            description: "Invalid pagination parameters",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get orders",
          },
        },
      },

      post: {
        tags: ["Orders"],
        summary: "Create order",
        description:
          "Create a new tailoring order together with its order details. Invoice number and order total are generated by the server.",
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
                required: [
                  "customer_id",
                  "employee_id",
                  "order_date",
                  "pickup_date",
                  "details",
                ],
                properties: {
                  customer_id: {
                    type: "integer",
                    example: 1,
                  },
                  employee_id: {
                    type: "integer",
                    example: 1,
                  },
                  order_date: {
                    type: "string",
                    format: "date",
                    example: "2026-08-20",
                  },
                  pickup_date: {
                    type: "string",
                    format: "date",
                    example: "2026-08-27",
                  },
                  notes: {
                    type: "string",
                    example: "Jas untuk acara pernikahan",
                  },
                  details: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      required: ["service_id", "qty"],
                      properties: {
                        service_id: {
                          type: "integer",
                          example: 1,
                        },
                        qty: {
                          type: "integer",
                          minimum: 1,
                          example: 2,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Order created successfully",
          },
          400: {
            description: "Invalid order data",
          },
          404: {
            description: "Customer, employee, or service not found",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to create order",
          },
        },
      },
    },

    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by ID",
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
            description: "Order retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to get order",
          },
        },
      },
    },

    "/api/orders/{id}/status": {
      put: {
        tags: ["Orders"],
        summary: "Update order status",
        description:
          "Update order production status according to the MM Tailor status workflow and record the change in status history.",
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
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: [
                      "Pending",
                      "Measurement",
                      "Cutting",
                      "Sewing",
                      "Finishing",
                      "Ready Pickup",
                      "Completed",
                      "Cancelled",
                    ],
                    example: "Measurement",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order status updated successfully",
          },
          400: {
            description: "Invalid status or invalid status transition",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to update order status",
          },
        },
      },
    },

    "/api/orders/{id}/history": {
      get: {
        tags: ["Orders"],
        summary: "Get order status history",
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
            description: "Order status history retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to get order status history",
          },
        },
      },
    },

    "/api/orders/{id}/payment-summary": {
      get: {
        tags: ["Payments"],
        summary: "Get order payment summary",
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
            description: "Order payment summary retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to get payment summary",
          },
        },
      },
    },

    "/api/orders/{id}/payments": {
      get: {
        tags: ["Payments"],
        summary: "Get order payments",
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
            description: "Order payments retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to get order payments",
          },
        },
      },
    },

    "/api/orders/{id}/payment-summary": {
      get: {
        tags: ["Payments"],
        summary: "Get order payment summary",
        description:
          "Get order total, total paid, remaining balance, and payment status.",

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
            description: "Payment summary retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to get payment summary",
          },
        },
      },
    },

    "/api/orders/{id}/payments": {
      get: {
        tags: ["Payments"],
        summary: "Get order payments",
        description: "Get all payments belonging to an order.",

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
            description: "Payments retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order not found",
          },
          500: {
            description: "Failed to get payments",
          },
        },
      },
    },

    "/api/reports/orders": {
      get: {
        tags: ["Reports"],
        summary: "Get order report",
        description:
          "Get order report containing total orders, total revenue, and order details. Optional date filters can be used to limit the reporting period.",

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
            description: "Start date of reporting period",
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
            description: "End date of reporting period",
          },
        ],

        responses: {
          200: {
            description: "Order report retrieved successfully",
          },
          400: {
            description: "Invalid date filter",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get order report",
          },
        },
      },
    },

    "/api/order-details": {
      get: {
        tags: ["Order Details"],
        summary: "Get order details",
        description:
          "Get order details. Use order_id to filter details belonging to a specific order.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "order_id",
            in: "query",
            required: false,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "Filter order details by order ID",
          },
        ],
        responses: {
          200: {
            description: "Order details retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to get order details",
          },
        },
      },

      post: {
        tags: ["Order Details"],
        summary: "Create order detail",
        description:
          "Add a service to an existing order. Price and subtotal are calculated by the server from the selected service.",
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
                required: ["order_id", "service_id", "qty"],
                properties: {
                  order_id: {
                    type: "integer",
                    example: 1,
                  },
                  service_id: {
                    type: "integer",
                    example: 1,
                  },
                  qty: {
                    type: "integer",
                    minimum: 1,
                    example: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Order detail created successfully",
          },
          400: {
            description: "Invalid order detail data",
          },
          404: {
            description: "Order or service not found",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to create order detail",
          },
        },
      },
    },

    "/api/order-details/{id}": {
      get: {
        tags: ["Order Details"],
        summary: "Get order detail by ID",
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
            description: "Order detail retrieved successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order detail not found",
          },
          500: {
            description: "Failed to get order detail",
          },
        },
      },

      put: {
        tags: ["Order Details"],
        summary: "Update order detail",
        description:
          "Update service and quantity. Price and subtotal are recalculated by the server.",
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
                required: ["service_id", "qty"],
                properties: {
                  service_id: {
                    type: "integer",
                    example: 2,
                  },
                  qty: {
                    type: "integer",
                    minimum: 1,
                    example: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order detail updated successfully",
          },
          400: {
            description: "Invalid order detail data",
          },
          404: {
            description: "Order detail or service not found",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Failed to update order detail",
          },
        },
      },

      delete: {
        tags: ["Order Details"],
        summary: "Delete order detail",
        description: "Delete an order detail and recalculate the order total.",
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
            description: "Order detail deleted successfully",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Order detail not found",
          },
          500: {
            description: "Failed to delete order detail",
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
