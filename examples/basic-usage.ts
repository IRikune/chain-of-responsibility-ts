import { createChain, createStep } from "../mod.ts";

// Define the context type for our example
type UserContext = {
  username: string;
  email: string;
  isValid: boolean;
  errors: string[];
};

// Step 1: Validate username
const validateUsername = createStep<UserContext>(async (ctx, next) => {
  const username = ctx.get("username");
  const errors = ctx.get("errors") || [];
  
  if (!username || username.length < 3) {
    errors.push("Username must be at least 3 characters long");
    ctx.set("errors", errors);
    ctx.set("isValid", false);
  }
  
  console.log(`✓ Username validation completed for: ${username}`);
  await next();
});

// Step 2: Validate email
const validateEmail = createStep<UserContext>(async (ctx, next) => {
  const email = ctx.get("email");
  const errors = ctx.get("errors") || [];
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid email format");
    ctx.set("errors", errors);
    ctx.set("isValid", false);
  }
  
  console.log(`✓ Email validation completed for: ${email}`);
  await next();
});

// Step 3: Final validation check
const finalValidation = createStep<UserContext>(async (ctx, next) => {
  const errors = ctx.get("errors") || [];
  const isValid = errors.length === 0;
  
  ctx.set("isValid", isValid);
  
  if (isValid) {
    console.log("🎉 All validations passed!");
  } else {
    console.log("❌ Validation failed:", errors);
  }
  
  await next();
});

// Create and run the validation chain
async function runBasicExample() {
  console.log("=== Basic Usage Example ===\n");
  
  try {
    const chain = createChain<UserContext>()
      .use(validateUsername, validateEmail, finalValidation)
      .setDelay(500); // Add small delay between steps
    
    const context = await chain.run();
    
    // Set some test data
    context.set("username", "john_doe");
    context.set("email", "john@example.com");
    context.set("errors", []);
    
    // Run the chain again with data
    await chain.run();
    
    console.log("\nFinal context:");
    console.log("- Username:", context.get("username"));
    console.log("- Email:", context.get("email"));
    console.log("- Is Valid:", context.get("isValid"));
    console.log("- Errors:", context.get("errors"));
    
  } catch (error) {
    console.error("Error in chain execution:", error);
  }
}

// Run the example if this file is executed directly
if (import.meta.main) {
  runBasicExample();
}

export { runBasicExample };