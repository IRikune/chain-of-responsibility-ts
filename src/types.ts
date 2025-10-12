import type { Context as ContextClass } from "@/context.ts";

/**
 * Function type for continuing to the next step in the chain.
 * Should be called to proceed to the next step, or not called to break the chain.
 */
export type Next = () => Promise<void>;

/**
 * Function type for a chain step.
 * Receives a context and a next function, and can perform async operations.
 *
 * @template T - The type of the context data
 * @param context - The context instance containing shared data
 * @param next - Function to call to proceed to the next step
 */
export type Step<T extends Record<PropertyKey, unknown>> = (
  context: ContextClass<T>,
  next: Next,
) => Promise<void>;

/**
 * Type alias for the Context class constructor.
 */
export type Context = typeof ContextClass;
