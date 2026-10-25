export class RandomizedSet<T, K> {
    private items: T[] = [];
    private indices = new Map<K, number>();
    private readonly key: (item: T) => K;

    constructor(key: (item: T) => K) {
        this.key = key;
    }

    private search(key: K) {
        return this.indices.has(key);
    }

    get length() {
        return this.items.length;
    }

    insert(item: T): boolean {
        const key = this.key(item);
        if (this.search(key))
            return false;

        this.items.push(item);
        this.indices.set(key, this.items.length - 1);

        return true;
    }

    remove(item: T): boolean {
        const key = this.key(item);
        if (!this.search(key))
            return false;

        const removedIndex = this.indices.get(key);
        const lastItem = this.items[this.items.length - 1];

        this.items[removedIndex!] = lastItem;
        this.items.pop();
        this.indices.set(this.key(lastItem), removedIndex!);

        this.indices.delete(key);

        return true;
    }

    getRandom(): T {
        return this.items[Math.floor(Math.random() * this.items.length)];
    }
}