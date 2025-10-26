import type { Context as ContextClass } from "@/context.ts";
import type { Chain as ChainClass } from "@/chain.ts";

export type Next = () => Promise<void>;

export type Step<T extends Record<PropertyKey, unknown>> = (
  context: ContextClass<T>,
  next: Next,
) => Promise<void>;

export type Context = typeof ContextClass;

export type Chain = typeof ChainClass;
