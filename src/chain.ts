import { Context } from "@/context.ts";
import { delay } from "@std/async/delay";
import { Next, Step } from "@/types.ts";

/**
 * Chain of Responsibility implementation that executes steps sequentially.
 * Each step can modify the context and decide whether to continue to the next step.
 * 
 * @template T - The type of the context data that flows through the chain
 */
export class Chain<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>,
> {
  private delay = 0;
  private steps: Step<T>[] = [];

  /**
   * Adds one or more steps to the chain.
   * Steps will be executed in the order they are added.
   * 
   * @param steps - The steps to add to the chain
   * @returns The chain instance for method chaining
   */
  public use(...steps: Step<T>[]): this {
    this.steps.push(...steps);
    return this;
  }

  /**
   * Sets a delay between step executions.
   * The delay is applied before each step execution (except the first one).
   * 
   * @param delay - Delay in milliseconds (must be non-negative)
   * @returns The chain instance for method chaining
   * @throws Will throw an error if delay is negative
   */
  public setDelay(delay: number): this {
    if (delay < 0) {
      throw new Error('Delay must be non-negative');
    }
    this.delay = delay;
    return this;
  }

  /**
   * Executes all steps in the chain sequentially.
   * Creates a new context and passes it through all steps.
   * 
   * @returns Promise that resolves to the final context after all steps have been executed
   * @throws Will throw an error if any step throws an error
   */
  public async run(): Promise<Context<T>> {
    const ctx = new Context<T>();

    const dispatch = async (index: number) => {
      if (index >= this.steps.length) return;

      const next: Next = () => dispatch(index + 1);

      const step = this.steps[index];

      if (this.delay > 0 && index > 0) await delay(this.delay);

      await step(ctx, next);
    };

    await dispatch(0);

    return ctx;
  }

  /**
   * Gets the number of steps in the chain.
   * 
   * @returns The number of steps currently in the chain
   */
  public getStepCount(): number {
    return this.steps.length;
  }

  /**
   * Gets the current delay setting.
   * 
   * @returns The delay in milliseconds
   */
  public getDelay(): number {
    return this.delay;
  }
}
