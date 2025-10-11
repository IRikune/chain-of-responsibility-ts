import type { Context } from "./context.ts";

export type Next = () => Promise<void>

export type Step<T extends Record<PropertyKey, unknown>> =
    (context: Context<T>, next: Next) => Promise<void>;