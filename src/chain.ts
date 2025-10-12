import { Context } from "@/context.ts";
import { delay } from "@/utils/delay.ts";
import { Next, Step } from "@/types.ts";

export class Chain<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>,
> {
  private delay = 0;
  private steps: Step<T>[] = [];

  public use(...steps: Step<T>[]): this {
    this.steps.push(...steps);
    return this;
  }

  public setDelay(delay: number): this {
    this.delay = delay;
    return this;
  }

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
}
