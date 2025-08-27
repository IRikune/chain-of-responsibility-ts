// deno-lint-ignore-file no-explicit-any

// deno-lint-ignore ban-types
export class Context<T extends Record<string, any> = {}> {
    private data = new Map<string, any>();

    public set<K extends string, V>(key: K, value: V): Context<T & Record<K, V>> {
        this.data.set(key, value);
        return this as unknown as Context<T & Record<K, V>>;
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.data.get(key as string) as T[K];
    }
}

interface PersonContext {
    name: string;
}
let ctx = new Context<PersonContext>();
ctx = ctx.set("name", "John Doe");

console.log(ctx.get("name"));