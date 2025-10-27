import { createChain } from "@/factory.ts";

const chain = await createChain<{ foo: string }>()
  .run({ foo: "bar" });

const chain2 = createChain<{ foo: string }>()
  .run(chain);
