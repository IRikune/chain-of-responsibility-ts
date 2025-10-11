import { createChain, createStep } from "../mod.ts";

// Define a request-like context
type RequestContext = {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: any;
  user?: { id: string; role: string };
  authenticated: boolean;
  authorized: boolean;
  response?: { status: number; data: any };
};

// Logging middleware
const logger = createStep<RequestContext>(async (ctx, next) => {
  const method = ctx.get("method");
  const path = ctx.get("path");
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${method} ${path}`);
  
  await next();
  
  const response = ctx.get("response");
  if (response) {
    console.log(`[${timestamp}] Response: ${response.status}`);
  }
});

// Authentication middleware
const authenticate = createStep<RequestContext>(async (ctx, next) => {
  const headers = ctx.get("headers");
  const authHeader = headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Simulate token validation
    const token = authHeader.substring(7);
    
    if (token === "valid-token") {
      ctx.set("user", { id: "user123", role: "admin" });
      ctx.set("authenticated", true);
      console.log("✓ Authentication successful");
    } else {
      ctx.set("authenticated", false);
      ctx.set("response", { status: 401, data: { error: "Invalid token" } });
      console.log("❌ Authentication failed");
      return; // Don't call next() - break the chain
    }
  } else {
    ctx.set("authenticated", false);
    ctx.set("response", { status: 401, data: { error: "No authorization header" } });
    console.log("❌ No authorization header");
    return; // Don't call next() - break the chain
  }
  
  await next();
});

// Authorization middleware
const authorize = createStep<RequestContext>(async (ctx, next) => {
  const user = ctx.get("user");
  const method = ctx.get("method");
  
  if (!user) {
    ctx.set("authorized", false);
    ctx.set("response", { status: 403, data: { error: "User not found" } });
    return;
  }
  
  // Simple role-based authorization
  if (method === "DELETE" && user.role !== "admin") {
    ctx.set("authorized", false);
    ctx.set("response", { status: 403, data: { error: "Admin role required for DELETE operations" } });
    console.log("❌ Authorization failed - insufficient permissions");
    return;
  }
  
  ctx.set("authorized", true);
  console.log("✓ Authorization successful");
  await next();
});

// Request handler
const handleRequest = createStep<RequestContext>(async (ctx, next) => {
  const method = ctx.get("method");
  const path = ctx.get("path");
  const user = ctx.get("user");
  
  console.log(`🎯 Processing ${method} ${path} for user ${user?.id}`);
  
  // Simulate different responses based on method
  switch (method) {
    case "GET":
      ctx.set("response", { status: 200, data: { message: "Data retrieved successfully" } });
      break;
    case "POST":
      ctx.set("response", { status: 201, data: { message: "Resource created successfully" } });
      break;
    case "PUT":
      ctx.set("response", { status: 200, data: { message: "Resource updated successfully" } });
      break;
    case "DELETE":
      ctx.set("response", { status: 204, data: null });
      break;
    default:
      ctx.set("response", { status: 405, data: { error: "Method not allowed" } });
  }
  
  await next();
});

// Response formatter
const formatResponse = createStep<RequestContext>(async (ctx, next) => {
  const response = ctx.get("response");
  
  if (response) {
    console.log(`📤 Sending response:`, JSON.stringify(response, null, 2));
  }
  
  await next();
});

// Simulate different HTTP requests
async function simulateRequest(method: string, path: string, token?: string) {
  console.log(`\n=== Simulating ${method} ${path} ==`);
  
  const chain = createChain<RequestContext>()
    .use(logger, authenticate, authorize, handleRequest, formatResponse)
    .setDelay(100);
  
  const context = await chain.run();
  
  // Set up the request
  context.set("method", method);
  context.set("path", path);
  context.set("headers", {
    "content-type": "application/json",
    ...(token ? { authorization: `Bearer ${token}` } : {})
  });
  context.set("authenticated", false);
  context.set("authorized", false);
  
  try {
    await chain.run();
    return context.get("response");
  } catch (error) {
    console.error("Error processing request:", error);
    return { status: 500, data: { error: "Internal server error" } };
  }
}

// Run middleware examples
async function runMiddlewareExample() {
  console.log("=== Middleware Pattern Example ===");
  
  // Test different scenarios
  await simulateRequest("GET", "/api/users"); // No token
  await simulateRequest("GET", "/api/users", "invalid-token"); // Invalid token
  await simulateRequest("GET", "/api/users", "valid-token"); // Valid request
  await simulateRequest("POST", "/api/users", "valid-token"); // Create resource
  await simulateRequest("DELETE", "/api/users/123", "valid-token"); // Admin operation
}

if (import.meta.main) {
  runMiddlewareExample();
}

export { runMiddlewareExample };
