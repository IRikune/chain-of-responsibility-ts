/**
 * Context class for storing and sharing data between chain steps.
 * Uses a Map internally to store key-value pairs with full type safety.
 * 
 * @template T - The type definition for the context data structure
 */
export class Context<T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>> {

    private data = new Map<keyof T, T[keyof T]>();

    /**
     * Sets a value in the context for the specified key.
     * 
     * @template K - The key type, must be a key of T
     * @param key - The key to set
     * @param value - The value to associate with the key
     * @returns The context instance for method chaining
     */
    public set<K extends keyof T>(key: K, value: T[K]): Context<T> {
        this.data.set(key, value);
        return this as Context<T>;
    }

    /**
     * Gets a value from the context by key.
     * 
     * @template K - The key type, must be a key of T
     * @param key - The key to retrieve
     * @returns The value associated with the key, or undefined if not found
     */
    public get<K extends keyof T>(key: K): T[K] {
        return this.data.get(key) as T[K];
    }

    /**
     * Checks if a key exists in the context.
     * 
     * @template K - The key type, must be a key of T
     * @param key - The key to check
     * @returns True if the key exists, false otherwise
     */
    public has<K extends keyof T>(key: K): boolean {
        return this.data.has(key);
    }

    /**
     * Removes a key from the context.
     * 
     * @template K - The key type, must be a key of T
     * @param key - The key to remove
     * @returns True if the key was removed, false if it didn't exist
     */
    public delete<K extends keyof T>(key: K): boolean {
        return this.data.delete(key);
    }

    /**
     * Clears all data from the context.
     */
    public clear(): void {
        this.data.clear();
    }

    /**
     * Gets all keys in the context.
     * 
     * @returns An array of all keys
     */
    public keys(): (keyof T)[] {
        return Array.from(this.data.keys());
    }

    /**
     * Gets the number of items in the context.
     * 
     * @returns The number of key-value pairs
     */
    public size(): number {
        return this.data.size;
    }
}
