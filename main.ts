import { createChain, createStep } from "./src/factory.ts";

type SumContext = {
  a: number;
  b: number;
  cumulative: number;
};

const setValues = createStep<SumContext>(async (c, next) => {
  const a = c.get("a");
  c.set("cumulative", 12);
  c.set("b", 2);
  await next();
});

const calculateSum = createStep<SumContext>(async (c, next) => {
  const a = c.get("a");
  const b = c.get("b");
  const result = a + b;
  c.set("cumulative", result);
  await next();
});

const showResult = createStep<SumContext>(async (c, next) => {
  const cumulative = c.get("cumulative");
  console.log("Cumulative sum:", cumulative);
  await next();
});

try {
  const chain = createChain<SumContext>()
    .use(setValues, calculateSum, showResult)
    .setDelay(1000)
    .run();
} catch (error) {
  console.error("Error occurred:", error);
}
