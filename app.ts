import { Chain, NextStep } from "./main.ts";
import { Context } from "./types.ts";

interface CalculatorContext {
    a: number;
    b: number;
    cumulative: number;
}
const chain = new Chain<CalculatorContext>();

async function add(c: Context<CalculatorContext>, next: NextStep) {
    const cumulative = c.get("cumulative");
    const a = c.get("a");
    const b = c.get("b");
    const result = a + b;
    c.set("result", result);
    c.set("cumulative", cumulative + result);
    console.log("Addition result:", result);
    await next();
}

async function multiply(c: Context<CalculatorContext>, next: NextStep) {
    const cumulative = c.get("cumulative");
    const a = c.get("a");
    const b = c.get("b");
    const result = a * b;
    c.set("result", result);
    c.set("cumulative", cumulative + result);
    console.log("Multiplication result:", result);
    await next();
}

async function subtract(c: Context<CalculatorContext>, next: NextStep) {
    const cumulative = c.get("cumulative");
    const a = c.get("a");
    const b = c.get("b");
    const result = a - b;
    c.set("result", result);
    c.set("cumulative", cumulative + result);
    console.log("Subtraction result:", result);
    await next();
}
async function divide(c: Context<CalculatorContext>, next: NextStep) {
    const cumulative = c.get("cumulative");
    const a = c.get("a");
    const b = c.get("b");
    const result = a / b;
    c.set("result", result);
    c.set("cumulative", cumulative + result);
    console.log("Division result:", result);
    await next();
}


const steps = [
    add,
    multiply,
    subtract,
    divide
]

chain
    .setSteps(steps)
    .setTimer(1000)
    .getContext()
    .set("a", 1)
    .set("b", 2)
    .set("cumulative", 0);
chain
    .run()