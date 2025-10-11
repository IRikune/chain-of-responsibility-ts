import { Chain } from "@/chain.ts";
import type { Step } from "@/types.ts";
import { Context } from "./context.ts";

/**
 * Creates a typed step for the chain of responsibility.
 * A step is a middleware function that receives a context and a next function.
 * 
 * @template T - The type of the context data
 * @param step - The step function to be executed in the chain
 * @returns The same step function, but with better type inference
 * 
 * @example
 * ```typescript
 * const myStep = createStep<{ count: number }>(async (ctx, next) => {
 *   const count = ctx.get('count');
 *   ctx.set('count', count + 1);
 *   await next();
 * });
 * ```
 */
export function createStep<T extends Record<PropertyKey, unknown>>(
  step: Step<T>,
) {
  return step;
}

/**
 * Creates a new chain of responsibility instance.
 * The chain allows you to add multiple steps that will be executed sequentially.
 * 
 * @template T - The type of the context data that will flow through the chain
 * @returns A new Chain instance
 * 
 * @example
 * ```typescript
 * const chain = createChain<{ userId: string, processed: boolean }>()
 *   .use(validateUser, processData, saveResult)
 *   .setDelay(100);
 *   
 * const result = await chain.run();
 * ```
 */
export function createChain<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>,
>() {
  return new Chain<T>();
}

/**
 * Creates a new context instance for storing and sharing data between steps.
 * 
 * @template T - The type of the context data
 * @returns A new Context instance
 * 
 * @example
 * ```typescript
 * const context = createContext<{ name: string, age: number }>();
 * context.set('name', 'John').set('age', 30);
 * ```
 */
export function createContext<T extends Record<PropertyKey, unknown>>() {
  return new Context<T>();
}
