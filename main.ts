// deno-lint-ignore-file ban-types
import { delay } from "jsr:@std/async/delay";

export type NextStep = IteratorYieldResult<Step>;

type Step = (context: Context<any>, next: NextStep) => Promise<void>;


// deno-lint-ignore no-explicit-any
export class Context<T extends Record<string, any> = {}> {
  // deno-lint-ignore no-explicit-any
  private data = new Map<string, any>();

  public set<K extends string, V>(key: K, value: V): Context<T & Record<K, V>> {
    this.data.set(key, value);
    return this as unknown as Context<T & Record<K, V>>;
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this.data.get(key as string) as T[K];
  }
}


// deno-lint-ignore no-explicit-any
export class Chain<T extends Record<string, any> = {}> {
  private current_step: number = 0;
  private steps: Step[] = [];
  private timer = 0;
  private isRunning = false;
  public context: Context<T> = new Context<T>();

  constructor() {
    this.context = new Context<T>();
  }

  public getContext(): Context<T> {
    return this.context;
  }

  public addStep(step: Step) {
    this.steps.push(step);
  }

  public setSteps(steps: Step[]) {
    this.steps = steps;
    return this;
  }

  public setTimer(timer: number) {
    this.timer = timer;
    return this;
  }

  public setCurrentStep(step: number) {
    if (step < 0 || step >= this.steps.length) {
      throw new Error("Invalid step index");
    }
    this.current_step = step;
  }

  public getCurrentStep() {
    return this.current_step;
  }

  private *generateSteps(steps: Step[]) {
    for (const step of steps) {
      yield step;
    }
  }

  private setIsRunning(value: boolean) {
    this.isRunning = value;
  }

  public async run() {
    this.setIsRunning(true);
    const stepGenerator = this.generateSteps(this.steps);
    for await (const step of stepGenerator) {
      const current_step = stepGenerator.next()
      if (!current_step.done) {
        await delay(this.timer);
        await step(this.context, stepGenerator.next);
      }
      if (current_step.done) {
        this.setIsRunning(false);
      }
    }
  }
}

interface PersonContext {
  name: string;
  age: number;
}

const chain1 = new Chain<PersonContext>();

chain1
  .getContext()
  .get("age")