import { Chain } from "@/chain.ts";
import { Context } from "@/context.ts";
import type { Step } from "@/types.ts";

export function createStep<T extends Record<PropertyKey, unknown>>(
  step: Step<T>,
): Step<T> {
  return step;
}

export function createChain<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>,
>(): Chain<T> {
  return new Chain<T>();
}

export function createContext<
  T extends Record<PropertyKey, unknown>,
>(): Context<T> {
  return new Context<T>();
}
