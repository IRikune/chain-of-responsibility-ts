# Chain of Responsibility TypeScript

[![JSR](https://jsr.io/badges/@your-scope/chain-of-responsibility-ts)](https://jsr.io/@your-scope/chain-of-responsibility-ts)
[![npm version](https://badge.fury.io/js/chain-of-responsibility-ts.svg)](https://badge.fury.io/js/chain-of-responsibility-ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, type-safe implementation of the **Chain of Responsibility** pattern in TypeScript. Perfect for building middleware systems, request processing pipelines, data transformation workflows, and more.

## 🎆 Features

- **✨ Type-Safe**: Full TypeScript support with generic context types
- **🚀 Async/Await**: Built-in support for asynchronous operations
- **🧑‍🚀 Lightweight**: Zero dependencies, minimal footprint
- **🔗 Chainable API**: Fluent interface for easy composition
- **⏱️ Configurable Delays**: Add delays between step executions
- **🔧 Flexible**: Works with any context type you define
- **📦 Multi-Runtime**: Works with Node.js, Deno, and browsers

## 📦 Installation

### npm
```bash
npm install chain-of-responsibility-ts
```

### JSR (Deno/Node.js)
```bash
# Deno
deno add @your-scope/chain-of-responsibility-ts

# Node.js
npx jsr add @your-scope/chain-of-responsibility-ts
```

## 🚀 Quick Start

```typescript
import { createChain, createStep } from "chain-of-responsibility-ts";

// Define your context type
type UserContext = {
  username: string;
  email: string;
  isValid: boolean;
};

// Create steps
const validateUsername = createStep<UserContext>(async (ctx, next) => {
  const username = ctx.get("username");
  if (username && username.length >= 3) {
    console.log("✓ Username is valid");
    await next(); // Continue to next step
  } else {
    ctx.set("isValid", false);
    console.log("❌ Username is invalid");
    // Don't call next() to stop the chain
  }
});

const validateEmail = createStep<UserContext>(async (ctx, next) => {
  const email = ctx.get("email");
  if (email && email.includes("@")) {
    console.log("✓ Email is valid");
    ctx.set("isValid", true);
  }
  await next();
});

// Create and run the chain
const chain = createChain<UserContext>()
  .use(validateUsername, validateEmail)
  .setDelay(100); // 100ms delay between steps

const context = await chain.run();
context.set("username", "john_doe");
context.set("email", "john@example.com");

await chain.run();
console.log("Is valid:", context.get("isValid"));
```

## 📚 API Reference

### `createChain<T>()`

Creates a new chain instance.

**Type Parameters:**
- `T` - The context type (extends `Record<PropertyKey, unknown>`)

**Returns:** `Chain<T>`

### `createStep<T>(stepFunction)`

Creates a typed step function.

**Parameters:**
- `stepFunction: (context: Context<T>, next: Next) => Promise<void>` - The step logic

**Returns:** The same step function with better type inference

### `Chain<T>` Methods

#### `use(...steps: Step<T>[]): Chain<T>`
Adds one or more steps to the chain.

#### `setDelay(delay: number): Chain<T>`
Sets delay in milliseconds between step executions.

#### `run(): Promise<Context<T>>`
Executes all steps in sequence and returns the context.

#### `getStepCount(): number`
Returns the number of steps in the chain.

#### `getDelay(): number`
Returns the current delay setting.

### `Context<T>` Methods

#### `set<K>(key: K, value: T[K]): Context<T>`
Sets a value in the context.

#### `get<K>(key: K): T[K]`
Gets a value from the context.

#### `has<K>(key: K): boolean`
Checks if a key exists in the context.

#### `delete<K>(key: K): boolean`
Removes a key from the context.

#### `clear(): void`
Clears all data from the context.

#### `keys(): (keyof T)[]`
Returns all keys in the context.

#### `size(): number`
Returns the number of items in the context.

## 🎨 Usage Examples

### Middleware Pattern

```typescript
type RequestContext = {
  method: string;
  path: string;
  user?: { id: string; role: string };
  authenticated: boolean;
};

const authenticate = createStep<RequestContext>(async (ctx, next) => {
  // Authentication logic
  ctx.set("authenticated", true);
  ctx.set("user", { id: "123", role: "admin" });
  await next();
});

const authorize = createStep<RequestContext>(async (ctx, next) => {
  const user = ctx.get("user");
  if (user?.role === "admin") {
    await next();
  } else {
    console.log("Unauthorized");
  }
});

const handleRequest = createStep<RequestContext>(async (ctx, next) => {
  console.log(`Processing ${ctx.get("method")} ${ctx.get("path")}`);
  await next();
});

const app = createChain<RequestContext>()
  .use(authenticate, authorize, handleRequest);
```

### Data Processing Pipeline

```typescript
type DataContext = {
  rawData: string[];
  cleanedData: string[];
  processedData: number[];
  results: any;
};

const cleanData = createStep<DataContext>(async (ctx, next) => {
  const raw = ctx.get("rawData");
  const cleaned = raw.filter(item => item.trim().length > 0);
  ctx.set("cleanedData", cleaned);
  await next();
});

const processData = createStep<DataContext>(async (ctx, next) => {
  const cleaned = ctx.get("cleanedData");
  const processed = cleaned.map(item => parseInt(item, 10)).filter(n => !isNaN(n));
  ctx.set("processedData", processed);
  await next();
});

const generateResults = createStep<DataContext>(async (ctx, next) => {
  const data = ctx.get("processedData");
  const results = {
    count: data.length,
    sum: data.reduce((a, b) => a + b, 0),
    average: data.reduce((a, b) => a + b, 0) / data.length
  };
  ctx.set("results", results);
  await next();
});

const pipeline = createChain<DataContext>()
  .use(cleanData, processData, generateResults)
  .setDelay(50);
```

### Validation Chain

```typescript
type ValidationContext = {
  data: any;
  errors: string[];
  isValid: boolean;
};

const required = (field: string) => createStep<ValidationContext>(async (ctx, next) => {
  const data = ctx.get("data");
  const errors = ctx.get("errors") || [];
  
  if (!data[field]) {
    errors.push(`${field} is required`);
    ctx.set("errors", errors);
  }
  
  await next();
});

const email = createStep<ValidationContext>(async (ctx, next) => {
  const data = ctx.get("data");
  const errors = ctx.get("errors") || [];
  
  if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Invalid email format");
    ctx.set("errors", errors);
  }
  
  await next();
});

const finalizeValidation = createStep<ValidationContext>(async (ctx, next) => {
  const errors = ctx.get("errors") || [];
  ctx.set("isValid", errors.length === 0);
  await next();
});

const validator = createChain<ValidationContext>()
  .use(required("name"), required("email"), email, finalizeValidation);
```

## 🏃‍♂️ Running Examples

The repository includes several complete examples:

```bash
# Run basic example
deno run examples/basic-usage.ts

# Run middleware example
deno run examples/middleware.ts

# Run data pipeline example
deno run examples/data-pipeline.ts
```

## 🛠️ Development

### For Deno
```bash
# Run examples
deno task dev

# Check types
deno task check

# Format code
deno task fmt

# Lint code
deno task lint
```

### For Node.js
```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## 🏆 Best Practices

1. **Always call `next()`** unless you want to stop the chain
2. **Use descriptive context types** for better development experience
3. **Handle errors appropriately** in your steps
4. **Keep steps focused** on single responsibilities
5. **Use delays sparingly** to avoid unnecessary performance overhead

## 🤔 When to Use

The Chain of Responsibility pattern is perfect for:

- **Middleware systems** (HTTP request processing)
- **Data validation pipelines**
- **Request/response processing**
- **Multi-step workflows**
- **Plugin architectures**
- **Command processing**
- **Event handling chains**

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

If you have questions or need help, please:
1. Check the [examples](./examples) directory
2. Open an issue on GitHub
3. Read the API documentation above

---

**Made with ❤️ and TypeScript**