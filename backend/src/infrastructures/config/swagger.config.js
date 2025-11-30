import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

/**
 * Swagger configuration and setup for the Express app.
 *
 * This module exports a function `setupSwagger(app)` which mounts
 * the Swagger UI at `/api-docs` and serves the generated OpenAPI spec.
 */

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json")));

/**
 * Swagger definition with OpenAPI 3.0.0 spec, schemas, and security schemes.
 */
const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: pkg.name || "Clothing E-commerce API",
		version: pkg.version || "1.0.0",
		description: pkg.description || "API documentation for Clothing E-commerce backend",
		contact: {
			name: "Support",
			email: "support@example.com"
		}
	},
	servers: [
		{
			url: "http://localhost:3000",
			description: "Development server"
		},
		{
			url:"https://clothing-brand-e-commerce-backend.onrender.com",
			description: "Production server"
		}
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				description: "Enter JWT token for authentication"
			}
		},
		schemas: {
			User: {
				type: "object",
				properties: {
					_id: { type: "string" },
					name: { type: "string" },
					email: { type: "string" },
					role: { type: "string", enum: ["Admin", "Member"] },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" }
				}
			},
			Product: {
				type: "object",
				properties: {
					_id: { type: "string" },
					name: { type: "string" },
					description: { type: "string" },
					price: { type: "number" },
					image: { type: "string" },
					category: { type: "string", enum: ["Men", "Women", "Kids"] },
					sizes: { type: "array", items: { type: "string" } },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" }
				}
			},
			CartItem: {
				type: "object",
				properties: {
					_id: { type: "string" },
					product: { $ref: "#/components/schemas/Product" },
					size: { type: "string" },
					quantity: { type: "integer" }
				}
			},
			Cart: {
				type: "object",
				properties: {
					_id: { type: "string" },
					user: { type: "string" },
					cartToken: { type: "string", nullable: true },
					items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" }
				}
			},
			Order: {
				type: "object",
				properties: {
					_id: { type: "string" },
					user: { type: "string" },
					items: { type: "array", items: { type: "object" } },
					total: { type: "number" },
					status: { type: "string", enum: ["Pending", "Completed", "Cancelled"] },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" }
				}
			}
		}
	},
	security: [
		{
			bearerAuth: []
		}
	]
};

const options = {
	swaggerDefinition,
	apis: [path.resolve(process.cwd(), "src/apps/**/routes/*.js")]
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	// expose raw swagger JSON
	app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
	console.log("[swagger] mounted at /api-docs");
}

export default swaggerSpec;
