export class Context<T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>> {

    private data = new Map<keyof T, T[keyof T]>();

    public set<K extends keyof T>(key: K, value: T[K]): Context<T> {
        this.data.set(key, value);
        return this as Context<T>;
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.data.get(key) as T[K];
    }
}
