import { Chain } from "@/chain.ts";
import type { Step } from "@/types.ts";
import { Context } from "@/context.ts";

export function createStep<T extends Record<PropertyKey, unknown>>(
  step: Step<T>,
) {
  return step;
}

export function createChain<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>,
>() {
  return new Chain<T>();
}

export function createContext<T extends Record<PropertyKey, unknown>>() {
  return new Context<T>();
}
