import type { Context as ContextClass } from "@/context.ts";
import type { Chain as ChainClass } from "@/chain.ts";

export type Next = () => Promise<void>;

export type Retry = () => Promise<void>;

export type Step<T extends Record<PropertyKey, unknown>> = (
  context: ContextClass<T>,
  next: Next,
  retry: Retry,
) => Promise<void>;

export type Context<T extends Record<PropertyKey, unknown>> = ContextClass<
  T
>;

export type Chain = typeof ChainClass;
