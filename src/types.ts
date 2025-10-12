import { Context as ContextClass } from "@/context.ts";

export type Next = () => Promise<void>;

export type Step<T extends Record<PropertyKey, unknown>> = (
  context: ContextClass<T>,
  next: Next,
) => Promise<void>;

export type Context = typeof ContextClass;
