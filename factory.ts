import { Chain } from "./chain.ts";
import type { Step } from "./types.ts";

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
